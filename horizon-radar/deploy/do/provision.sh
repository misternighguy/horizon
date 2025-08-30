#!/bin/bash
set -e

echo "🚀 Setting up Horizon Radar PostgreSQL..."

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Setup environment
[ ! -f ".env" ] && cp env.example .env
echo "⚠️  Edit .env with your credentials, then press Enter..."
read

# Validate env
source .env
[ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] && echo "❌ Missing env vars" && exit 1

# Configure firewall
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 5432/tcp
sudo ufw allow 8080/tcp

# Start services
docker-compose down 2>/dev/null || true
docker-compose up -d

# Wait and test
sleep 10
docker-compose exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1

echo "✅ PostgreSQL ready at 159.65.243.245:5432"
echo "🔗 Connection: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@159.65.243.245:5432/${POSTGRES_DB}?sslmode=require"
echo "🌐 pgAdmin: http://159.65.243.245:8080 (${PGADMIN_EMAIL}:${PGADMIN_PASSWORD})"
