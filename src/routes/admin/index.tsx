import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/lib/trpc";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ context, location }) => {
    if (!context.isSetupComplete) {
      throw redirect({ to: "/admin/setup" });
    }
    if (!context.session.isAuthenticated) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
  },
  loader: ({ context: { api, queryClient } }) => queryClient.ensureQueryData(api.hello.greet.queryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery(api.hello.greet.queryOptions());

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground">tRPC Test: {data?.message}</p>
    </div>
  );
}
