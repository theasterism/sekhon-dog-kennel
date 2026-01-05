import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getAge } from "@/utils/age";
import { capitalize } from "@/utils/format";

export const Route = createFileRoute("/_marketing/dogs/$dogId")({
  loader: async ({ context, params }) => {
    const { api, queryClient } = context;
    await queryClient.ensureQueryData(api.dogs.public.getById.queryOptions({ id: params.dogId }));
  },
  component: RouteComponent,
});

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function HealthCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
      <CheckCircle className="size-5 text-green-600 mt-0.5 shrink-0" />
      <div>
        <span className="font-medium block">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { dogId } = Route.useParams();
  const { api } = Route.useRouteContext();
  const dogQuery = useQuery(api.dogs.public.getById.queryOptions({ id: dogId }));
  const dog = dogQuery.data;

  if (dogQuery.isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-semibold">Dog not found</h1>
        <p className="text-muted-foreground mt-2">This dog may no longer be available.</p>
        <Button className="mt-6" render={<Link to="/dogs" />}>
          Browse Available Dogs
        </Button>
      </div>
    );
  }

  // Sort images: primary first, then by display order
  const sortedImages = [...dog.images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });

  const statusConfig = {
    available: { label: "Available", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    reserved: { label: "Reserved", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    sold: { label: "Sold", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  const status = statusConfig[dog.status ?? "available"];

  return (
    <main className="py-16 flex flex-col md:flex-row gap-8 px-5 mx-auto max-w-7xl w-full">
      <div className="flex flex-col gap-8 md:w-2/5">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/dogs" className="hover:text-foreground transition-colors">
            Available Dogs
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{dog.name}</span>
        </nav>

        <div className="flex flex-col gap-4">
          {sortedImages[0] && (
            <div className="w-full aspect-4/3 rounded-lg overflow-hidden shadow-lg">
              <img src={`/api/images/${sortedImages[0].r2Key}`} alt={dog.name} className="size-full object-cover" />
            </div>
          )}
          {sortedImages.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {sortedImages.slice(1, 3).map((image) => (
                <div key={image.id} className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img src={`/api/images/${image.r2Key}`} alt={dog.name} className="size-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 md:w-3/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">{dog.name}</h1>
            <Badge variant="outline" className={status.color}>
              {status.label}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground font-light">{dog.breed}</p>
        </div>

        {dog.description && <p className="text-muted-foreground">{dog.description}</p>}

        <Separator />
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <StatItem label="Age" value={dog.dateOfBirth ? getAge(new Date(dog.dateOfBirth)) : "Unknown"} />
          <StatItem label="Sex" value={dog.gender ? capitalize(dog.gender) : "Unknown"} />
          <StatItem
            label="Color"
            value={
              dog.color && dog.color.length > 0 ? dog.color.charAt(0).toUpperCase() + dog.color.slice(1) : "Unknown"
            }
          />
          <StatItem
            label="Size"
            value={dog.size ? `${capitalize(dog.size)}${dog.weight ? ` (${dog.weight} lbs)` : ""}` : "Unknown"}
          />
        </div>

        {/* Health & Microchip Info */}
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Health Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <HealthCard
              title="Vaccinations"
              description={dog.vaccinations?.length ? dog.vaccinations.join(", ") : "Up to date"}
            />
            <HealthCard title="Dewormed" description={`${dog.dewormings ?? 0}x deworming treatments`} />
            <HealthCard title="Vet Checked" description={dog.vetChecked ? "Full veterinary examination" : "Pending"} />
            <HealthCard
              title="Microchipped"
              description={dog.microchipped ? "Registered microchip included" : "Not microchipped"}
            />
          </div>
        </div>

        <Separator />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs">Price</span>
            <span className="text-2xl font-semibold">
              {dog.price ? `$${dog.price.toLocaleString()}` : "Contact for pricing"}
            </span>
          </div>
          {dog.status === "available" ? (
            <Button size="lg" render={<Link to="/application" search={{ dogId: dog.id, dogName: dog.name }} />}>
              Apply to Adopt {dog.name}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" disabled>
              {dog.status === "reserved" ? "Currently Reserved" : "No Longer Available"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
