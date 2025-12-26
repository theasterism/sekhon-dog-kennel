import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home", isRoute: true },
  { href: "#available-dogs", label: "Available Dogs", isRoute: false },
  { href: "/about", label: "About Us", isRoute: true },
  { href: "/contact", label: "Contact", isRoute: true },
] as const;

function MainNav() {
  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) =>
          link.isRoute ? (
            <Button key={link.href} variant="ghost" render={<Link to={link.href}>{link.label}</Link>} />
          ) : (
            <Button key={link.href} variant="ghost" render={<a href={link.href}>{link.label}</a>} />
          ),
        )}
      </nav>

      {/* Mobile Nav */}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <div className="relative size-4">
            <span className="bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 top-1" />
            <span className="bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 top-2.5" />
          </div>
          <span className="sr-only">Toggle Menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {navLinks.map((link) =>
            link.isRoute ? (
              <DropdownMenuItem key={link.href} render={<Link to={link.href}>{link.label}</Link>} />
            ) : (
              <DropdownMenuItem key={link.href} render={<a href={link.href}>{link.label}</a>} />
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-background sticky top-0 z-50 w-full transition-[border-color] duration-200 ${
        isScrolled ? "border-b" : "border-b border-transparent"
      }`}
    >
      <div className="py-4 px-5 flex items-center justify-between">
        <Link to="/" className="flex gap-1.5 items-center">
          <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="font-semibold tracking-tight hidden sm:block text-lg">Sekhon Dog Kennel</h2>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
