import * as z from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
  // Spam protection fields
  _hp: z.string().max(0).optional(), // Honeypot - must be empty
  _ts: z.number().optional(), // Timestamp - form load time
});

// Minimum seconds before form can be submitted (bots submit instantly)
export const MIN_FORM_TIME_SECONDS = 3;
