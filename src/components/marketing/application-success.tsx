import { Link } from "@tanstack/react-router";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationSuccessProps {
  dogName?: string;
}

export function ApplicationSuccess({ dogName }: ApplicationSuccessProps) {
  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon className="size-8 text-green-600" />
          </div>
          <CardTitle>Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for your interest in adopting {dogName || "this dog"}. We'll review your application and get back
            to you within 2-3 business days.
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
