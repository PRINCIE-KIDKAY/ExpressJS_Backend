import { int, mysqlTable, timestamp, varchar, } from "drizzle-orm/mysql-core";
import { users } from "./UserSchema";

export const user_company = mysqlTable("user_company", {
  id: int("id").notNull().primaryKey().autoincrement(),
  user_id: int("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  registration_no: varchar("registration_no", { length: 100 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
