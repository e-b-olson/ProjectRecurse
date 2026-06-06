import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator"; // or your driver's migrator
import postgres from "postgres";
//import { db } from "../db"; // your drizzle instance

const client = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

const db = drizzle(client);

async function runMigration() {
  console.log("Checking for pending migrations...");
  try {
    // Force Drizzle to look at your migrations folder
    await migrate(db, { migrationsFolder: "./db/migrations" }); 
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed critical execution:");
    console.error(error); // This will tell us EXACTLY why the 'skills' table fails
  }
}

runMigration();