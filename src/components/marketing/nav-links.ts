import { LinkOptions } from "@tanstack/react-router";

export const navLinks = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/",
    hash: "available-dogs",
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
