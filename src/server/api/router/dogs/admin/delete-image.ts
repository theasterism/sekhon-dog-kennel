import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const deleteImage = protectedProcedure
  .input(z.object({ imageId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { db, bucket } = ctx;
    const { imageId } = input;

    const [image] = await db.select().from(DogImageTable).where(eq(DogImageTable.id, imageId));

    if (!image) {
      throw { code: "NOT_FOUND" as const, message: "Image not found" };
    }

    const result = await Result.tryCatchAsync(
      async () => {
        await bucket.remove(image.r2Key);
        await db.delete(DogImageTable).where(eq(DogImageTable.id, imageId));

        return { success: true as const };
      },
      (e) => ({ code: "DELETE_ERROR" as const, message: "Failed to delete image", cause: e }),
    );

    if (result.isErr()) throw result.error;

    return result.value;
  });
