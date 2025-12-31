import { eq } from "drizzle-orm";
import * as z from "zod";
import { publicProcedure } from "@/server/api/trpc";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { createId } from "@/server/utils";
import { Result } from "@/utils/result";

const CreateApplicationSchema = z.object({
  dogId: z.string(),
  applicantName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().optional(),
});

export const create = publicProcedure.input(CreateApplicationSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  const [dog] = await db
    .select({ id: DogTable.id, status: DogTable.status })
    .from(DogTable)
    .where(eq(DogTable.id, input.dogId));

  if (!dog) {
    return Result.err({ code: "NOT_FOUND" as const, message: "Dog not found" });
  }

  if (dog.status !== "available") {
    return Result.err({
      code: "DOG_NOT_AVAILABLE" as const,
      message: "This dog is no longer available for applications",
    });
  }

  const id = createId();

  const result = await Result.tryCatchAsync(
    async () => {
      await db.insert(ApplicationTable).values({
        id,
        dogId: input.dogId,
        applicantName: input.applicantName,
        email: input.email,
        phone: input.phone,
        address: input.address,
      });

      return { id };
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to submit application", cause: e }),
  );

  return result;
});
