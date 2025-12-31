import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import type { AppRouter } from "@/server/api/root";
import appCss from "@/styles/globals.css?url";

interface RouterContext {
  queryClient: QueryClient;
  api: TRPCOptionsProxy<AppRouter>;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  description: siteConfig.tagline,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.province,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "CA",
  },
  sameAs: [siteConfig.social.instagram],
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.name },
      { name: "description", content: siteConfig.tagline },
      // OpenGraph
      { property: "og:type", content: "website" },
      { property: "og:title", content: siteConfig.name },
      { property: "og:description", content: siteConfig.tagline },
      { property: "og:url", content: siteConfig.url },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:image", content: `${siteConfig.url}${siteConfig.ogImage}` },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.name },
      { name: "twitter:description", content: siteConfig.tagline },
      { name: "twitter:image", content: `${siteConfig.url}${siteConfig.ogImage}` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: siteConfig.url },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
