import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const searchSchema = z.object({
  dogId: z.string().optional(),
  dogName: z.string().optional(),
});

export const Route = createFileRoute("/_marketing/application")({
  validateSearch: searchSchema,
  component: ApplicationPage,
});

function ApplicationPage() {
  const { api } = Route.useRouteContext();
  const { dogId, dogName } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  const createMutation = useMutation({
    ...api.applications.create.mutationOptions(),
    onSuccess: () => {
      setSubmitted(true);
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
      if (!dogId) {
        toast.error("Please select a dog first");
        return;
      }
      createMutation.mutate({
        dogId,
        ...value,
      });
    },
  });

  if (!dogId) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No Dog Selected</CardTitle>
            <CardDescription>
              Please browse our available dogs and click "Apply to Adopt" on a dog you're interested in.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button render={<Link to="/dogs" />}>Browse Available Dogs</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="size-8 text-green-600" />
            </div>
            <CardTitle>Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your interest in adopting {dogName || "this dog"}. We'll review your application and get
              back to you within 2-3 business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button variant="secondary" render={<Link to="/dogs" />}>
              Browse More Dogs
            </Button>
            <Button render={<Link to="/" />}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Adoption Application</CardTitle>
          <CardDescription>
            You're applying to adopt <span className="font-medium text-foreground">{dogName || "this dog"}</span>.
            Please fill out the form below and we'll get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
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
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your home address"
                    rows={3}
                  />
                </Field>
              )}
            </form.Field>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" className="flex-1" render={<Link to="/dogs" />}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Spinner /> : null}
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
