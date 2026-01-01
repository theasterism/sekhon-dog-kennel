import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/server/storage/r2";
import { createId } from "@/server/utils";
import { Result } from "@/utils/result";

export const uploadImage = protectedProcedure
  .input(
    z.object({
      dogId: z.string(),
      file: z.instanceof(File),
      isPrimary: z.boolean().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db, bucket } = ctx;
    const { dogId, file, isPrimary } = input;

    const [dog] = await db.select({ id: DogTable.id }).from(DogTable).where(eq(DogTable.id, dogId));

    if (!dog) {
      throw { code: "NOT_FOUND" as const, message: "Dog not found" };
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
    const ext = file.name.split(".").pop() || "jpg";
    const r2Key = `dogs/${dogId}/${imageId}.${ext}`;

    const result = await Result.tryCatchAsync(
      async () => {
        await bucket.set(r2Key, file, {
          contentType: file.type,
          size: file.size,
        });

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

        await db.insert(DogImageTable).values({
          id: imageId,
          dogId,
          r2Key,
          isPrimary: isPrimary ?? false,
          displayOrder,
        });

        return { imageId, r2Key };
      },
      (e) => ({ code: "UPLOAD_ERROR" as const, message: "Failed to upload image", cause: e }),
    );

    if (result.isErr()) throw result.error;

    return result.value;
  });
