import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  ImagePlusIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { broadcastInvalidate } from "@/lib/broadcast";
import type { RouterOutputs } from "@/server/api/root";
import { cn } from "@/utils/cn";

type DogData = NonNullable<RouterOutputs["dogs"]["admin"]["getById"]>;

const DogFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  color: z.string().optional(),
  weight: z.coerce.number().optional(),
  description: z.string().optional(),
  status: z.enum(["available", "reserved", "sold"]).optional(),
  price: z.coerce.number().optional(),
  // Health info
  microchipped: z.boolean().optional(),
  vaccinations: z.string().optional(), // comma-separated
  dewormings: z.coerce.number().optional(),
  vetChecked: z.boolean().optional(),
});

export const Route = createFileRoute("/admin/_dashboard/dogs/$dogId/edit")({
  loader: async ({ context, params }) => {
    const { api, queryClient } = context;
    await queryClient.ensureQueryData(api.dogs.admin.getById.queryOptions({ id: params.dogId }));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { dogId } = Route.useParams();
  const { api } = Route.useRouteContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const dogQuery = useQuery(api.dogs.admin.getById.queryOptions({ id: dogId }));
  const dog = dogQuery.data;

  const updateMutation = useMutation({
    ...api.dogs.admin.update.mutationOptions(),
    onSuccess: () => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.getById.queryKey({ id: dogId }) });
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.list.queryKey() });
      // Invalidate public queries so homepage and dogs list refresh
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.getById.queryKey({ id: dogId }) });
      // Broadcast to other tabs
      broadcastInvalidate([api.dogs.public.list.queryKey(), api.dogs.public.getById.queryKey({ id: dogId })]);
      toast.success("Dog updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update dog", { description: error.message });
    },
  });

  const deleteMutation = useMutation({
    ...api.dogs.admin.delete.mutationOptions(),
    onSuccess: async () => {
      // Invalidate all dog queries
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      // Broadcast to other tabs
      broadcastInvalidate([api.dogs.public.list.queryKey()]);
      toast.success("Dog deleted successfully");
      await router.navigate({ to: "/admin" });
    },
    onError: (error) => {
      toast.error("Failed to delete dog", { description: error.message });
    },
  });

  if (!dog) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Dog not found</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-4xl flex-col gap-8 mx-auto px-5 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" render={<Link to="/admin" />}>
            <ArrowLeftIcon />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{dog.name === "Untitled" ? "New Dog" : dog.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <PublishToggle dog={dog} onPublish={(published) => updateMutation.mutate({ id: dogId, published })} />
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
              <Trash2Icon data-icon="inline-start" className="size-4" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this dog?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the dog and all associated images.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteMutation.mutate({ id: dogId })}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Spinner /> : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery dogId={dogId} images={dog.images} />

      {/* Form */}
      <DogForm
        dog={dog}
        onSubmit={(values) => updateMutation.mutate({ id: dogId, ...values })}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}

function PublishToggle({ dog, onPublish }: { dog: DogData; onPublish: (published: boolean) => void }) {
  const isPublished = !!dog.publishedAt;

  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={isPublished}
      onPressedChange={(pressed) => onPublish(pressed)}
      className="gap-2 data-[state=on]:bg-green-500/10 data-[state=on]:text-green-600 data-[state=on]:border-green-500/30"
    >
      {isPublished ? (
        <>
          <EyeIcon className="size-4" />
          Public
        </>
      ) : (
        <>
          <EyeOffIcon className="size-4" />
          Private
        </>
      )}
    </Toggle>
  );
}

