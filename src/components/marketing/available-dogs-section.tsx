import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/trpc";
import type { RouterOutputs } from "@/server/api/root";
import { getAge } from "@/utils/age";

type Dog = RouterOutputs["dogs"]["public"]["list"][number];

export function AvailableDogsSection() {
  const dogsQuery = useQuery(api.dogs.public.list.queryOptions());
  const dogs = (dogsQuery.data ?? []) as Dog[];

  const statusConfig = {
    available: { label: "Available", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    reserved: { label: "Reserved", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    sold: { label: "Sold", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  return (
    <section id="available-dogs" className="max-w-7xl mx-auto px-5 scroll-mt-24">
      <h2 className="text-3xl font-semibold text-center mb-10">Available Dogs</h2>

      {dogsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      ) : dogs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No dogs available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dogs.slice(0, 4).map((dog) => {
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

      <div className="flex justify-center">
        <Button variant="outline" size="lg" render={<Link to="/dogs">View All Dogs</Link>} />
      </div>
    </section>
  );
}
