import { siteConfig } from "@/config/site";

interface MapEmbedProps {
  title?: string;
  className?: string;
}

export function MapEmbed({ title = "Sekhon Dog Kennel Location", className }: MapEmbedProps) {
  const { maps } = siteConfig;

  return (
    <div
      className={
        className ??
        "rounded-xl overflow-hidden aspect-square bg-muted shadow-lg relative border border-border lg:w-2/5 h-fit"
      }
    >
      <iframe
        src={maps.embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 400 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="absolute inset-0"
      />
    </div>
  );
}
