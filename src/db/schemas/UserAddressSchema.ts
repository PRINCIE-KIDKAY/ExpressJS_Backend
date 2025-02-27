import { int, mysqlTable, timestamp, varchar, } from "drizzle-orm/mysql-core";
import { users } from "./UserSchema";

export const user_address = mysqlTable("user_address", {
  id: int("id").notNull().primaryKey().autoincrement(),
  user_id: int("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  street: varchar("street", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),
  postal_code: varchar("postal_code", { length: 12 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}); 