import * as z from "zod";

export const AuthLoginSchema = z.object({
  username: z.string().min(5, "Required").max(32, "Username must be at most 32 characters."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(32, "Password must be at most 32 characters."),
});

export const AuthSetupSchema = z
  .object({
    username: z.string().min(5, "Required").max(32, "Username must be at most 32 characters."),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters.")
      .max(32, "Password must be at most 32 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
