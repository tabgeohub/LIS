import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Database connection established");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Error connecting to database:", err.message);
    console.error("💡 Please check your database credentials in .env file");
    // Don't exit here - let the server start and fail on first query if needed
  });
