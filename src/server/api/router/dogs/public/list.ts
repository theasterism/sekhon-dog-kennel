import { and, eq, isNotNull } from "drizzle-orm";
import { o } from "@/server/api/orpc";
import { DogImageTable, DogTable } from "@/server/db/schema";

export const list = o.handler(async ({ context }) => {
  const { db } = context;

  const data = await db
    .select({
      id: DogTable.id,
      name: DogTable.name,
      breed: DogTable.breed,
      dateOfBirth: DogTable.dateOfBirth,
      status: DogTable.status,
      primaryImage: DogImageTable.r2Key,
    })
    .from(DogTable)

    .where(isNotNull(DogTable.publishedAt))
    .leftJoin(DogImageTable, and(eq(DogTable.id, DogImageTable.dogId), eq(DogImageTable.isPrimary, true)));

  return data;
});
