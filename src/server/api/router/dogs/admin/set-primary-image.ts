import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const setPrimaryImage = protectedProcedure
  .input(z.object({ imageId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const { imageId } = input;

    const [image] = await db.select().from(DogImageTable).where(eq(DogImageTable.id, imageId));

    if (!image) {
      return Result.err({ code: "NOT_FOUND" as const, message: "Image not found" });
    }

    const result = await Result.tryCatchAsync(
      async () => {
        await db.update(DogImageTable).set({ isPrimary: false }).where(eq(DogImageTable.dogId, image.dogId));
        await db.update(DogImageTable).set({ isPrimary: true }).where(eq(DogImageTable.id, imageId));

        return { success: true as const };
      },
      (e) => ({ code: "DB_ERROR" as const, message: "Failed to set primary image", cause: e }),
    );

    return result;
  });
