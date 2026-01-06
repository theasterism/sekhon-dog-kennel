import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "@/components/marketing/about-hero";
import { AboutSection } from "@/components/marketing/about-section";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_marketing/about")({
  component: RouteComponent,
});

const ABOUT_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGMCls8jnxGVGkdBc_TYvoMJeowf4u1u-QwSsZOCmckxzCxfrsC9UueZNZGQn3VOXgADO7WXpfOikYi8GAWEFX9aES7FK3Q9RgY1tj0hXVr9vhPDbPVro_gDvCYKY8ZHVsUZ_rIopgNhQQWVlk951UQBvudlnlvgN5PSCSB0RPZkZrL39gPIOq4MjmRZdODXQrsAM1qoxRYryzfcZf124ZffCJTVt_K5sXIDBbK1wR_iVLDLq2hAnvm9eRY79xfpZ6CL3FoZCZZVc";

function RouteComponent() {
  return (
    <main className="pt-24 flex flex-col gap-10 pb-24 px-5 mx-auto lg:flex-row lg:justify-between max-w-7xl w-full">
      <div className="flex flex-col gap-10 lg:w-3/5">
        <AboutHero
          title="About Us"
          description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."
        />
        <Separator />

        <div className="flex flex-col gap-10">
          <AboutSection
            title="Our Story"
            content="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
          />
          <AboutSection
            title="Our Purpose"
            content="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden aspect-square bg-muted shadow-lg relative border border-border lg:w-2/5 h-fit">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ABOUT_IMAGE_URL})` }} />
      </div>
    </main>
  );
}
