import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MainNav } from "@/components/marketing/main-nav";

export const Route = createFileRoute("/_marketing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background relative z-10 flex min-h-svh flex-col">
      <header className="bg-background sticky top-0 z-50 w-full">
        <div className="px-4 py-2 flex items-center justify-between ">
          <a className="flex gap-1.5 items-center">
            <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2 className="font-semibold tracking-tight hidden sm:block text-lg">Sekhon Dog Kennel</h2>
          </a>
          <MainNav />
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
