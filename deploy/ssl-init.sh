#!/usr/bin/env bash
# Let's Encrypt 証明書の初回取得
# DNS が VPS を向いている必要があります（または certbot の DNS チャレンジを使用）
set -euo pipefail

DOMAIN="${1:-animemiru.jp}"
EMAIL="${2:-}"

if [ -z "$EMAIL" ]; then
  echo "使い方: bash deploy/ssl-init.sh animemiru.jp your@email.com"
  exit 1
fi

echo "==> certbot インストール"
sudo apt update
sudo apt install -y certbot

mkdir -p deploy/certs

echo "==> 証明書取得（standalone モード。80番ポートが空いている必要があります）"
echo "    既に docker compose が動いている場合は先に停止してください:"
echo "    docker compose down"
echo ""

sudo certbot certonly --standalone \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive

sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" deploy/certs/
sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" deploy/certs/
sudo chown "$(whoami):$(whoami)" deploy/certs/*.pem

echo ""
echo "証明書を deploy/certs/ に配置しました。"
echo "docker compose up -d --build で起動できます。"
echo ""
echo "更新 cron の例（root crontab）:"
echo "  0 3 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/*.pem $(pwd)/deploy/certs/ && docker compose restart nginx"
