import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const getByIdAdmin = protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
      const rows = await db
        .select({
          dog: {
            id: DogTable.id,
            name: DogTable.name,
            breed: DogTable.breed,
            dateOfBirth: DogTable.dateOfBirth,
            gender: DogTable.gender,
            size: DogTable.size,
            color: DogTable.color,
            weight: DogTable.weight,
            description: DogTable.description,
            status: DogTable.status,
            price: DogTable.price,
            microchipped: DogTable.microchipped,
            vaccinations: DogTable.vaccinations,
            dewormings: DogTable.dewormings,
            vetChecked: DogTable.vetChecked,
            publishedAt: DogTable.publishedAt,
          },
          image: {
            id: DogImageTable.id,
            r2Key: DogImageTable.r2Key,
            isPrimary: DogImageTable.isPrimary,
            displayOrder: DogImageTable.displayOrder,
          },
        })
        .from(DogTable)
        .where(eq(DogTable.id, input.id))
        .leftJoin(DogImageTable, eq(DogTable.id, DogImageTable.dogId));

      if (rows.length === 0) {
        return null;
      }

      const dog = rows[0].dog;
      const images = rows
        .map((r) => r.image)
        .filter((img): img is NonNullable<typeof img> => img !== null && img.id !== null)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      return { ...dog, images };
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to get dog", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
