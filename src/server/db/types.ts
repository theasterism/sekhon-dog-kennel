import { SessionTable } from "./schema";

export type Session = Pick<typeof SessionTable.$inferSelect, "id" | "expiresAt">;
