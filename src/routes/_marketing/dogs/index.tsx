import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { getAge } from "@/utils/age";

export const Route = createFileRoute("/_marketing/dogs/")({
  loader: async ({ context }) => {
    const { api, queryClient } = context;
    await queryClient.ensureQueryData(api.dogs.public.list.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { api } = Route.useRouteContext();
  const dogsQuery = useQuery(api.dogs.public.list.queryOptions());
  const dogs = dogsQuery.data ?? [];

  const statusConfig = {
    available: { label: "Available", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    reserved: { label: "Reserved", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    sold: { label: "Sold", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  return (
    <main className="pt-24 pb-24 px-5 mx-auto max-w-7xl w-full">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="tracking-tight leading-tight text-3xl sm:text-4xl font-semibold text-pretty mb-2">
            Available Dogs
          </h1>
          <p className="text-base text-muted-foreground">
            Find your perfect companion. Our residents are waiting for a loving home.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {dogsQuery.isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner className="size-8" />
        </div>
      ) : dogs.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg">No dogs available at the moment.</p>
          <p className="text-sm mt-2">Check back soon for new arrivals!</p>
        </div>
      ) : (
        /* Dog Grid - 4 columns */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dogs.map((dog) => {
            const status = statusConfig[dog.status ?? "available"];
            return (
              <Link
                key={dog.id}
                to="/dogs/$dogId"
                params={{ dogId: dog.id }}
                className="flex flex-col gap-3 group scroll-mt-24"
              >
                {dog.primaryImage ? (
                  <div className="w-full aspect-4/3 rounded-xl overflow-hidden border border-border shadow-lg">
                    <img
                      src={`/api/images/${dog.primaryImage}`}
                      alt={dog.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform ease-in-out group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-4/3 rounded-xl border border-border shadow-lg bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg transition-colors">{dog.name}</h3>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span>{dog.breed || "Unknown breed"}</span> •{" "}
                    <span>{dog.dateOfBirth ? getAge(new Date(dog.dateOfBirth)) : "Unknown age"}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
