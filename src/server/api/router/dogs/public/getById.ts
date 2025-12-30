import { and, eq, isNotNull } from "drizzle-orm";
import * as z from "zod";
import { o } from "@/server/api/orpc";
import { DogImageTable, DogTable } from "@/server/db/schema";

export const getDogById = o
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { db } = context;

    const [data] = await db
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
        },
        image: {
          id: DogImageTable.id,
          r2Key: DogImageTable.r2Key,
          isPrimary: DogImageTable.isPrimary,
          displayOrder: DogImageTable.displayOrder,
        },
      })
      .from(DogTable)
      .where(and(eq(DogTable.id, input.id), isNotNull(DogTable.publishedAt)))
      .leftJoin(DogImageTable, eq(DogTable.id, DogImageTable.dogId));

    return data;
  });
