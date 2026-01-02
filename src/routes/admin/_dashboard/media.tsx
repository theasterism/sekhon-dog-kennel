import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ChevronRightIcon, FolderIcon, GridIcon, HomeIcon, ListIcon, Trash2Icon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import type { RouterOutputs } from "@/server/api/root";

type MediaItem = RouterOutputs["media"]["list"]["items"][number];

const searchSchema = z.object({
  path: z.string().optional(),
  view: z.enum(["grid", "list"]).optional(),
});

export const Route = createFileRoute("/admin/_dashboard/media")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ path: search.path }),
  loader: async ({ context, deps }) => {
    const { api, queryClient } = context;
    await queryClient.ensureQueryData(api.media.list.queryOptions({ prefix: deps.path }));
  },
  component: MediaPage,
});

interface FolderItem {
  name: string;
  path: string;
  type: "folder";
}

interface FileItem extends MediaItem {
  name: string;
  type: "file";
}

type ListItem = FolderItem | FileItem;

function MediaPage() {
  const { api } = Route.useRouteContext();
  const { path, view } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const currentPath = path || "";
  const currentView = view || "grid";
  const mediaQuery = useQuery(api.media.list.queryOptions({ prefix: currentPath, limit: 500 }));
  const items = mediaQuery.data?.items ?? [];

  // Parse items into folders and files
  const listItems = parseItems(items, currentPath);

  const deleteMutation = useMutation({
    ...api.media.delete.mutationOptions(),
    onSuccess: () => {
      // Invalidate all media queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File deleted successfully");
      setDeleteKey(null);
    },
    onError: (error) => {
      toast.error("Failed to delete file", { description: error.message });
    },
  });

  const navigateToFolder = (folderPath: string) => {
    navigate({
      to: "/admin/media",
      search: { path: folderPath || undefined, view: currentView },
    });
  };

  const toggleView = (newView: "grid" | "list") => {
    navigate({
      to: "/admin/media",
      search: { path: currentPath || undefined, view: newView },
    });
  };

  // Build breadcrumb segments
  const breadcrumbs = buildBreadcrumbs(currentPath);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4 px-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground text-sm">Browse and manage uploaded files</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border p-1">
          <Toggle
            size="sm"
            pressed={currentView === "grid"}
            onPressedChange={() => toggleView("grid")}
            className="h-7 w-7 p-0"
            aria-label="Grid view"
          >
            <GridIcon className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={currentView === "list"}
            onPressedChange={() => toggleView("list")}
            className="h-7 w-7 p-0"
            aria-label="List view"
          >
            <ListIcon className="size-4" />
          </Toggle>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2"
          onClick={() => navigateToFolder("")}
          disabled={!currentPath}
        >
          <HomeIcon className="size-4" />
          Root
        </Button>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-1">
            <ChevronRightIcon className="size-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => navigateToFolder(crumb.path)}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.name}
            </Button>
          </div>
        ))}
      </nav>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {mediaQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-8" />
            </div>
          ) : listItems.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              {currentPath ? "This folder is empty" : "No files uploaded yet"}
            </div>
          ) : currentView === "grid" ? (
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {listItems.map((item) =>
                item.type === "folder" ? (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigateToFolder(item.path)}
                    className="group flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-muted/50"
                  >
                    <FolderIcon className="size-16 fill-blue-100 text-blue-500" />
                    <p className="w-full truncate text-sm font-medium">{item.name}</p>
                  </button>
                ) : (
                  <div key={item.key} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={`/api/images/${item.key}`}
                      alt={item.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex justify-end">
                        <Button variant="destructive" size="icon-xs" onClick={() => setDeleteKey(item.key)}>
                          <Trash2Icon className="size-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-white">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-white/70">{formatBytes(item.size)}</p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="divide-y">
              {listItems.map((item) =>
                item.type === "folder" ? (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigateToFolder(item.path)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <FolderIcon className="size-10 fill-blue-100 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Folder</p>
                    </div>
                  </button>
                ) : (
                  <div key={item.key} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                    <div className="size-10 overflow-hidden rounded bg-muted flex-shrink-0">
                      <img
                        src={`/api/images/${item.key}`}
                        alt={item.name}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(item.size)} • {formatDistanceToNow(new Date(item.uploaded), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteKey(item.key)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {listItems.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {listItems.filter((i) => i.type === "folder").length} folders,{" "}
          {listItems.filter((i) => i.type === "file").length} files
        </p>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteKey} onOpenChange={(open) => !open && setDeleteKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file and its size variants from storage.
              {deleteKey && (
                <span className="mt-2 block truncate font-mono text-xs text-muted-foreground">{deleteKey}</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteKey && deleteMutation.mutate({ key: deleteKey })}
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

function parseItems(items: MediaItem[], currentPath: string): ListItem[] {
  const folders = new Map<string, FolderItem>();
  const files: FileItem[] = [];

  const prefix = currentPath ? `${currentPath}/` : "";
  const prefixLen = prefix.length;

  for (const item of items) {
    // Skip items that don't start with current path
    if (currentPath && !item.key.startsWith(prefix)) continue;

    const relativePath = item.key.slice(prefixLen);
    const slashIndex = relativePath.indexOf("/");

    if (slashIndex === -1) {
      // It's a file in current directory
      files.push({
        ...item,
        name: relativePath,
        type: "file",
      });
    } else {
      // It's in a subdirectory
      const folderName = relativePath.slice(0, slashIndex);
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;

      if (!folders.has(folderPath)) {
        folders.set(folderPath, {
          name: folderName,
          path: folderPath,
          type: "folder",
        });
      }
    }
  }

  // Sort: folders first, then files
  return [...folders.values(), ...files.sort((a, b) => a.name.localeCompare(b.name))];
}

function buildBreadcrumbs(path: string): Array<{ name: string; path: string }> {
  if (!path) return [];

  const segments = path.split("/").filter(Boolean);
  const crumbs: Array<{ name: string; path: string }> = [];

  for (let i = 0; i < segments.length; i++) {
    crumbs.push({
      name: segments[i],
      path: segments.slice(0, i + 1).join("/"),
    });
  }

  return crumbs;
}
