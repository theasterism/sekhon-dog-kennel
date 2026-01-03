import { eq } from "drizzle-orm";
import * as z from "zod";
import { siteConfig } from "@/config/site";
import { publicProcedure } from "@/server/api/trpc";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { sendEmail } from "@/server/email/send";
import { applicationConfirmationEmail, newApplicationAdminEmail } from "@/server/email/templates";
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
    .select({ id: DogTable.id, name: DogTable.name, status: DogTable.status })
    .from(DogTable)
    .where(eq(DogTable.id, input.dogId));

  if (!dog) {
    throw { code: "NOT_FOUND" as const, message: "Dog not found" };
  }

  if (dog.status !== "available") {
    throw {
      code: "DOG_NOT_AVAILABLE" as const,
      message: "This dog is no longer available for applications",
    };
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

  if (result.isErr()) throw result.error;

  // Send email notifications (fire and forget - don't block on email)
  const adminEmail = newApplicationAdminEmail({
    applicantName: input.applicantName,
    dogName: dog.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    applicationId: id,
  });

  const confirmationEmail = applicationConfirmationEmail({
    applicantName: input.applicantName,
    dogName: dog.name,
  });

  // Send to admin (fire and forget - sendEmail logs its own errors)
  sendEmail({
    to: siteConfig.contact.email,
    subject: adminEmail.subject,
    html: adminEmail.html,
  });

  // Send confirmation to applicant
  sendEmail({
    to: input.email,
    subject: confirmationEmail.subject,
    html: confirmationEmail.html,
  });

  return result.value;
});
