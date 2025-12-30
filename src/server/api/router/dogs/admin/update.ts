import { eq } from "drizzle-orm";
import * as z from "zod";
import { ORPCError } from "@orpc/server";
import { o, requireAuth } from "@/server/api/orpc";
import { DogImageTable, DogTable } from "@/server/db/schema";

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

export const updateDog = o
  .use(requireAuth)
  .input(UpdateDogSchema)
  .handler(async ({ context, input }) => {
    const { db } = context;
    const { id, published, ...inputFields } = input;

    const [existing] = await db.select().from(DogTable).where(eq(DogTable.id, id));

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Dog not found" });
    }

    const fields: Record<string, unknown> = { ...inputFields };

    if (published === true) {
      const merged = { ...existing, ...inputFields };

      if (!merged.name || merged.name === "Untitled") {
        throw new ORPCError("BAD_REQUEST", {
          message: "Cannot publish: name is required",
        });
      }

      const images = await db
        .select({ id: DogImageTable.id })
        .from(DogImageTable)
        .where(eq(DogImageTable.dogId, id))
        .limit(1);

      if (images.length === 0) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Cannot publish: at least one image is required",
        });
      }

      fields.publishedAt = Date.now();
    } else if (published === false) {
      fields.publishedAt = null;
    }

    const [updated] = await db.update(DogTable).set(fields).where(eq(DogTable.id, id)).returning();

    return updated;
  });
