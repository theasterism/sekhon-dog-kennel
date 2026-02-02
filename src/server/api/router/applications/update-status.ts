import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { sendEmail } from "@/server/email/send";
import { applicationApprovedEmail } from "@/server/email/templates";
import { Result } from "@/utils/result";

export const updateStatus = protectedProcedure
  .input(z.object({ id: z.string(), status: z.enum(["pending", "approved", "rejected"]) }))
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const { id, status } = input;

    const [existing] = await db
      .select({
        id: ApplicationTable.id,
        email: ApplicationTable.email,
        applicantName: ApplicationTable.applicantName,
        dogId: ApplicationTable.dogId,
      })
      .from(ApplicationTable)
      .where(eq(ApplicationTable.id, id));

    if (!existing) {
      throw { code: "NOT_FOUND" as const, message: "Application not found" };
    }

    const result = await Result.tryCatchAsync(
      async () => {
        const [updated] = await db
          .update(ApplicationTable)
          .set({ status })
          .where(eq(ApplicationTable.id, id))
          .returning();

        return updated;
      },
      (e) => ({ code: "DB_ERROR" as const, message: "Failed to update application status", cause: e }),
    );

    if (result.isErr()) throw result.error;

    if (status === "approved" && existing.email) {
      const [dog] = await db.select({ name: DogTable.name }).from(DogTable).where(eq(DogTable.id, existing.dogId));

      const dogName = dog?.name ?? "your selected dog";
      const email = applicationApprovedEmail({
        applicantName: existing.applicantName,
        dogName,
      });

      await sendEmail({
        to: existing.email,
        subject: email.subject,
        html: email.html,
      });
    }

    return result.value;
  });
