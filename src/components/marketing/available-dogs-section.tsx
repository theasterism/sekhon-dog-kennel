import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { availableDogs } from "@/data/marketing";
import { getAge } from "@/utils/age";

export function AvailableDogsSection() {
  return (
    <section id="available-dogs" className="max-w-6xl mx-auto px-5 scroll-mt-24">
      <h2 className="text-3xl font-semibold text-center mb-10">Available Dogs</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {availableDogs.slice(0, 4).map((dog) => (
          <Link key={dog.id} to="/dogs/$dogId" params={{ dogId: dog.id }} className="flex flex-col gap-3 group scroll-mt-24">
            <img
              src={dog.images[0]}
              alt={dog.name}
              loading="lazy"
              className="w-full aspect-4/3 object-cover rounded-xl transition-transform ease-in-out group-hover:scale-[1.02]"
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
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="lg" render={<Link to="/dogs">View All Dogs</Link>} />
      </div>
    </section>
  );
}

