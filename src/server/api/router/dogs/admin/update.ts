import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

const UpdateDogSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  breed: z.string().nullable().optional(),
  dateOfBirth: z.coerce.date().nullable().optional(),
  gender: z.enum(["male", "female"]).nullable().optional(),
  size: z.enum(["small", "medium", "large"]).nullable().optional(),
  color: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["available", "reserved", "sold"]).optional(),
  price: z.number().nullable().optional(),
  microchipped: z.boolean().optional(),
  vaccinations: z.array(z.string()).nullable().optional(),
  dewormings: z.number().optional(),
  vetChecked: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const update = protectedProcedure.input(UpdateDogSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const { id, published, ...inputFields } = input;

  const [existing] = await db.select().from(DogTable).where(eq(DogTable.id, id));

  if (!existing) {
    throw { code: "NOT_FOUND" as const, message: "Dog not found" };
  }

  const fields: Record<string, unknown> = { ...inputFields };

  if (published === true) {
    const merged = { ...existing, ...inputFields };

    if (!merged.name || merged.name === "Untitled") {
      throw {
        code: "VALIDATION_ERROR" as const,
        message: "Cannot publish: name is required",
      };
    }

    const images = await db
      .select({ id: DogImageTable.id })
      .from(DogImageTable)
      .where(eq(DogImageTable.dogId, id))
      .limit(1);

    if (images.length === 0) {
      throw {
        code: "VALIDATION_ERROR" as const,
        message: "Cannot publish: at least one image is required",
      };
    }

    fields.publishedAt = Date.now();
  } else if (published === false) {
    fields.publishedAt = null;
  }

  const result = await Result.tryCatchAsync(
    async () => {
      const [updated] = await db.update(DogTable).set(fields).where(eq(DogTable.id, id)).returning();
      return updated;
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to update dog", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
