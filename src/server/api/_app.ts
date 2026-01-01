import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "@/server/api/trpc";
// Applications
import { create as createApplication } from "./router/applications/create";
import { get as getApplication } from "./router/applications/get";
import { list as listApplications } from "./router/applications/list";
import { updateStatus } from "./router/applications/update-status";
// Stats
import { stats } from "./router/stats";
// Dogs - Admin
import { create } from "./router/dogs/admin/create";
import { delete_ as deleteDog } from "./router/dogs/admin/delete";
import { deleteImage } from "./router/dogs/admin/delete-image";
import { setPrimaryImage } from "./router/dogs/admin/set-primary-image";
import { update } from "./router/dogs/admin/update";
import { uploadImage } from "./router/dogs/admin/upload-image";
import { getById } from "./router/dogs/public/get";
// Dogs - Public
import { list } from "./router/dogs/public/list";
// Hello
import { greet } from "./router/hello/greet";
import { stats } from "./router/stats";

export const appRouter = router({
  hello: {
    greet,
  },
  dogs: {
    public: {
      list,
      getById,
    },
    admin: {
      create,
      update,
      delete: deleteDog,
      uploadImage,
      deleteImage,
      setPrimaryImage,
    },
  },
  applications: {
    create: createApplication,
    list: listApplications,
    get: getApplication,
    updateStatus,
  },
  contact: {
    submit,
  },
  stats,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
