import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { logger } from "@/server/logger";
import type { StorageAdapter } from "@/server/storage/adapter";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/server/storage/r2";
import { createId } from "@/server/utils";
import { Result } from "@/utils/result";

const IMAGE_SIZES = {
  full: { maxDimension: 1920, suffix: "" },
  medium: { maxDimension: 800, suffix: "_md" },
  thumbnail: { maxDimension: 400, suffix: "_sm" },
} as const;

const IMAGE_QUALITY = 85;
const MAX_IMAGES_PER_DOG = 3;

async function optimizeAndStore(
  images: ImagesBinding,
  bucket: StorageAdapter,
  inputStream: ReadableStream<Uint8Array>,
  baseKey: string,
  maxDimension: number,
): Promise<number> {
  const optimizedResult = await images
    .input(inputStream)
    .transform({
      width: maxDimension,
      fit: "cover",
    })
    .output({
      format: "image/webp",
      quality: IMAGE_QUALITY,
    });

  const response = optimizedResult.response();
  const arrayBuffer = await response.arrayBuffer();

  await bucket.set(baseKey, arrayBuffer, {
    contentType: "image/webp",
    size: arrayBuffer.byteLength,
  });

  return arrayBuffer.byteLength;
}

export const uploadImage = protectedProcedure.input(z.instanceof(FormData)).mutation(async ({ ctx, input }) => {
  const { db, bucket, images } = ctx;

  const dogId = input.get("dogId") as string | null;
  const file = input.get("file") as File | null;
  const isPrimaryStr = input.get("isPrimary") as string | null;
  const isPrimary = isPrimaryStr === "true";

  if (!dogId || !file) {
    throw { code: "VALIDATION_ERROR" as const, message: "dogId and file are required" };
  }

  const [dog] = await db.select({ id: DogTable.id }).from(DogTable).where(eq(DogTable.id, dogId));

  if (!dog) {
    throw { code: "NOT_FOUND" as const, message: "Dog not found" };
  }

  const existingImages = await db
    .select({ id: DogImageTable.id })
    .from(DogImageTable)
    .where(eq(DogImageTable.dogId, dogId));

  if (existingImages.length >= MAX_IMAGES_PER_DOG) {
    throw {
      code: "VALIDATION_ERROR" as const,
      message: `Maximum ${MAX_IMAGES_PER_DOG} images allowed per dog`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw {
      code: "VALIDATION_ERROR" as const,
      message: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    throw {
      code: "VALIDATION_ERROR" as const,
      message: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  const imageId = createId();
  const baseR2Key = `dogs/${dogId}/${imageId}`;

  const result = await Result.tryCatchAsync(
    async () => {
      // Get the file as array buffer once, then create streams for each size
      const originalBuffer = await file.arrayBuffer();

      // Process all sizes in parallel
      await Promise.all(
        Object.entries(IMAGE_SIZES).map(async ([, { maxDimension, suffix }]) => {
          const r2Key = `${baseR2Key}${suffix}.webp`;
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(new Uint8Array(originalBuffer));
              controller.close();
            },
          });
          await optimizeAndStore(images, bucket, stream, r2Key, maxDimension);
        }),
      );

      if (isPrimary) {
        await db.update(DogImageTable).set({ isPrimary: false }).where(eq(DogImageTable.dogId, dogId));
      }

      const [maxOrder] = await db
        .select({ displayOrder: DogImageTable.displayOrder })
        .from(DogImageTable)
        .where(eq(DogImageTable.dogId, dogId))
        .orderBy(DogImageTable.displayOrder)
        .limit(1);

      const displayOrder = (maxOrder?.displayOrder ?? -1) + 1;

      // Store the base key without extension - we'll append size suffix when serving
      const r2Key = `${baseR2Key}.webp`;

      await db.insert(DogImageTable).values({
        id: imageId,
        dogId,
        r2Key,
        isPrimary: isPrimary ?? false,
        displayOrder,
      });

      return { imageId, r2Key };
    },
    (e) => {
      logger.exception("image.upload.failed", e, { dogId, imageId, file_size: file.size, file_type: file.type });
      return { code: "UPLOAD_ERROR" as const, message: "Failed to upload image", cause: e };
    },
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
