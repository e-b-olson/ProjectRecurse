import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Used for migrations and server-side queries.
// Never expose this connection string to the client.
const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
