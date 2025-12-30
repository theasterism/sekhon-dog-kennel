import { type StorageAdapter } from "./adapter";

interface CloudflareR2Options {
  bucket: R2Bucket;
}

function makeLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise((resolve, reject) => {
      const run = async () => {
        active++;
        try {
          const res = await fn();
          resolve(res);
        } catch (e) {
          reject(e);
        } finally {
          active--;
          if (queue.length) {
            const next = queue.shift()!;
            next();
          }
        }
      };

      if (active < concurrency) {
        run();
      } else {
        queue.push(run);
      }
    });
}

type FileInput = ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob;

interface FileMetadata {
  contentType: string;
  size: number;
  [key: string]: string | number | undefined;
}

export function R2Storage(opts: CloudflareR2Options): StorageAdapter {
  const PAGE_LIMIT = 1000;
  const MAX_CONCURRENCY = 50;
  const limiter = makeLimiter(MAX_CONCURRENCY);

  return {
    async get<T>(key: string) {
      const value = await opts.bucket.get(key);
      if (!value) return;

      return value as T;
    },

    async set(key: string, value: FileInput, metadata: FileMetadata) {
      await opts.bucket.put(key, value, {
        customMetadata: toR2Metadata(metadata),
        httpMetadata: {
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    },

    async remove(key: string) {
      await opts.bucket.delete(key);
    },

    async *scan<T>(prefix: string) {
      let cursor: string | undefined;
      do {
        const resp = await opts.bucket.list({
          prefix: prefix,
          cursor,
          limit: PAGE_LIMIT,
        });

        // @ts-expect-error shut up!
        const { objects, truncated, cursor: nextCursor } = resp;

        // fetch each value under concurrency limit
        const results = await Promise.all(
          objects.map((o) =>
            limiter(async () => {
              const v = await opts.bucket.get(o.key);

              return v !== null ? ([o.key, v] as [string, T]) : null;
            }),
          ),
        );

        for (const pair of results) {
          if (pair) yield pair;
        }

        cursor = truncated ? nextCursor : undefined;
      } while (cursor);
    },
  };
}

interface UploadOptions {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function generateObjectKey(id: string, fileName: string, prefix: string = "photos") {
  const fileExtension = fileName.split(".").pop() || "jpg";
  return `${prefix}/${id}.${fileExtension}`;
}

export const validateUpload = (options: UploadOptions): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(options.fileType)) {
    return { valid: false, error: "Invalid file type" };
  }

  if (options.fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large" };
  }

  return { valid: true };
};

function toR2Metadata(metadata: FileMetadata): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined) {
      result[key] = String(value);
    }
  }

  return result;
}
