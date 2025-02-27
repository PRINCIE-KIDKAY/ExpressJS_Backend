require('dotenv').config();

interface DBCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface Config {
  schema: string;
  out: string;
  dialect: string;
  connectionString: string;
  dbCredentials: DBCredentials;
}

const config: Config = {
  schema: "./src/db/schemas/**/*.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  connectionString: process.env.CONNECTION_STRING || "postgres://user:password@localhost:5432/dbname", // Use env var for connection string if provided
  dbCredentials: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'slipsam',
  },
};

export default config;
