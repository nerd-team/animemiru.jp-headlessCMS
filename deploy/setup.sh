#!/usr/bin/env bash
# さくらVPS 初回セットアップ
# 使い方: bash deploy/setup.sh
set -euo pipefail

echo "==> Docker / Git のインストール確認"
if ! command -v docker &>/dev/null; then
  sudo apt update
  sudo apt install -y docker.io docker-compose-plugin git curl
  sudo usermod -aG docker "$USER"
  echo "Docker をインストールしました。一度ログアウトして再ログインしてください。"
fi

if [ ! -f .env ]; then
  echo "==> .env を作成"
  cp .env.example .env
  echo ""
  echo "【重要】.env を編集してから続行してください:"
  echo "  nano .env"
  echo ""
  echo "必須項目:"
  echo "  PAYLOAD_SECRET=（32文字以上のランダム文字列）"
  echo "  NEXT_PUBLIC_SERVER_URL=https://animemiru.jp"
  echo "  PREVIEW_SECRET / CRON_SECRET"
  exit 0
fi

mkdir -p deploy/certs backups

echo "==> ファイアウォール（ufw）"
if command -v ufw &>/dev/null; then
  sudo ufw allow OpenSSH
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw --force enable || true
fi

echo ""
echo "次のステップ:"
echo "  1. bash deploy/ssl-init.sh     # SSL 証明書取得"
echo "  2. docker compose up -d --build"
echo "  3. docker compose --profile tools run --rm tools npm run migrate:wp -- --limit 10"
echo ""
echo "詳細: deploy/DEPLOY.md"
