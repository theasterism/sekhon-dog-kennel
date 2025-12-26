import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/cn";
import { ApiError, ErrorTypes } from "@/utils/error";
import { AuthSetupSchema } from "@/utils/validations/auth";

export const Route = createFileRoute("/admin/setup")({
  beforeLoad: ({ context }) => {
    if (context.isSetupComplete) {
      throw redirect({ to: "/admin/login" });
    }
    if (context.session.isAuthenticated) {
      throw redirect({ to: "/admin" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof AuthSetupSchema>) => {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = (await res.json()) as ApiError;
          throw { type: "ValidationError", message: data.error.message };
        }
        if (res.status === 429) {
          const data = (await res.json()) as ApiError;
          throw { type: "RatelimitError", message: data.error.message };
        }
        throw { type: "ServerError", status: res.status };
      }

      return res.json();
    },
    onSuccess: async () => {
      toast.success("Account created", { description: "Redirecting to dashboard..." });
      await router.navigate({ to: "/admin", reloadDocument: true });
    },
    onError: (error: ErrorTypes) => {
      if (error.type === "ValidationError") {
        toast.error("Validation error", { description: error.message });
      } else if (error.type === "RatelimitError") {
        toast.error("Too many attempts", { description: error.message });
      } else if (error.type === "ServerError") {
        toast.error("Server error", { description: `Something went wrong (${error.status})` });
      } else {
        toast.error("Network error", { description: "Please check your connection" });
      }
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    } as z.input<typeof AuthSetupSchema>,
    validationLogic: revalidateLogic(),
    validators: {
      onChangeAsync: AuthSetupSchema,
      onChangeAsyncDebounceMs: 1000,
    },
    onSubmit: ({ value }) => mutateAsync(value),
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field name="username">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="password">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          <FieldDescription>Must be at least 10 characters long.</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="confirmPassword">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          <FieldDescription>Please confirm your password.</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <Field>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                      {([canSubmit, isSubmitting]) => (
                        <Button disabled={!canSubmit} type="submit">
                          {isSubmitting ? <Spinner /> : null} Setup Account
                        </Button>
                      )}
                    </form.Subscribe>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
