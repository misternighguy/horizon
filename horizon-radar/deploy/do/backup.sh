#!/bin/bash
set -e
source .env
BACKUP_DIR="$HOME/backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/horizon_radar_$TIMESTAMP.sql"
docker-compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$BACKUP_FILE"
gzip "$BACKUP_FILE"
echo "✅ Backup: ${BACKUP_FILE}.gz"
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
