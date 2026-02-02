import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/trpc";

interface ApplicationFormProps {
  dogId: string;
  dogName?: string;
  onSuccess: () => void;
}

export function ApplicationForm({ dogId, dogName, onSuccess }: ApplicationFormProps) {
  const createMutation = useMutation({
    ...api.applications.create.mutationOptions(),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to submit application", { description: error.message });
    },
  });

  const form = useForm({
    defaultValues: {
      applicantName: "",
      email: "",
      phone: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate({
        dogId,
        ...value,
      });
    },
  });

  return (
    <div className="container max-w-2xl py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="tracking-tight leading-tight text-3xl sm:text-4xl font-semibold text-pretty mb-2">
            Adoption Application
          </h1>
          <p className="text-base text-muted-foreground">
            Find your perfect companion. Our residents are waiting for a loving home. You're applying to adopt{" "}
            <span className="font-medium text-foreground">{dogName || "this dog"}</span>. Please fill out the form below
            and we'll get back to you soon.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex sm:items-center flex-col sm:flex-row gap-3">
          <form.Field
            name="applicantName"
            validators={{
              onChange: ({ value }) => (!value ? "Name is required" : undefined),
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Full Name *</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your full name"
                />
                {field.state.meta.errors?.[0] && <FieldError>{field.state.meta.errors[0]}</FieldError>}
              </Field>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
                return undefined;
              },
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email Address *</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="you@example.com"
                />
                {field.state.meta.errors?.[0] && <FieldError>{field.state.meta.errors[0]}</FieldError>}
              </Field>
            )}
          </form.Field>
        </div>
        <div className="flex sm:items-start flex-col sm:flex-row gap-3">
          <form.Field
            name="phone"
            validators={{
              onChange: ({ value }) => (!value ? "Phone number is required" : undefined),
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Phone Number *</FieldLabel>
                <Input
                  id={field.name}
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="(555) 123-4567"
                />
                {field.state.meta.errors?.[0] && <FieldError>{field.state.meta.errors[0]}</FieldError>}
              </Field>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Street, City, State, Postal Code"
                />
              </Field>
            )}
          </form.Field>
        </div>
        <div className="flex xs:items-center flex-col xs:flex-row gap-4 pt-4">
          <Button type="button" variant="secondary" render={<Link to="/dogs" />}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Spinner /> : null}
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}
