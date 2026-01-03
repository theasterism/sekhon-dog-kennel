import { publicProcedure } from "@/server/api/trpc";
import { logger } from "@/server/logger";
import { ContactFormSchema } from "@/utils/validations/contact";
import { Result } from "@/utils/result";

export const submit = publicProcedure.input(ContactFormSchema).mutation(async ({ input }) => {
  const result = await Result.tryCatchAsync(
    async () => {
      logger.info("contact.submitted", {
        name: input.name,
        email: input.email,
      });
      return { success: true as const };
    },
    (e) => ({ code: "SUBMIT_ERROR" as const, message: "Failed to submit contact form", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
