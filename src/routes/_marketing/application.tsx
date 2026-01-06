import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as z from "zod";
import { ApplicationForm } from "@/components/marketing/application-form";
import { ApplicationSuccess } from "@/components/marketing/application-success";
import { NoDogSelected } from "@/components/marketing/application-no-dog";

const searchSchema = z.object({
  dogId: z.string().optional(),
  dogName: z.string().optional(),
});

export const Route = createFileRoute("/_marketing/application")({
  validateSearch: searchSchema,
  component: ApplicationPage,
});

function ApplicationPage() {
  const { dogId, dogName } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  if (!dogId) {
    return <NoDogSelected />;
  }

  if (submitted) {
    return <ApplicationSuccess dogName={dogName} />;
  }

  return <ApplicationForm dogId={dogId} dogName={dogName} onSuccess={() => setSubmitted(true)} />;
}
