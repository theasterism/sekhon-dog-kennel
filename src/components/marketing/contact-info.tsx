import { Mail, MapPin, PhoneCallIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactInfo() {
  const { address, contact } = siteConfig;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.province} ${address.postalCode}`,
  )}`;

  return (
    <ul className="flex flex-col gap-6">
      <li className="flex gap-4 items-start">
        <PhoneCallIcon className="size-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-0.5">Phone</h3>
          <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
            {contact.phoneDisplay}
          </a>
          <p className="text-xs text-muted-foreground mt-1">Mon-Fri 9am-6pm</p>
        </div>
      </li>
      {contact.email && (
        <li className="flex gap-4 items-start">
          <Mail className="size-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-0.5">Email</h3>
            <a
              href={`mailto:${contact.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {contact.email}
            </a>
            <p className="text-xs text-muted-foreground mt-1">We reply within 24hrs</p>
          </div>
        </li>
      )}
      <li className="flex gap-4 items-start">
        <MapPin className="size-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-0.5">Location</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {address.street}, {address.city}, {address.province}
          </a>
        </div>
      </li>
    </ul>
  );
}
