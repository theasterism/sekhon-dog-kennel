import * as z from "zod";
import { o } from "../orpc";
import { createDog } from "./dogs/admin/create";
import { deleteDog } from "./dogs/admin/delete";
import { deleteImage } from "./dogs/admin/delete-image";
import { setPrimaryImage } from "./dogs/admin/set-primary-image";
import { updateDog } from "./dogs/admin/update";
import { uploadImage } from "./dogs/admin/upload-image";
import { getDogById } from "./dogs/public/getById";
import { list } from "./dogs/public/list";

export const appRouter = {
  hello: o
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .handler(({ input }) => {
      return {
        greeting: `Hello from oRPC, ${input.text ?? "Anonymous"}`,
      };
    }),
  dogs: {
    admin: {
      create: createDog,
      update: updateDog,
      delete: deleteDog,
      setPrimaryImage,
      uploadImage,
      deleteImage,
    },
    get: getDogById,
    list,
  },
};
