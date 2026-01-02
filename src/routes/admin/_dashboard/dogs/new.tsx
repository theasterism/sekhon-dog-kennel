import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/admin/_dashboard/dogs/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { api } = Route.useRouteContext();
  const router = useRouter();

  const createMutation = useMutation({
    ...api.dogs.admin.create.mutationOptions(),
    onSuccess: async (data) => {
      await router.navigate({
        to: "/admin/dogs/$dogId/edit",
        params: { dogId: data.id },
        replace: true,
      });
    },
    onError: () => {
      toast.error("Failed to create dog", { description: "Please try again." });
    },
  });

  // Auto-trigger the mutation on mount
  if (!createMutation.isPending && !createMutation.isSuccess && !createMutation.isError) {
    createMutation.mutate();
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Creating new dog...</p>
      </div>
    </div>
  );
}
