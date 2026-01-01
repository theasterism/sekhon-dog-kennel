import { and, eq, isNotNull } from "drizzle-orm";
import { publicProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const list = publicProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
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
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to list dogs", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
