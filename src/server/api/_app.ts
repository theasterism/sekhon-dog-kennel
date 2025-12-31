import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "@/server/api/trpc";

// Hello
import { greet } from "./router/hello/greet";

// Dogs - Public
import { list } from "./router/dogs/public/list";
import { getById } from "./router/dogs/public/get";

// Dogs - Admin
import { create } from "./router/dogs/admin/create";
import { update } from "./router/dogs/admin/update";
import { delete_ as deleteDog } from "./router/dogs/admin/delete";
import { uploadImage } from "./router/dogs/admin/upload-image";
import { deleteImage } from "./router/dogs/admin/delete-image";
import { setPrimaryImage } from "./router/dogs/admin/set-primary-image";

// Applications
import { create as createApplication } from "./router/applications/create";
import { list as listApplications } from "./router/applications/list";
import { get as getApplication } from "./router/applications/get";
import { updateStatus } from "./router/applications/update-status";

// Contact
import { submit } from "./router/contact/submit";

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
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
