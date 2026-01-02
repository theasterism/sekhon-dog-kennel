import { createFileRoute, Link, linkOptions, Outlet, useRouter } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/admin/_dashboard")({
  component: RouteComponent,
});

const routes = linkOptions([
  {
    to: "/admin",
    label: "Dogs",
  },
  {
    to: "/admin/applications",
    label: "Applications",
  },
  {
    to: "/admin/media",
    label: "Media",
  },
]);

function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        await router.navigate({ to: "/admin/login" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="w-8 p-0 sm:px-2.5 sm:w-auto"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOutIcon />
      <span className="hidden sm:inline">Log Out</span>
    </Button>
  );
}

function RouteComponent() {
  return (
    <main className="flex flex-col w-full gap-8">
      <header
        className={`bg-background border-b sticky top-0 z-50  transition-[border-color] duration-200`}
        role="banner"
      >
        <nav aria-label="Main navigation" className="flex items-center py-2.5 px-5 justify-between">
          <ul className="flex items-center gap-2">
            {routes.map((route) => {
              return (
                <li key={route.to}>
                  <Link
                    className={cn(
                      "data-active:text-primary data-active:bg-primary/10 focus-visible:border-ring focus-visible:ring-ring/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none data-active:hover:bg-primary/15 data-active:hover:text-primary hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
                    )}
                    activeProps={{
                      "data-active": "true",
                    }}
                    activeOptions={{
                      exact: true,
                    }}
                    to={route.to}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <LogoutButton />
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
