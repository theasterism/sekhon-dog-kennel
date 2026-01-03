type LogLevel = "info" | "warn" | "error";

interface WideEvent {
  // Required fields
  timestamp: string;
  event: string;
  service: string;

  // Optional context
  [key: string]: unknown;
}

/**
 * Redact PII from a string value
 * - Email: keeps domain, hashes local part -> "h4x7@example.com"
 * - Phone: shows last 4 digits -> "***-**-1234"
 * - Generic: truncates and masks
 */
function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***@***.***";
  const hash = local.slice(0, 2) + "***";
  return `${hash}@${domain}`;
}

function redactPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `***-***-${digits.slice(-4)}`;
}

function redactName(name: string): string {
  if (name.length <= 2) return "**";
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
}

function redactAddress(_address: string): string {
  return "[REDACTED]";
}

/**
 * Redact PII from log data
 * Automatically detects and redacts common PII fields
 */
function redactPII(data: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      redacted[key] = value;
      continue;
    }

    // Handle nested objects
    if (typeof value === "object" && !Array.isArray(value)) {
      redacted[key] = redactPII(value as Record<string, unknown>);
      continue;
    }

    // Skip non-string values
    if (typeof value !== "string") {
      redacted[key] = value;
      continue;
    }

    // Redact based on key name patterns
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes("email") || lowerKey === "to" || lowerKey === "from") {
      redacted[key] = redactEmail(value);
    } else if (lowerKey.includes("phone") || lowerKey.includes("mobile") || lowerKey.includes("tel")) {
      redacted[key] = redactPhone(value);
    } else if (lowerKey.includes("name") && !lowerKey.includes("error") && !lowerKey.includes("event")) {
      redacted[key] = redactName(value);
    } else if (lowerKey.includes("address") && !lowerKey.includes("ip") && !lowerKey.includes("url")) {
      redacted[key] = redactAddress(value);
    } else if (
      lowerKey.includes("password") ||
      lowerKey.includes("secret") ||
      lowerKey.includes("token") ||
      lowerKey.includes("key") ||
      lowerKey.includes("authorization")
    ) {
      redacted[key] = "[REDACTED]";
    } else if (lowerKey === "input" && typeof value === "object") {
      // Redact tRPC input which may contain PII
      redacted[key] = redactPII(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

function emit(level: LogLevel, event: WideEvent) {
  const output = JSON.stringify(event);

  switch (level) {
    case "info":
      console.info(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "error":
      console.error(output);
      break;
  }
}

function createEvent(event: string, data: Record<string, unknown> = {}): WideEvent {
  const redactedData = redactPII(data);

  return {
    timestamp: new Date().toISOString(),
    event,
    service: "sekhon-dog-kennel",
    ...redactedData,
  };
}

export const logger = {
  info: (event: string, data: Record<string, unknown> = {}) => {
    emit("info", createEvent(event, data));
  },

  warn: (event: string, data: Record<string, unknown> = {}) => {
    emit("warn", createEvent(event, data));
  },

  error: (event: string, data: Record<string, unknown> = {}) => {
    emit("error", createEvent(event, data));
  },

  /**
   * Log an error with full cause chain extraction
   * Note: Stack traces are kept as they don't contain PII
   */
  exception: (event: string, error: unknown, data: Record<string, unknown> = {}) => {
    const err = error instanceof Error ? error : null;
    const cause = err?.cause instanceof Error ? err.cause : null;

    emit(
      "error",
      createEvent(event, {
        ...data,
        error_name: err?.name,
        error_message: err?.message ?? String(error),
        error_stack: err?.stack,
        cause_name: cause?.name,
        cause_message: cause?.message,
        cause_stack: cause?.stack,
      }),
    );
  },
};
