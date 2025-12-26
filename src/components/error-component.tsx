import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
  error: Error;
  reset?: () => void;
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  };

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-24 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-4 max-w-md">
        We encountered an unexpected error. Please try again or contact support if the problem persists.
      </p>
      {import.meta.env.DEV && (
        <pre className="text-xs text-left bg-muted p-4 rounded-lg mb-6 max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
      <Button onClick={handleReset}>
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </main>
  );
}
