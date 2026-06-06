import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

const db = drizzle(sql);

async function run() {
  const result = await db.execute(`
    select
      current_database(),
      current_user,
      inet_server_addr(),
      inet_server_port()
  `);

  console.log("DB Info:", result);

  const tables = await db.execute(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
    order by table_name;
  `);

  console.log("Tables:", tables);

  await sql.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});