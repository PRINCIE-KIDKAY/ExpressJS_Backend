import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
require('dotenv').config();

let connection;
try {
  connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  console.log("drizzle connected to database")
} catch (error) {
  console.log('Database connection failed:', error);
  throw error;
}

export const db = drizzle(connection);
