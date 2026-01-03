import { env } from "cloudflare:workers";
import { logger } from "@/server/logger";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = (env as { RESEND_API_KEY?: string }).RESEND_API_KEY;

  if (!apiKey) {
    logger.warn("email.skipped", { reason: "RESEND_API_KEY not configured", to: options.to, subject: options.subject });
    return { success: false, error: "Email not configured" };
  }

  const startTime = Date.now();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from ?? "Sekhon Dog Kennel <noreply@sekhondogkennel.com>",
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    const duration_ms = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("email.failed", {
        to: options.to,
        subject: options.subject,
        status: response.status,
        error_message: errorText,
        duration_ms,
      });
      return { success: false, error: errorText };
    }

    logger.info("email.sent", {
      to: options.to,
      subject: options.subject,
      status: response.status,
      duration_ms,
    });

    return { success: true };
  } catch (error) {
    logger.exception("email.error", error, {
      to: options.to,
      subject: options.subject,
    });
    return { success: false, error: String(error) };
  }
}
