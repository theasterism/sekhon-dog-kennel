interface AboutImageProps {
  src: string;
  alt?: string;
}

export function AboutImage({ src, alt = "About us" }: AboutImageProps) {
  return (
    <div className="rounded-xl overflow-hidden aspect-square bg-muted shadow-lg relative border border-border lg:w-2/5 h-fit">
      <div className={`absolute inset-0 bg-cover bg-center bg-[url(${src})]`} aria-label={alt} />
    </div>
  );
}
