import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from multiple possible locations
const envPaths = [
  path.resolve(__dirname, '.env.local'),
  path.resolve(__dirname, 'env.production'),
  path.resolve(__dirname, '.env')
];

// Try to load from each location
for (const envPath of envPaths) {
  try {
    dotenv.config({ path: envPath });
    console.log('Loaded environment from:', envPath);
    break;
  } catch (error) {
    console.log('Could not load from:', envPath);
  }
}

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
