import type { QueryClient } from "@tanstack/react-query";

const CHANNEL_NAME = "sekhon-kennel-sync";

type SyncMessage = {
  type: "invalidate";
  queryKeys: unknown[][];
};

let channel: BroadcastChannel | null = null;
let isListening = false;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!("BroadcastChannel" in window)) return null;

  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }

  return channel;
}

/**
 * Initialize broadcast channel listener.
 * Call this once when the app mounts.
 */
export function initBroadcastListener(queryClient: QueryClient) {
  const ch = getChannel();
  if (!ch || isListening) return;

  isListening = true;
  ch.onmessage = (event: MessageEvent<SyncMessage>) => {
    if (event.data.type === "invalidate") {
      for (const queryKey of event.data.queryKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
    }
  };
}

/**
 * Broadcast cache invalidation to other tabs.
 * Call this after mutations to sync data across tabs.
 */
export function broadcastInvalidate(queryKeys: unknown[][]) {
  const ch = getChannel();
  if (!ch) return;

  ch.postMessage({
    type: "invalidate",
    queryKeys,
  } satisfies SyncMessage);
}
