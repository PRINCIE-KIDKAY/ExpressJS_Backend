import { int, mysqlTable, timestamp, varchar, } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").notNull().primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull(),
  surname: varchar("surname", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 12 }).notNull().unique(),
  role: varchar("role", { length: 10 }).notNull().default("user"), // Vendor or customer
  status: varchar("status", { length: 15 }).default("Inactive").notNull(), // Set to active after user has been verified
  idNum: varchar("idNum", { length: 13 }).unique(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});