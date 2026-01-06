interface AboutSectionProps {
  title: string;
  content: string;
}

export function AboutSection({ title, content }: AboutSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-wider">{title}</h2>
      <p className="text-base text-muted-foreground leading-relaxed max-w-[72ch] w-full">{content}</p>
    </div>
  );
}
