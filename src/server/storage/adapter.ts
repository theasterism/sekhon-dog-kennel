export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set(
    key: string,
    value: unknown,
    opts: {
      [key: string]: string | number | undefined;
    },
  ): Promise<void>;
  remove(key: string): Promise<void>;
  scan<T>(prefix: string): AsyncIterable<[string, T]>;
}

const SEPARATOR = String.fromCharCode(0x1f);

export function joinKey(key: Array<string>) {
  return key.join(SEPARATOR);
}

export function splitKey(key: string) {
  return key.split(SEPARATOR);
}

export namespace Storage {
  export function get<T>(adapter: StorageAdapter, key: string) {
    return adapter.get(key) as Promise<T | null>;
  }

  export function set(
    adapter: StorageAdapter,
    key: string,
    value: unknown,
    opts: {
      ttl: number;
    },
  ) {
    return adapter.set(key, value, {
      ttl: opts.ttl,
    });
  }

  export function remove(adapter: StorageAdapter, key: string) {
    return adapter.remove(key);
  }

  export function scan<T>(adapter: StorageAdapter, key: string): AsyncIterable<[string, T]> {
    return adapter.scan(key);
  }
}
