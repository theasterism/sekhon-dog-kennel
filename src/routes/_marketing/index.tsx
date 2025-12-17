import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      context.api.hello.queryOptions({
        input: {},
      }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { api } = Route.useRouteContext();

  const { data } = useSuspenseQuery(
    api.hello.queryOptions({
      input: {},
    }),
  );

  return <div>{data.greeting}</div>;
}
