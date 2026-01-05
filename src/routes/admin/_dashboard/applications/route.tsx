import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_dashboard/applications")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex max-w-5xl flex-col gap-10 mx-auto px-5 w-full">
      <Outlet />
    </div>
  );
}
