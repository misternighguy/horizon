# Horizon Radar PostgreSQL Deployment on DigitalOcean

This guide covers deploying PostgreSQL on a DigitalOcean droplet using Docker, with connection instructions for Vercel and local development.

## 🚀 Quick Start

### Prerequisites
- DigitalOcean droplet with Ubuntu 24.10+ (already configured: `ubuntu-s-2vcpu-4gb-amd-nyc3-01`)
- SSH access to the droplet
- Basic knowledge of Docker and PostgreSQL

### Your Droplet Details
- **IPv4**: 159.65.243.245
- **Private IP**: 10.108.0.2
- **Region**: NYC3
- **Specs**: 4GB RAM, 2 vCPUs, 80GB Disk
- **OS**: Ubuntu 24.10 x64

## 📋 Deployment Steps

### 1. Upload Deployment Files

First, upload the deployment files to your droplet:

```bash
# From your local machine, in the horizon-radar directory
scp -r deploy/do/ root@159.65.243.245:/root/horizon-radar-deploy
```

### 2. SSH into Your Droplet

```bash
ssh root@159.65.243.245
```

### 3. Run the Provisioning Script

```bash
cd horizon-radar-deploy
chmod +x provision.sh
./provision.sh
```

The script will:
- Install Docker and Docker Compose
- Configure the environment
- Set up PostgreSQL and pgAdmin
- Configure firewall rules
- Create backup and monitoring scripts

### 4. Configure Environment Variables

When prompted, edit the `.env` file:

```bash
nano .env
```

Set your secure passwords:
```bash
POSTGRES_DB=horizon_radar
POSTGRES_USER=horizon_user
POSTGRES_PASSWORD=your_very_secure_password_here
PGADMIN_EMAIL=admin@horizonradar.xyz
PGADMIN_PASSWORD=your_pgadmin_password_here
```

## 🔗 Connection Information

### PostgreSQL Connection String

**For Vercel:**
```
postgresql://horizon_user:your_password@159.65.243.245:5432/horizon_radar?sslmode=require&connect_timeout=10
```

**For Local Development:**
```
postgresql://horizon_user:your_password@159.65.243.245:5432/horizon_radar?sslmode=require
```

### pgAdmin Access
- **URL**: http://159.65.243.245:8080
- **Email**: admin@horizonradar.xyz
- **Password**: your_pgadmin_password

## 🔧 Vercel Configuration

### 1. Set Environment Variable

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://horizon_user:your_password@159.65.243.245:5432/horizon_radar?sslmode=require&connect_timeout=10`
   - **Environment**: Production, Preview, Development
3. Click **Save**

### 2. Redeploy

After setting the environment variable, redeploy your application:

```bash
vercel --prod
```

## 🛡️ Security Configuration

### Firewall Rules

The provisioning script configures UFW with:
- **SSH (22)**: Open
- **PostgreSQL (5432)**: Open (consider restricting to specific IPs)
- **pgAdmin (8080)**: Open (consider restricting to your IP)

### Restrict Access (Recommended)

For production, restrict PostgreSQL access to Vercel egress IPs:

```bash
# Get current Vercel egress IPs (check Vercel docs for latest)
sudo ufw delete allow 5432/tcp
sudo ufw allow from 76.76.19.76 to any port 5432 comment "Vercel Egress 1"
sudo ufw allow from 76.76.19.77 to any port 5432 comment "Vercel Egress 2"
# Add more Vercel IPs as needed
```

### SSH Tunneling Alternative

For enhanced security, use SSH tunneling instead of opening port 5432:

```bash
# On your local machine
ssh -L 5432:localhost:5432 root@159.65.243.245

# Then connect to localhost:5432
psql postgresql://horizon_user:password@localhost:5432/horizon_radar
```

## 📊 Database Management

### Backup and Restore

**Create Backup:**
```bash
./backup.sh
```

**Restore from Backup:**
```bash
./restore.sh horizon_radar_20241201_120000.sql.gz
```

### Monitoring

**Check Database Status:**
```bash
./monitor.sh
```

**View Logs:**
```bash
docker-compose logs -f postgres
```

### Automated Backups

Set up daily backups with cron:

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM UTC
0 2 * * * cd /root/horizon-radar-deploy && ./backup.sh >> /var/log/horizon-backup.log 2>&1
```

## 🔄 Database Migration

### 1. Run Schema Migrations

```bash
# On your local machine
npm run db:migrate
```

### 2. Seed the Database

```bash
# On your local machine
npm run db:seed
```

### 3. Verify Data

Connect to the database and verify:

```bash
psql postgresql://horizon_user:password@159.65.243.245:5432/horizon_radar

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM articles;
SELECT COUNT(*) FROM research_cards;
SELECT COUNT(*) FROM protocols;
```

## 🚨 Troubleshooting

### Common Issues

**Connection Refused:**
- Check if PostgreSQL is running: `docker-compose ps`
- Check firewall: `sudo ufw status`
- Verify port 5432 is open

**Authentication Failed:**
- Verify credentials in `.env` file
- Check if database exists: `docker-compose exec postgres psql -U postgres -l`

**SSL Connection Issues:**
- Ensure `sslmode=require` in connection string
- Check SSL certificates in container

### Logs and Debugging

**PostgreSQL Logs:**
```bash
docker-compose logs postgres
```

**pgAdmin Logs:**
```bash
docker-compose logs pgadmin
```

**System Logs:**
```bash
sudo journalctl -u docker
```

## 🔄 Alternative: Managed DigitalOcean PostgreSQL

If you prefer managed PostgreSQL:

### 1. Create Database Cluster

1. Go to **Databases** → **Create Database Cluster**
2. Choose **PostgreSQL** version 16
3. Select **NYC3** region
4. Choose **Basic** plan (1GB RAM, 1 vCPU)
5. Set database name and credentials

### 2. Connection Details

Managed PostgreSQL provides:
- Built-in SSL certificates
- Automated backups
- Monitoring and alerts
- Connection pooling

### 3. Update Vercel

Use the managed database connection string instead of the droplet IP.

## 📈 Performance Optimization

### PostgreSQL Tuning

The docker-compose includes optimized settings for 4GB RAM:
- `shared_buffers`: 256MB
- `effective_cache_size`: 1GB
- `work_mem`: 4MB
- `maintenance_work_mem`: 64MB

### Monitoring

Use the provided monitoring script to track:
- Database size
- Active connections
- Query performance
- Resource usage

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Restrict PostgreSQL access to specific IPs
- [ ] Enable automated backups
- [ ] Monitor logs regularly
- [ ] Keep system packages updated
- [ ] Use strong, unique passwords
- [ ] Consider SSH tunneling for enhanced security

## 📞 Support

For issues with:
- **DigitalOcean**: Check their documentation and support
- **PostgreSQL**: Check logs and connection settings
- **Docker**: Verify container status and configuration
- **Application**: Check Vercel deployment logs

## 🔄 Updates and Maintenance

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### Database Updates

```bash
# Backup before updates
./backup.sh

# Update schema
npm run db:migrate

# Verify data integrity
./monitor.sh
```

---

**Note**: This deployment uses self-signed SSL certificates. For production use, consider obtaining proper SSL certificates from Let's Encrypt or a commercial CA.
