import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { CheckCircleIcon, ClockIcon, MailIcon, PhoneIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { RouterOutputs } from "@/server/api/root";

type Application = RouterOutputs["applications"]["list"][number];

const searchSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const Route = createFileRoute("/admin/_dashboard/applications/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ status: search.status }),
  loader: async ({ context, deps }) => {
    const { api, queryClient } = context;
    await queryClient.ensureQueryData(api.applications.list.queryOptions({ status: deps.status }));
  },
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { api } = Route.useRouteContext();
  const { status } = Route.useSearch();
  const queryClient = useQueryClient();

  const applicationsQuery = useQuery(api.applications.list.queryOptions({ status }));
  const applications = applicationsQuery.data ?? [];

  const updateStatusMutation = useMutation({
    ...api.applications.updateStatus.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.applications.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.stats.queryKey() });
      toast.success("Application status updated");
    },
    onError: (error) => {
      toast.error("Failed to update status", { description: error.message });
    },
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="text-muted-foreground text-sm">Review and manage adoption applications</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <StatusTab label="All" count={statusCounts.all} active={!status} href="/admin/applications" />
        <StatusTab
          label="Pending"
          count={statusCounts.pending}
          active={status === "pending"}
          href="/admin/applications?status=pending"
        />
        <StatusTab
          label="Approved"
          count={statusCounts.approved}
          active={status === "approved"}
          href="/admin/applications?status=approved"
        />
        <StatusTab
          label="Rejected"
          count={statusCounts.rejected}
          active={status === "rejected"}
          href="/admin/applications?status=rejected"
        />
      </div>

      {/* Applications List */}
      {applicationsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {status ? `No ${status} applications` : "No applications yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusChange={(newStatus) => updateStatusMutation.mutate({ id: application.id, status: newStatus })}
              isUpdating={updateStatusMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusTab({ label, count, active, href }: { label: string; count: number; active: boolean; href: string }) {
  return (
    <Link
      to={href}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

function ApplicationCard({
  application,
  onStatusChange,
  isUpdating,
}: {
  application: Application;
  onStatusChange: (status: "pending" | "approved" | "rejected") => void;
  isUpdating: boolean;
}) {
  const statusConfig = {
    pending: { icon: ClockIcon, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    approved: { icon: CheckCircleIcon, color: "bg-green-500/10 text-green-600 border-green-500/20" },
    rejected: { icon: XCircleIcon, color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  const config = statusConfig[application.status ?? "pending"];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{application.applicantName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Applied for <span className="font-medium text-foreground">{application.dogName}</span>
              {" • "}
              {application.createdAt && formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="outline" className={config.color}>
            <StatusIcon className="size-3 mr-1" />
            {application.status?.charAt(0).toUpperCase()}
            {application.status?.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="size-4" />
              <a href={`mailto:${application.email}`} className="hover:text-foreground hover:underline">
                {application.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneIcon className="size-4" />
              <a href={`tel:${application.phone}`} className="hover:text-foreground hover:underline">
                {application.phone}
              </a>
            </div>
            {application.address && <p className="text-muted-foreground pl-6">{application.address}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={application.status ?? "pending"}
              onValueChange={(value) => onStatusChange(value as "pending" | "approved" | "rejected")}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
