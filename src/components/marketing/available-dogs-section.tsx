import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAge } from "@/utils/age";
import { cn } from "@/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function AvailableDogsSection() {
  const { api } = useRouteContext({ from: "/_marketing/" });
  const dogsQuery = useSuspenseQuery(api.dogs.public.list.queryOptions());
  const dogs = dogsQuery.data;

  const statusConfig = {
    available: { label: "Available", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    reserved: { label: "Reserved", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    sold: { label: "Sold", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  return (
    <section id="available-dogs" className="max-w-7xl mx-auto px-5 scroll-mt-24">
      <h2 className="text-3xl font-semibold text-center mb-10">Available Dogs</h2>

      {dogs.length === 0 ? (
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
                <Card className="w-full h-auto rounded-none p-0 bg-transparent border-0 ring-0 shadow-none gap-4 min-w-0">
                  {dog.primaryImage ? (
                    <CardContent className="p-0 overflow-hidden">
                      <img
                        className="aspect-square rounded-lg w-full h-full object-cover"
                        src={`/api/images/${dog.primaryImage}`}
                        alt={dog.name}
                        loading="lazy"
                      />
                    </CardContent>
                  ) : (
                    <div className="aspect-square rounded-lg w-full h-full border border-border shadow-lg bg-muted flex items-center justify-center text-muted-foreground block">
                      No Image
                    </div>
                  )}
                  <CardHeader className="p-0 gap-0">
                    <CardTitle className="flex items-center gap-2 text-sm tracking-tight font-medium">
                      <h3 className="font-semibold text-lg transition-colors">{dog.name}</h3>
                      <Badge variant="outline" className={cn(status.color, "ml-auto")}>
                        {status.label}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      <span>{dog.breed || "Unknown breed"}</span> •{" "}
                      <span>{dog.dateOfBirth ? getAge(new Date(dog.dateOfBirth)) : "Unknown age"}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
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
