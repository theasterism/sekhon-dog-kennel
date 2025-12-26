import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const Route = createFileRoute("/_marketing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background relative z-10 flex min-h-svh flex-col">
      <MarketingHeader />
      <Outlet />
      <MarketingFooter />
    </div>
  );
}
