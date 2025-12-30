import { eq } from "drizzle-orm";
import * as z from "zod";
import { ORPCError } from "@orpc/server";
import { o, requireAuth } from "@/server/api/orpc";
import { DogImageTable } from "@/server/db/schema";

export const setPrimaryImage = o
  .use(requireAuth)
  .input(
    z.object({
      imageId: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { db } = context;
    const { imageId } = input;

    // Fetch image to get dogId
    const [image] = await db.select().from(DogImageTable).where(eq(DogImageTable.id, imageId));

    if (!image) {
      throw new ORPCError("NOT_FOUND", { message: "Image not found" });
    }

    // Unset all other primary images for this dog
    await db.update(DogImageTable).set({ isPrimary: false }).where(eq(DogImageTable.dogId, image.dogId));

    // Set this image as primary
    await db.update(DogImageTable).set({ isPrimary: true }).where(eq(DogImageTable.id, imageId));

    return { success: true };
  });
