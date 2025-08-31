import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Use absolute path to ensure .env.local is found
const envPath = path.resolve(__dirname, '.env.local');
console.log('Loading environment from:', envPath);
dotenv.config({ path: envPath });

// Debug: log the DATABASE_URL
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_SSL === 'true' ? 'require' : false,
  },
  verbose: true,
  strict: true,
});
