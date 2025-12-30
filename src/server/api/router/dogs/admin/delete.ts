import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { o, requireAuth } from "@/server/api/orpc";
import { DogTable } from "@/server/db/schema";

export const deleteDog = o
  .use(requireAuth)
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { db, bucket } = context;
    const { id } = input;

    // Verify dog exists
    const [dog] = await db.select({ id: DogTable.id }).from(DogTable).where(eq(DogTable.id, id));

    if (!dog) {
      throw new ORPCError("NOT_FOUND", { message: "Dog not found" });
    }

    // Delete all images from R2 using scan
    const prefix = `dogs/${id}/`;
    for await (const [key] of bucket.scan(prefix)) {
      await bucket.remove(key);
    }

    // Delete dog record (cascades to DogImageTable)
    await db.delete(DogTable).where(eq(DogTable.id, id));

    return { success: true };
  });
