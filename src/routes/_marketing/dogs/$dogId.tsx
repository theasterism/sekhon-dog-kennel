import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle, ChevronRight } from "lucide-react";
import { availableDogs } from "@/data/marketing";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAge } from "@/utils/age";
import { capitalize } from "@/utils/format";

export const Route = createFileRoute("/_marketing/dogs/$dogId")({
  loader: ({ params }) => {
    return availableDogs.find((d) => d.id === params.dogId);
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
  const data = Route.useLoaderData();
  return (
    <main className="py-16 flex flex-col gap-8 px-5 mx-auto max-w-7xl w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-4" />
        <Link to="/" hash="available-dogs" className="hover:text-foreground transition-colors">
          Available Dogs
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">{data?.name}</span>
      </nav>

      <div className="flex flex-col gap-4">
        <div className="w-full">
          <img
            src={data?.images[0]}
            alt="Full width landscape"
            className="w-full object-cover rounded-lg shadow-lg aspect-4/3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src={data?.images[1]}
            alt="Grid image 1"
            className="aspect-square w-full object-cover rounded-lg shadow-lg"
          />
          <img
            src={data?.images[2]}
            alt="Grid image 2"
            className="aspect-square w-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">{data?.name}</h1>
          <Badge variant="outline">{data?.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground font-light">{data?.breed}</p>
      </div>
      <p className="text-muted-foreground">{data?.description}</p>

      <Separator />
      <div className="grid grid-cols-2 gap-y-8 gap-x-4">
        <StatItem label="Age" value={getAge(data?.dateOfBirth || new Date())} />
        <StatItem label="Sex" value={capitalize(data?.gender || "")} />
        <StatItem label="Color" value={data?.color || ""} />
        <StatItem label="Size" value={`${capitalize(data?.size || "")} (${data?.weight} lbs)`} />
      </div>

      {/* Health & Microchip Info */}
      <Separator />
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Health Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HealthCard title="Vaccinations" description={data?.health.vaccinations.join(", ") || ""} />
          <HealthCard title="Dewormed" description={`${data?.health.dewormings}x deworming treatments`} />
          <HealthCard
            title="Vet Checked"
            description={data?.health.vetChecked ? "Full veterinary examination" : "Pending"}
          />
          <HealthCard
            title="Microchipped"
            description={data?.microchipped ? "Registered microchip included" : "Not microchipped"}
          />
        </div>
      </div>

      <Separator />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs ">Price</span>
          <span className="text-2xl font-semibold">${data?.price?.toLocaleString()}</span>
        </div>
        <a
          href={`/contact?dog=${data?.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Inquire About {data?.name}
        </a>
      </div>
    </main>
  );
}


