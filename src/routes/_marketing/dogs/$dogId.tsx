import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/dogs/$dogId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dogId } = Route.useParams();

  return <div>Hello "/_marketing/dogs/${dogId}"!</div>;
}
