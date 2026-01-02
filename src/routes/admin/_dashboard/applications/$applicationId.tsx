import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/_dashboard/applications/$applicationId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_dashboard/applications/$applicationId"!</div>
}
