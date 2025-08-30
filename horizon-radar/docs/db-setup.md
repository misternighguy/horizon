# Horizon Radar Database Setup

This document explains how to set up and use the Drizzle ORM database backend for Horizon Radar.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template and configure your database connection:

```bash
cp env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgres://USER:PASS@HOST:5432/DB?sslmode=require
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

### 2. Database Connection Examples

**Local Development:**
```env
DATABASE_URL=postgres://horizon_user:horizon_secure_password_2024@localhost:5432/horizon_radar
```

**Production (Ocean Droplet):**
```env
DATABASE_URL=postgres://horizon_user:horizon_secure_password_2024@your-droplet-ip:5432/horizon_radar?sslmode=require
```

## 🗄️ Database Operations

### Generate Migrations

Generate SQL migration files from your schema changes:

```bash
npm run db:generate
```

This creates migration files in the `./drizzle` directory based on changes in `src/db/schema.ts`.

### Apply Migrations

Apply pending migrations to your database:

```bash
npm run db:migrate
```

**Note:** Make sure your database is running and accessible before running migrations.

### Database Studio

Open Drizzle Studio to view and edit your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- Browse tables and data
- Execute SQL queries
- Edit records
- View schema structure

### Seed Database

Populate your database with initial data:

```bash
npm run db:seed
```

**Note:** The seed script will be created later. For now, use the migration tools in `database/` directory.

## 📁 File Structure

```
src/db/
├── client.ts          # Database connection and Drizzle client
├── index.ts           # Re-exports and utilities
└── schema.ts          # Drizzle schema definitions

drizzle/               # Generated migration files
├── 0000_initial.sql
├── 0001_add_users.sql
└── ...

drizzle.config.ts      # Drizzle configuration
env.example            # Environment variables template
```

## 🔧 Configuration

### Drizzle Config

The `drizzle.config.ts` file configures:
- **Schema location**: `./src/db/schema.ts`
- **Output directory**: `./drizzle`
- **Database dialect**: PostgreSQL
- **Connection**: Uses `DATABASE_URL` environment variable

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your_secure_secret_here` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `3000` |

## 🚨 Troubleshooting

### Common Issues

**Connection Refused**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify connection string format
echo $DATABASE_URL
```

**Permission Denied**
```bash
# Check user privileges
sudo -u postgres psql -c "\du"

# Verify database exists
sudo -u postgres psql -l
```

**Migration Errors**
```bash
# Check schema syntax
npx tsc --noEmit src/db/schema.ts

# Verify database connection
npm run db:studio
```

### Debug Commands

```bash
# Test database connection
node -e "require('dotenv').config(); const { db } = require('./src/db/client'); db.execute('SELECT 1').then(console.log).catch(console.error)"

# Check environment variables
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# Verify Drizzle installation
npx drizzle-kit --version
```

## 🔄 Development Workflow

### 1. Schema Changes

1. Edit `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `./drizzle/`
4. Apply migration: `npm run db:migrate`
5. Test changes: `npm run db:studio`

### 2. Data Operations

1. Use Drizzle client in your code:
   ```typescript
   import { db } from '@/db';
   import { users } from '@/db/schema';
   
   // Query users
   const allUsers = await db.select().from(users);
   ```

2. Import schema types:
   ```typescript
   import type { User } from '@/db/schema';
   ```

### 3. Testing

1. Run type check: `npx tsc --noEmit`
2. Test build: `npm run build`
3. Verify database operations work correctly

## 🔐 Security Notes

- **Never commit `.env` files** - they contain sensitive credentials
- **Use strong JWT secrets** - generate random strings for production
- **Enable SSL** for production database connections
- **Limit database user privileges** - only grant necessary permissions
- **Regular backups** - use the backup scripts in `database/` directory

## 📚 Next Steps

After setting up the database:

1. **Create API routes** using the Drizzle client
2. **Implement authentication** with JWT
3. **Add data validation** with Zod schemas
4. **Set up testing** with database fixtures
5. **Deploy to production** with proper environment variables

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check the Drizzle documentation: https://orm.drizzle.team/
5. Review the generated migration files for syntax errors

---

**Estimated Setup Time**: 15-30 minutes
**Difficulty**: Beginner
**Prerequisites**: PostgreSQL database running
