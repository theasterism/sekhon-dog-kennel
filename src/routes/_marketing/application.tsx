import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as z from "zod";
import { ApplicationForm } from "@/components/marketing/application-form";
import { NoDogSelected } from "@/components/marketing/application-no-dog";
import { ApplicationSuccess } from "@/components/marketing/application-success";

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
    return (
      <main className="py-24 px-5 mx-auto max-w-7xl w-full flex flex-col items-center">
        <NoDogSelected />
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="py-24 px-5 mx-auto max-w-7xl w-full flex flex-col items-center">
        <ApplicationSuccess dogName={dogName} />
      </main>
    );
  }

  return (
    <main className="py-24 px-5 mx-auto max-w-7xl w-full flex flex-col items-center">
      <ApplicationForm dogId={dogId} dogName={dogName} onSuccess={() => setSubmitted(true)} />
    </main>
  );
}
