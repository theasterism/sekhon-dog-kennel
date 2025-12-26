import { revalidateLogic, useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, PhoneCallIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { ContactFormSchema } from "@/utils/validations/contact";

export const Route = createFileRoute("/_marketing/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address, contact, maps } = siteConfig;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.province} ${address.postalCode}`,
  )}`;

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    } as z.input<typeof ContactFormSchema>,
    validationLogic: revalidateLogic(),
    validators: {
      onChangeAsync: ContactFormSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: ({ value }) => {
      console.log("Contact form submitted:", value);
      toast.success("Message sent!", { description: "We'll get back to you soon." });
      form.reset();
    },
  });

  return (
    <main className="pt-24 flex flex-col gap-10 pb-24 px-5 mx-auto lg:flex-row lg:justify-between max-w-7xl w-full">
      {/* Left Column - Content */}
      <div className="flex flex-col gap-10 lg:w-3/5">
        <div className="flex flex-col gap-6">
          <h1 className="tracking-tight leading-tight text-4xl sm:text-5xl font-semibold text-pretty">Get in touch</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[72ch] w-full">
            Have questions about our puppies or want to schedule a visit? We'd love to hear from you. Reach out by phone,
            email, or stop by our kennel in Surrey, BC.
          </p>
        </div>
        <Separator />

        {/* Contact Info */}
        <ul className="flex flex-col gap-6">
          <li className="flex gap-4 items-start">
            <PhoneCallIcon className="size-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-0.5">Phone</h3>
              <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                {contact.phoneDisplay}
              </a>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri 9am-6pm</p>
            </div>
          </li>
          {contact.email && (
            <li className="flex gap-4 items-start">
              <Mail className="size-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-0.5">Email</h3>
                <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {contact.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">We reply within 24hrs</p>
              </div>
            </li>
          )}
          <li className="flex gap-4 items-start">
            <MapPin className="size-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-0.5">Location</h3>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {address.street}, {address.city}, {address.province}
              </a>
            </div>
          </li>
        </ul>

        <Separator />

        {/* Contact Form */}
        <div className="max-w-md">
          <h2 className="text-lg font-semibold tracking-wider mb-6">Send us a message</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Your name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="you@example.com"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Phone (optional)</FieldLabel>
                    <Input
                      type="tel"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="message">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Tell us about what you're looking for..."
                        rows={4}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button disabled={!canSubmit || isSubmitting} type="submit">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  )}
                </form.Subscribe>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="rounded-xl overflow-hidden aspect-square bg-muted shadow-lg relative border border-border lg:w-2/5 h-fit">
        <iframe
          src={maps.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: 400 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sekhon Dog Kennel Location"
          className="absolute inset-0"
        />
      </div>
    </main>
  );
}
