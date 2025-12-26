import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundComponent() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-24 text-center">
      <h1 className="text-8xl font-bold text-muted-foreground/30 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link to="/" className={buttonVariants()}>
        <Home className="size-4" />
        Back to Home
      </Link>
    </main>
  );
}

