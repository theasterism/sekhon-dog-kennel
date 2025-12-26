import { encodeBase64Url } from "@std/encoding";
import { ulid } from "@std/ulid";

/**
 * createId
 *
 * Alias for `ulid()` from `@std/ulid`.
 *
 * @remarks Use this helper to create compact, monotonically-sortable
 * unique IDs. Keeping an alias makes it easy to swap implementations later.
 *
 * @example
 * ```ts
 * const id = createId(); // e.g. "01FZ4ZQJ1Q4KX2QH6YJ8M9P8Q9"
 * ```
 */
export const createId = ulid;

export const utf8Encoder: TextEncoder = new TextEncoder();
export const utf8Decoder: TextDecoder = new TextDecoder();

/**
 * Return a cryptographically-secure random string of the requested
 * length using base64url encoding.
 *
 * Implementation notes:
 * - Internally computes the number of random bytes required to produce
 *   a base64url string of at least `length` characters, encodes those
 *   bytes with `encodeBase64Url`, and then truncates to `length`.
 * - Uses `crypto.getRandomValues` for secure randomness.
 *
 * @param length - Desired output length in characters. Should be a
 *   positive integer.
 * @returns A base64url-encoded string of exactly `length` characters.
 *
 * @example
 * const token = generateRandomString(64);
 */
export function generateRandomString(length: number) {
  const requiredBytes = Math.ceil((length * 3) / 4);

  const buffer = new Uint8Array(requiredBytes);
  crypto.getRandomValues(buffer);

  const encoded = encodeBase64Url(buffer);
  return encoded.slice(0, length);
}
