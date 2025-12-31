import { publicProcedure } from "@/server/api/trpc";
import { ContactFormSchema } from "@/utils/validations/contact";
import { Result } from "@/utils/result";

export const submit = publicProcedure.input(ContactFormSchema).mutation(async ({ input }) => {
  const result = await Result.tryCatchAsync(
    async () => {
      console.log("Contact form submission:", input);
      return { success: true as const };
    },
    (e) => ({ code: "SUBMIT_ERROR" as const, message: "Failed to submit contact form", cause: e }),
  );

  return result;
});
