import { int, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./UserSchema";

export const opt_codes = mysqlTable("opt_codes", {
  id: int("id").notNull().primaryKey().autoincrement(),
  user_id: int("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  code: int("code").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});