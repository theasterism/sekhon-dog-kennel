import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/application")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_marketing/application"!</div>;
}
