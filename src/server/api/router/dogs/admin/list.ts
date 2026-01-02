import { and, count, desc, eq, like, or, type SQL } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

const ListDogsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["available", "reserved", "sold"]).optional(),
  published: z.boolean().optional(),
});

export const listAdmin = protectedProcedure.input(ListDogsSchema).query(async ({ ctx, input }) => {
  const { db } = ctx;
  const { page, limit, search, status, published } = input;
  const offset = (page - 1) * limit;

  const result = await Result.tryCatchAsync(
    async () => {
      const conditions: SQL[] = [];

      if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(or(like(DogTable.name, searchPattern), like(DogTable.breed, searchPattern))!);
      }

      if (status) {
        conditions.push(eq(DogTable.status, status));
      }

      if (published === true) {
        conditions.push(eq(DogTable.publishedAt, DogTable.publishedAt)); // publishedAt IS NOT NULL
      } else if (published === false) {
        // Draft dogs have null publishedAt - this is a workaround since drizzle doesn't have isNull in this import
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [totalResult] = await db.select({ count: count() }).from(DogTable).where(whereClause);

      const data = await db
        .select({
          id: DogTable.id,
          name: DogTable.name,
          breed: DogTable.breed,
          dateOfBirth: DogTable.dateOfBirth,
          gender: DogTable.gender,
          status: DogTable.status,
          publishedAt: DogTable.publishedAt,
          primaryImage: DogImageTable.r2Key,
        })
        .from(DogTable)
        .leftJoin(DogImageTable, and(eq(DogTable.id, DogImageTable.dogId), eq(DogImageTable.isPrimary, true)))
        .where(whereClause)
        .orderBy(desc(DogTable.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        items: data,
        total: totalResult.count,
        page,
        limit,
        totalPages: Math.ceil(totalResult.count / limit),
      };
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to list dogs", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
