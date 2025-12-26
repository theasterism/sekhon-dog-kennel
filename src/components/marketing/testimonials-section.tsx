import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/data/marketing";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-5 scroll-mt-24">
      <h2 className="text-3xl font-semibold text-center mb-10">What Our Families Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="h-full">
            <CardContent className="flex flex-col h-full">
              <p className="text-muted-foreground italic mb-4 flex-1">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
