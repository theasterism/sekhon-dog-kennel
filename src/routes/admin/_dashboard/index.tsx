import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DogIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { broadcastInvalidate } from "@/lib/broadcast";
import type { RouterOutputs } from "@/server/api/root";
import { getAge } from "@/utils/age";

type Dog = RouterOutputs["dogs"]["admin"]["list"]["items"][number];

const searchSchema = z.object({
  page: z.number().min(1).optional().catch(1),
  search: z.string().optional(),
  status: z.enum(["available", "reserved", "sold"]).optional(),
});

export const Route = createFileRoute("/admin/_dashboard/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1, search: search.search, status: search.status }),
  loader: async ({ context, deps }) => {
    const { api, queryClient } = context;

    await Promise.all([
      queryClient.ensureQueryData(api.stats.queryOptions()),
      queryClient.ensureQueryData(
        api.dogs.admin.list.queryOptions({ page: deps.page, limit: 10, search: deps.search, status: deps.status }),
      ),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { api } = Route.useRouteContext();
  const { page = 1, search, status } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState(search ?? "");

  const statQuery = useQuery(api.stats.queryOptions());
  const dogsQuery = useQuery(api.dogs.admin.list.queryOptions({ page, limit: 10, search, status }));

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);

  const deleteMutation = useMutation({
    ...api.dogs.admin.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.stats.queryKey() });
      broadcastInvalidate([api.dogs.public.list.queryKey()]);
      toast.success("Dog deleted successfully");
      setDeleteDialogOpen(false);
      setDogToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete dog", { description: error.message });
    },
  });

  const stats = statQuery.data;
  const dogsData = dogsQuery.data;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: ".", search: { page: 1, search: searchInput || undefined, status } });
  }

  function clearSearch() {
    setSearchInput("");
    navigate({ to: ".", search: { page: 1, status } });
  }

  function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return;
    const statusValue = newStatus === "all" ? undefined : (newStatus as "available" | "reserved" | "sold");
    navigate({ to: ".", search: { page: 1, search, status: statusValue } });
  }

  const columns: ColumnDef<Dog>[] = [
    {
      accessorKey: "name",
      header: "Dog",
      cell: ({ row }) => {
        const dog = row.original;
        return (
          <Link
            to="/admin/dogs/$dogId/edit"
            params={{ dogId: dog.id }}
            className="flex items-center gap-3 hover:underline"
          >
            <div className="size-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              {dog.primaryImage ? (
                <img src={`/api/images/${dog.primaryImage}`} alt={dog.name} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <DogIcon className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="font-medium">{dog.name}</span>
          </Link>
        );
      },
    },
    {
      accessorKey: "breed",
      header: "Breed",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.breed ?? "—"}</span>,
    },
    {
      id: "ageGender",
      header: "Age / Gender",
      cell: ({ row }) => {
        const dog = row.original;
        const age = dog.dateOfBirth ? getAge(new Date(dog.dateOfBirth)) : "—";
        const gender = dog.gender ? ` / ${dog.gender.charAt(0).toUpperCase() + dog.gender.slice(1)}` : "";
        return <span className="text-muted-foreground">{age + gender}</span>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} published={!!row.original.publishedAt} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const dog = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link to="/admin/dogs/$dogId/edit" params={{ dogId: dog.id }} />}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setDogToDelete(dog);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex max-w-7xl flex-col gap-8 mx-auto px-5 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dogs</h1>
        <Button render={<Link to="/admin/dogs/new" />}>
          <PlusIcon data-icon="inline-start" />
          Add Dog
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground font-normal">
              <DogIcon className="size-4" />
              Active Dogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.dogs ?? 0}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground font-normal">
              <FileTextIcon className="size-4" />
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.applications ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or breed..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Select value={status ?? "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dogs Table */}
      <div className="flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={dogsData?.items ?? []}
          emptyMessage="No dogs found. Add your first dog to get started."
        />

        {/* Pagination */}
        {dogsData && dogsData.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {dogsData.page} of {dogsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page <= 1}
                onClick={() => navigate({ to: ".", search: { page: page - 1, search, status } })}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page >= dogsData.totalPages}
                onClick={() => navigate({ to: ".", search: { page: page + 1, search, status } })}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{dogToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the dog and all associated images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => dogToDelete && deleteMutation.mutate({ id: dogToDelete.id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status, published }: { status: string | null; published: boolean }) {
  if (!published) {
    return <Badge variant="secondary">Draft</Badge>;
  }

  switch (status) {
    case "available":
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Available</Badge>;
    case "reserved":
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Reserved</Badge>;
    case "sold":
      return <Badge variant="secondary">Sold</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
