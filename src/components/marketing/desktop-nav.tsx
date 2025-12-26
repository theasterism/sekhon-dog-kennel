import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { navLinks } from "./nav-links";

export function DesktopNav() {
  return (
    <nav className="hidden sm:flex items-center gap-1">
      {navLinks.map((link) => (
        <Button
          key={link.to}
          variant="ghost"
          render={
            <Link hash={link.hash} to={link.to}>
              {link.label}
            </Link>
          }
        />
      ))}
    </nav>
  );
}
