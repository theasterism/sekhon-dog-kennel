import { LinkOptions } from "@tanstack/react-router";

export const navLinks = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/dogs",
    label: "Available Dogs",
  },
  {
    to: "/about",
    label: "About",
  },
  {
    to: "/contact",
    label: "Contact",
  },
] as Array<
  LinkOptions & {
    label: string;
  }
>;
