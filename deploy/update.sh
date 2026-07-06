#!/usr/bin/env bash
# 本番更新（git pull → 再ビルド → 再起動）
# GitHub Actions からも同じ手順で実行されます（.github/workflows/deploy.yml）
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> git pull"
git pull origin main

echo "==> docker compose build & up"
docker compose up -d --build

echo "==> 完了"
docker compose ps
