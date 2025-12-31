import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { createFileRoute } from "@tanstack/react-router";
import { createContext } from "@/server/api/orpc";
import { appRouter } from "@/server/api/router";

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [new BatchHandlerPlugin()],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: await createContext({
            req: request,
          }),
        });

        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
