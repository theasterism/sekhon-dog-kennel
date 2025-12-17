import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuPrimitive.Trigger render={<Button variant="ghost" size="icon" />}>
            <div className="relative size-4">
              <span className="bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 top-1" />
              <span className="bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100 top-2.5" />
            </div>
            <span className="sr-only">Toggle Menu</span>
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuContent>
            <NavigationMenuLink render={<Link to="/">Home</Link>} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
