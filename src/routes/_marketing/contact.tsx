import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, PhoneCallIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_marketing/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address, contact, maps } = siteConfig;

  return (
    <main className="pt-24 flex flex-col gap-10 pb-24 px-5 mx-auto lg:flex-row lg:justify-between max-w-7xl w-full">
      <div className=" flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <h1 className="tracking-tight leading-tight text-4xl sm:text-5xl font-semibold text-pretty">Get in touch</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[72ch] w-full">
            Have questions about our puppies or want to schedule a visit? We'd love to hear from you. Reach out by phone,
            email, or stop by our kennel in Surrey, BC.
          </p>
        </div>
        <Separator />
        <ul className="flex flex-col gap-8">
          <li className="flex gap-4 items-start">
            <PhoneCallIcon className="size-4.5 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-basee mb-0.5">Phone</h3>
              <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                {contact.phoneDisplay}
              </a>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri 9am-6pm</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <Mail className="size-4.5 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-basee mb-0.5">Email</h3>
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
              <p className="text-xs text-muted-foreground mt-1">We reply within 24hrs</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <MapPin className="size-4.5 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-basee mb-0.5">Location</h3>
              <p className="text-primary ">
                {address.street} {address.city}, {address.province}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Map Embed */}
      <div className="w-full lg:w-1/2 lg:max-w-xl lg:mt-56">
        <div className="rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:h-full">
          <iframe
            src={maps.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 400 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sekhon Dog Kennel Location"
          />
        </div>
      </div>
    </main>
  );
}
