import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { o, requireAuth } from "@/server/api/orpc";
import { DogImageTable } from "@/server/db/schema";

export const deleteImage = o
  .use(requireAuth)
  .input(
    z.object({
      imageId: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { db, bucket } = context;
    const { imageId } = input;

    // Fetch image record
    const [image] = await db.select().from(DogImageTable).where(eq(DogImageTable.id, imageId));

    if (!image) {
      throw new ORPCError("NOT_FOUND", { message: "Image not found" });
    }

    // Delete from R2
    await bucket.remove(image.r2Key);

    // Delete from DB
    await db.delete(DogImageTable).where(eq(DogImageTable.id, imageId));

    return { success: true };
  });
