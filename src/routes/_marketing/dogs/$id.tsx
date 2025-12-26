import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/dogs/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_marketing/dogs/"!</div>;
}
