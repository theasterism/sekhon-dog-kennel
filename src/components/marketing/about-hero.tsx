interface AboutHeroProps {
  title: string;
  description: string;
}

export function AboutHero({ title, description }: AboutHeroProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="tracking-tight leading-tight text-4xl sm:text-5xl font-semibold text-pretty">{title}</h1>
      <p className="text-base text-muted-foreground leading-relaxed max-w-[72ch] w-full">{description}</p>
    </div>
  );
}
