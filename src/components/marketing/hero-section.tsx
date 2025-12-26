import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-5 scroll-mt-24">
      <h1 className="text-center tracking-tight leading-tight text-4xl sm:text-5xl font-semibold text-pretty">
        Find Your Perfect Furry Companion
      </h1>
      <p className="text-center text-base text-muted-foreground leading-relaxed max-w-[60ch] w-full text-pretty">
        Surrey, BC's trusted family-owned kennel, raising happy, healthy puppies with love and care. We're dedicated to
        ethical breeding and matching the right dog with your family.
      </p>
      <div className="flex flex-col xs:flex-row xs:justify-center gap-4 items-center w-full">
        <Button
          variant="default"
          size="lg"
          className="w-full xs:w-fit xs:px-6"
          render={<a href="#available-dogs">Meet Our Puppies</a>}
        />
        <Button
          variant="outline"
          size="lg"
          className="w-full xs:w-fit xs:px-5"
          render={<Link to="/about">Our Story</Link>}
        />
      </div>
      <div className="w-full mt-4 rounded-2xl overflow-hidden shadow-xl">
        <img
          src="/images/hero-puppies.png"
          alt="Adorable puppies at Sekhon Dog Kennel"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
