import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NoDogSelected() {
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
