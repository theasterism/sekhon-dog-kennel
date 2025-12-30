import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { o, requireAuth } from "@/server/api/orpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/server/storage/r2";
import { createId } from "@/server/utils";

export const uploadImage = o
  .use(requireAuth)
  .input(
    z.object({
      dogId: z.string(),
      file: z.instanceof(File),
      isPrimary: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { db, bucket } = context;
    const { dogId, file, isPrimary } = input;

    // Verify dog exists
    const [dog] = await db.select({ id: DogTable.id }).from(DogTable).where(eq(DogTable.id, dogId));

    if (!dog) {
      throw new ORPCError("NOT_FOUND", { message: "Dog not found" });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ORPCError("BAD_REQUEST", {
        message: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ORPCError("BAD_REQUEST", {
        message: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    // Generate image ID and R2 key
    const imageId = createId();
    const ext = file.name.split(".").pop() || "jpg";
    const r2Key = `dogs/${dogId}/${imageId}.${ext}`;

    // Upload to R2
    await bucket.set(r2Key, file, {
      contentType: file.type,
      size: file.size,
    });

    // If setting as primary, unset other primary images
    if (isPrimary) {
      await db.update(DogImageTable).set({ isPrimary: false }).where(eq(DogImageTable.dogId, dogId));
    }

    // Get current max display order
    const [maxOrder] = await db
      .select({ displayOrder: DogImageTable.displayOrder })
      .from(DogImageTable)
      .where(eq(DogImageTable.dogId, dogId))
      .orderBy(DogImageTable.displayOrder)
      .limit(1);

    const displayOrder = (maxOrder?.displayOrder ?? -1) + 1;

    // Insert image record
    await db.insert(DogImageTable).values({
      id: imageId,
      dogId,
      r2Key,
      isPrimary: isPrimary ?? false,
      displayOrder,
    });

    return { imageId, r2Key };
  });
