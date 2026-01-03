import { TRPCError } from "@trpc/server";
import { siteConfig } from "@/config/site";
import { publicProcedure } from "@/server/api/trpc";
import { sendEmail } from "@/server/email/send";
import { contactFormEmail } from "@/server/email/templates";
import { logger } from "@/server/logger";
import { ContactFormSchema, MIN_FORM_TIME_SECONDS } from "@/utils/validations/contact";

export const submit = publicProcedure.input(ContactFormSchema).mutation(async ({ input }) => {
  const { name, email, phone, message, _hp, _ts } = input;

  // Spam check 1: Honeypot field must be empty
  if (_hp && _hp.length > 0) {
    logger.warn("contact.spam.honeypot", { email });
    // Return success to not reveal detection
    return { success: true as const };
  }

  // Spam check 2: Form must have been loaded for at least MIN_FORM_TIME_SECONDS
  if (_ts) {
    const elapsedSeconds = (Date.now() - _ts) / 1000;
    if (elapsedSeconds < MIN_FORM_TIME_SECONDS) {
      logger.warn("contact.spam.timing", { email, elapsed_seconds: elapsedSeconds });
      // Return success to not reveal detection
      return { success: true as const };
    }
  }

  // Send email to admin
  const emailTemplate = contactFormEmail({ name, email, phone, message });

  const result = await sendEmail({
    to: siteConfig.contact.email,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    from: `Sekhon Dog Kennel <noreply@sekhondogkennel.com>`,
  });

  if (!result.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to send message. Please try again or contact us directly.",
    });
  }

  logger.info("contact.sent", { email });

  return { success: true as const };
});
