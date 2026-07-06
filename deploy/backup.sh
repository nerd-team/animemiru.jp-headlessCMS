#!/usr/bin/env bash
# MongoDB + メディアのバックアップ
set -euo pipefail

cd "$(dirname "$0")/.."

STAMP=$(date +%Y%m%d-%H%M%S)
DEST="backups/$STAMP"
mkdir -p "$DEST"

echo "==> MongoDB ダンプ"
docker compose exec -T mongo mongodump --archive --gzip > "$DEST/mongo.gz"

echo "==> メディアファイル"
if docker compose exec -T app test -d /app/public/media; then
  docker compose exec -T app tar czf - -C /app/public/media . > "$DEST/media.tar.gz"
fi

echo "バックアップ完了: $DEST"
