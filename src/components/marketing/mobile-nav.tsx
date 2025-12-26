import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { navLinks } from "./nav-links";
import { cn } from "@/utils/cn";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Close menu on route change
  useEffect(() => {
    return router.subscribe("onBeforeNavigate", () => {
      setIsOpen(false);
    });
  }, [router]);

  return (
    <div className="sm:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger render={<Button variant="ghost" size="icon" className="extend-touch-target" />}>
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  isOpen ? "top-[0.4rem] -rotate-45" : "top-1",
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  isOpen ? "top-[0.4rem] rotate-45" : "top-2.5",
                )}
              />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </div>{" "}
          <span className="sr-only">Toggle Menu</span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          alignOffset={-20}
          side="bottom"
          sideOffset={16}
          collisionPadding={0}
          className="bg-background/90 no-scrollbar overflow-y-auto rounded-none border-0! p-0 shadow-none! backdrop-blur duration-100 ring-0 w-(--available-width) h-(--available-height)"
        >
          {/* Nav Links */}
          <div className="flex flex-col gap-12 overflow-auto px-6 py-6 text-right h-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-medium"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-medium"
                    >
                      {link.label}
                    </a>
                  ),
                )}{" "}
              </div>
            </div>

            {/* Instagram Link */}
            <div className="mt-auto flex justify-end">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-right w-fit gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow us on Instagram
              </a>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