function ImageGallery({ dogId, images }: { dogId: string; images: DogData["images"] }) {
  const { api } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation({
    ...api.dogs.admin.uploadImage.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.getById.queryKey({ id: dogId }) });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.getById.queryKey({ id: dogId }) });
      broadcastInvalidate([api.dogs.public.list.queryKey(), api.dogs.public.getById.queryKey({ id: dogId })]);
      toast.success("Image uploaded");
    },
    onError: (error) => {
      toast.error("Failed to upload image", { description: error.message });
    },
  });

  const deleteImageMutation = useMutation({
    ...api.dogs.admin.deleteImage.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.getById.queryKey({ id: dogId }) });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.getById.queryKey({ id: dogId }) });
      broadcastInvalidate([api.dogs.public.list.queryKey(), api.dogs.public.getById.queryKey({ id: dogId })]);
      toast.success("Image deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete image", { description: error.message });
    },
  });

  const setPrimaryMutation = useMutation({
    ...api.dogs.admin.setPrimaryImage.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.dogs.admin.getById.queryKey({ id: dogId }) });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: api.dogs.public.getById.queryKey({ id: dogId }) });
      broadcastInvalidate([api.dogs.public.list.queryKey(), api.dogs.public.getById.queryKey({ id: dogId })]);
      toast.success("Primary image updated");
    },
    onError: (error) => {
      toast.error("Failed to set primary image", { description: error.message });
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("dogId", dogId);
        formData.append("file", file);
        formData.append("isPrimary", String(images.length === 0 && i === 0));
        await uploadMutation.mutateAsync(formData);
      }
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [dogId, images.length, uploadMutation],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <img src={`/api/images/${image.r2Key}`} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon-xs"
                  onClick={() => setPrimaryMutation.mutate({ imageId: image.id })}
                  disabled={image.isPrimary ?? false}
                  title="Set as primary"
                >
                  <StarIcon className={image.isPrimary ? "fill-current" : ""} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => deleteImageMutation.mutate({ imageId: image.id })}
                  title="Delete"
                >
                  <XIcon />
                </Button>
              </div>
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}

          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {uploading ? <Spinner className="size-6" /> : <ImagePlusIcon className="size-6" />}
            <span className="text-xs">Add Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function DogForm({
  dog,
  onSubmit,
  isPending,
}: {
  dog: DogData;
  onSubmit: (values: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const form = useForm({
    defaultValues: {
      name: dog.name,
      breed: dog.breed ?? "",
      dateOfBirth: dog.dateOfBirth ? new Date(dog.dateOfBirth).toISOString().split("T")[0] : "",
      gender: dog.gender ?? undefined,
      size: dog.size ?? undefined,
      color: dog.color ?? "",
      weight: dog.weight ?? undefined,
      description: dog.description ?? "",
      status: dog.status ?? "available",
      price: dog.price ?? undefined,
      microchipped: dog.microchipped ?? false,
      vaccinations: dog.vaccinations?.join(", ") ?? "",
      dewormings: dog.dewormings ?? 0,
      vetChecked: dog.vetChecked ?? false,
    } as z.input<typeof DogFormSchema>,
    validationLogic: revalidateLogic(),
    validators: {
      onChangeAsync: DogFormSchema,
      onChangeAsyncDebounceMs: 500,
    },
    onSubmit: ({ value }) => {
      const payload: Record<string, unknown> = { ...value };
      if (value.dateOfBirth) {
        payload.dateOfBirth = new Date(value.dateOfBirth);
      } else {
        payload.dateOfBirth = null;
      }
      if (!value.breed) payload.breed = null;
      if (!value.color) payload.color = null;
      if (!value.weight) payload.weight = null;
      if (!value.description) payload.description = null;
      if (!value.price) payload.price = null;
      // Convert vaccinations string to array
      if (value.vaccinations) {
        payload.vaccinations = value.vaccinations
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      } else {
        payload.vaccinations = null;
      }
      onSubmit(payload);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
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
            <div className="grid sm:grid-cols-2 gap-6">
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="breed">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Breed</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="dateOfBirth">
                {(field) => {
                  const dateValue = field.state.value ? new Date(field.state.value) : undefined;
                  return (
                    <Field>
                      <FieldLabel>Date of Birth</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-start gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                            !dateValue && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="size-4" />
                          {dateValue ? format(dateValue, "PPP") : "Select date"}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              if (date) {
                                field.handleChange(date.toISOString().split("T")[0]);
                              } else {
                                field.handleChange("");
                              }
                            }}
                            captionLayout="dropdown"
                            fromYear={2015}
                            toYear={new Date().getFullYear()}
                            defaultMonth={dateValue}
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="gender">
                {(field) => (
                  <Field>
                    <FieldLabel>Gender</FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(v) => field.handleChange(v as "male" | "female")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.state.value ? (field.state.value === "male" ? "Male" : "Female") : "Select gender"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="size">
                {(field) => (
                  <Field>
                    <FieldLabel>Size</FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(v) => field.handleChange(v as "small" | "medium" | "large")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.state.value
                            ? field.state.value.charAt(0).toUpperCase() + field.state.value.slice(1)
                            : "Select size"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="color">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="weight">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Weight (lbs)</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.1"
                      value={String(field.state.value ?? "")}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={field.state.value ?? "available"}
                      onValueChange={(v) => field.handleChange(v as "available" | "reserved" | "sold")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="price">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Price ($)</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.01"
                      value={String(field.state.value ?? "")}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    rows={4}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            {/* Health Information */}
            <div className="border-t pt-6 mt-2">
              <h3 className="font-medium mb-4">Health Information</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <form.Field name="vaccinations">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Vaccinations</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g., Rabies, Parvo, Distemper"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Separate multiple with commas</p>
                    </Field>
                  )}
                </form.Field>

                <form.Field name="dewormings">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Deworming Treatments</FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        value={String(field.state.value ?? "")}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="vetChecked">
                  {(field) => (
                    <Field>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.state.value ?? false}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="size-4 rounded border-input"
                        />
                        <span className="text-sm font-medium">Vet Checked</span>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">Full veterinary examination completed</p>
                    </Field>
                  )}
                </form.Field>

                <form.Field name="microchipped">
                  {(field) => (
                    <Field>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.state.value ?? false}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="size-4 rounded border-input"
                        />
                        <span className="text-sm font-medium">Microchipped</span>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">Registered microchip included</p>
                    </Field>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="flex justify-end">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isSubmitting || isPending ? <Spinner /> : null}
                    Save Changes
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
