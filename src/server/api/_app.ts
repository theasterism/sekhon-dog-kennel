import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "@/server/api/trpc";
// Applications
import { create as createApplication } from "./router/applications/create";
import { get as getApplication } from "./router/applications/get";
import { list as listApplications } from "./router/applications/list";
import { updateStatus } from "./router/applications/update-status";
// Dogs - Admin
import { create } from "./router/dogs/admin/create";
import { delete_ as deleteDog } from "./router/dogs/admin/delete";
import { deleteImage } from "./router/dogs/admin/delete-image";
import { getByIdAdmin } from "./router/dogs/admin/get";
import { listAdmin } from "./router/dogs/admin/list";
import { setPrimaryImage } from "./router/dogs/admin/set-primary-image";
import { update } from "./router/dogs/admin/update";
import { uploadImage } from "./router/dogs/admin/upload-image";
import { getById } from "./router/dogs/public/get";
// Dogs - Public
import { list } from "./router/dogs/public/list";
// Hello
import { greet } from "./router/hello/greet";
// Media
import { deleteMedia } from "./router/media/delete";
import { listMedia } from "./router/media/list";
// Stats
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
      list: listAdmin,
      getById: getByIdAdmin,
    },
  },
  applications: {
    create: createApplication,
    list: listApplications,
    get: getApplication,
    updateStatus,
  },
  contact: {},
  media: {
    list: listMedia,
    delete: deleteMedia,
  },
  stats,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
