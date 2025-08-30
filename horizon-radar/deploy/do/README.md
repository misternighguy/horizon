# Horizon Radar PostgreSQL Deployment

Quick deployment of PostgreSQL on DigitalOcean droplet.

## 🚀 Deploy

```bash
# Upload files
scp -r deploy/do/ root@159.65.243.245:/root/horizon-radar-deploy

# SSH and run
ssh root@159.65.243.245
cd horizon-radar-deploy
chmod +x provision.sh
./provision.sh
```

## 🔧 Configure

Edit `.env` with your credentials when prompted.

## 📊 Manage

```bash
./backup.sh    # Create backup
./monitor.sh   # Check status
docker-compose logs postgres  # View logs
```

## 🔗 Connect

- **PostgreSQL**: 159.65.243.245:5432
- **pgAdmin**: http://159.65.243.245:8080
- **Connection String**: `postgresql://user:pass@159.65.243.245:5432/horizon_radar?sslmode=require`

## 📚 Docs

See `docs/deploy-do.md` for detailed instructions.
