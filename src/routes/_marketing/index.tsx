import { createFileRoute } from "@tanstack/react-router";
import { AvailableDogsSection } from "@/components/marketing/available-dogs-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export const Route = createFileRoute("/_marketing/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(context.api.dogs.public.list.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="py-24 flex flex-col gap-24">
      <HeroSection />
      <AvailableDogsSection />
      <TestimonialsSection />
    </main>
  );
}
