import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { availableDogs } from "@/data/marketing";
import { getAge } from "@/utils/age";

export const Route = createFileRoute("/_marketing/dogs/")({
  component: RouteComponent,
});

function RouteComponent() {
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

      {/* Dog Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableDogs.map((dog) => (
          <Link
            key={dog.id}
            to="/dogs/$dogId"
            params={{ dogId: dog.id }}
            className="flex flex-col gap-3 group scroll-mt-24"
          >
            <img
              src={dog.images[0]}
              alt={dog.name}
              loading="lazy"
              className="w-full aspect-4/3 object-cover rounded-xl transition-transform ease-in-out group-hover:scale-[1.02] border border-border shadow-lg"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg transition-colors">{dog.name}</h3>
                <Badge variant="outline">{dog.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <span>{dog.breed}</span> • <span>{getAge(dog.dateOfBirth)}</span>
              </p>
            </div>
          </Link>
        ))}{" "}
      </div>
    </main>
  );
}
