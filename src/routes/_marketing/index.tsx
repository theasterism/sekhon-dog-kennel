import { createFileRoute } from "@tanstack/react-router";
import { AvailableDogsSection } from "@/components/marketing/available-dogs-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export const Route = createFileRoute("/_marketing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="pt-24 space-y-24 pb-24">
      <HeroSection />
      <AvailableDogsSection />
      <TestimonialsSection />
    </main>
  );
}
