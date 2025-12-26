import { utf8Encoder } from "../utils";

/**
 * Supported SHA (Secure Hash Algorithm) variants.
 *
 * - `SHA-1` - 160-bit hash (deprecated for security, use only for legacy compatibility)
 * - `SHA-256` - 256-bit hash (recommended for most use cases)
 * - `SHA-384` - 384-bit hash (part of SHA-2 family)
 * - `SHA-512` - 512-bit hash (maximum security in SHA-2 family)
 */
type ShaAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Computes a SHA hash of the input and returns it as a hexadecimal string.
 *
 * Uses the Web Crypto API to generate cryptographically secure hash digests.
 * The hash is deterministic - the same input always produces the same output.
 *
 * **Common use cases:**
 * - Content integrity verification (checksums)
 * - Cache key generation
 * - File deduplication
 * - Digital signatures (as part of HMAC)
 *
 * **Security notes:**
 * - SHA-1 is cryptographically broken; use SHA-256 or higher for security-sensitive operations
 * - Hashes alone are not suitable for password storage (use bcrypt, argon2, or PBKDF2)
 * - For message authentication, use HMAC instead of plain hashing
 *
 * @param algorithm - The SHA algorithm variant to use
 * @param input - The data to hash (string will be UTF-8 encoded)
 * @returns Promise resolving to lowercase hexadecimal hash string
 *
 * @example
 * ```typescript
 * // Hash a string
 * const hash = await computeShaHash("SHA-256", "hello world");
 * // Returns: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
 *
 * // Hash binary data
 * const data = new Uint8Array([1, 2, 3, 4]);
 * const binaryHash = await computeShaHash("SHA-256", data);
 *
 * // Generate cache key
 * const cacheKey = await computeShaHash("SHA-256", JSON.stringify(requestData));
 *
 * // Content integrity check
 * const fileHash = await computeShaHash("SHA-512", fileContent);
 * if (fileHash === expectedHash) {
 *   console.log("File integrity verified");
 * }
 * ```
 *
 * @remarks
 * - Output length depends on algorithm: SHA-1 (40 chars), SHA-256 (64 chars), SHA-384 (96 chars), SHA-512 (128 chars)
 * - Hashing is a one-way operation; you cannot recover the original input from the hash
 * - This function is async because it uses the Web Crypto API
 */
export async function computeShaHash(algorithm: ShaAlgorithm, input: string | Uint8Array): Promise<string> {
  const encodedInput = input instanceof Uint8Array ? input : utf8Encoder.encode(input);
  const data = new Uint8Array(encodedInput);
  const buffer = await crypto.subtle.digest(algorithm, data);
  const bytes = new Uint8Array(buffer);

  let hexString = "";
  for (let i = 0; i < bytes.length; i++) {
    hexString += bytes[i]?.toString(16).padStart(2, "0");
  }

  return hexString;
}
