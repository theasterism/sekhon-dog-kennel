import { o, requireAuth } from "@/server/api/orpc";
import { DogTable } from "@/server/db/schema";
import { createId } from "@/server/utils";

export const createDog = o.use(requireAuth).handler(async ({ context }) => {
  const { db } = context;

  const id = createId();

  await db.insert(DogTable).values({ id });

  return { id };
});
