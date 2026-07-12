import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Lazy singleton — DATABASE_URL isn't set at build time (no DB exists yet,
 * see PLAN.md §8 Phase 3), and mysql2's pool throws immediately on an
 * undefined connection string. Only connect on first real query.
 */
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const connection = mysql.createPool(process.env.DATABASE_URL);
    _db = drizzle(connection, { schema, mode: "default" });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});
