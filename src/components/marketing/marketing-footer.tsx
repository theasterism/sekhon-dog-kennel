import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { href: "/", label: "Home", isRoute: true },
  { href: "/dogs", label: "Available Dogs", isRoute: true },
  { href: "/about", label: "About Us", isRoute: true },
] as const;

export function MarketingFooter() {
  const { address, contact, social } = siteConfig;

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-5">
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
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
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
          <div className="flex flex-col gap-5">
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
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block hover:text-foreground transition-colors">
                  {contact.email}
                </a>
              )}
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
