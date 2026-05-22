import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

const db = drizzle(client);

async function testConnection() {
  const result = await db.execute("select 1 as ok");
  console.log(result);
  await client.end();
}

testConnection().catch(console.error);