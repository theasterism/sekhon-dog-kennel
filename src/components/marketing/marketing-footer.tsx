import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { href: "/", label: "Home", isRoute: true },
  { href: "#available-dogs", label: "Available Dogs", isRoute: false },
  { href: "/about", label: "About Us", isRoute: true },
] as const;

export function MarketingFooter() {
  const { address, contact } = siteConfig;

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex gap-1.5 items-center">
              <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-semibold tracking-tight text-lg">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Menu</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                {address.street}
                <br />
                {address.city}, {address.province} {address.postalCode}, {address.country}
              </p>
              <a href={`tel:${contact.phone}`} className="block hover:text-foreground transition-colors">
                {contact.phoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="block hover:text-foreground transition-colors">
                {contact.email}
              </a>
              <Link to="/contact" className="block hover:text-foreground transition-colors font-medium">
                Contact Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
