import { createFileRoute } from "@tanstack/react-router";
// import { ContactForm } from "@/components/marketing/contact-form";
import { ContactInfo } from "@/components/marketing/contact-info";
import { MapEmbed } from "@/components/marketing/map-embed";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_marketing/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="pt-24 flex flex-col gap-10 pb-24 px-5 mx-auto lg:flex-row lg:justify-between max-w-7xl w-full">
      <div className="flex flex-col gap-10 lg:w-3/5">
        <div className="flex flex-col gap-6">
          <h1 className="tracking-tight leading-tight text-4xl sm:text-5xl font-semibold text-pretty">Get in touch</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[72ch] w-full">
            Have questions about our puppies or want to schedule a visit? We'd love to hear from you. Reach out by
            phone, email, or stop by our kennel in Surrey, BC.
          </p>
        </div>
        <Separator />
        <ContactInfo />
        {/* <Separator /> */}
        {/* <ContactForm /> */}
      </div>
      <MapEmbed />
    </main>
  );
}
