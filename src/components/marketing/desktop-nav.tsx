import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { navLinks } from "./nav-links";

export function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) =>
        link.isRoute ? (
          <Button key={link.href} variant="ghost" render={<Link to={link.href}>{link.label}</Link>} />
        ) : (
          <Button key={link.href} variant="ghost" render={<a href={link.href}>{link.label}</a>} />
        ),
      )}
    </nav>
  );
}
