import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getAuthStatus } from "@/server/auth/status";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const result = await getAuthStatus();

    if (result.ok) {
      return {
        isSetupComplete: result.data.isSetupComplete,
        session: result.data.session,
      };
    }

    console.error("[Auth:beforeLoad] Failed to get auth status", {
      errorType: result.error.type,
      errorMessage: result.error.message,
    });
    return {
      isSetupComplete: false,
      session: { isAuthenticated: false as const },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
