// Re-export database client and helpers
export { db, pool } from './client';

// Database utilities
export const dbUtils = {
  // Connection health check
  async healthCheck() {
    try {
      const { db } = await import('./client');
      const result = await db.execute('SELECT 1 as health');
      return { status: 'healthy', result };
    } catch (error) {
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Get connection info (without sensitive data)
  getConnectionInfo() {
    return {
      host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'localhost',
      port: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).port || '5432' : '5432',
      database: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).pathname.slice(1) : 'horizon_radar',
      ssl: process.env.NODE_ENV === 'production',
    };
  },
};
