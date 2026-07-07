#!/usr/bin/env bash
# 旧 WordPress サーバーから wp-content を新 VPS へ同期
#
# VPS で実行:
#   bash deploy/migrate-wp-content.sh
#
# SSH で旧サーバーに入れる場合（推奨・再開可能）:
#   WP_SSH=ubuntu@49.212.243.171 \
#   WP_REMOTE_PATH=/var/www/html/wp-content \
#   bash deploy/migrate-wp-content.sh
#
# SSH なし（HTTPS 経由・uploads と img のみ）:
#   bash deploy/migrate-wp-content.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${WP_CONTENT_DEST:-$ROOT/data/wp-content}"
OLD_HOST="${WP_OLD_HOST:-49.212.243.171}"
HOST_HEADER="${WP_HOST_HEADER:-animemiru.jp}"
BASE_URL="https://${OLD_HOST}"

mkdir -p "$DEST"

echo "==> 同期先: $DEST"
echo "==> 旧サーバー: $OLD_HOST (Host: $HOST_HEADER)"

fetch_one() {
  local url_path="$1"
  local out_file="$2"
  if [ -f "$out_file" ] && [ "${FORCE:-0}" != "1" ]; then
    return 0
  fi
  mkdir -p "$(dirname "$out_file")"
  if curl -fsSL \
    --connect-timeout 15 \
    --max-time 120 \
    -H "Host: ${HOST_HEADER}" \
    -k \
    "${BASE_URL}${url_path}" \
    -o "$out_file"; then
    echo "  ok ${url_path}"
  else
    echo "  skip ${url_path}" >&2
    rm -f "$out_file"
    return 1
  fi
}

sync_theme_assets() {
  echo "==> テーマ用画像 (public/theme/images)"
  local theme_dir="$ROOT/public/theme/images"
  mkdir -p "$theme_dir/banners"

  fetch_one "/wp-content/uploads/2019/03/animeiru-logo-white-small.png" "$theme_dir/logo.png" || true
  fetch_one "/wp-content/themes/affinger5/images/no-img.png" "$theme_dir/no-img.png" || true
  fetch_one "/wp-content/img/ogp_top.jpg" "$theme_dir/ogp_top.jpg" || true
}

if [ -n "${WP_SSH:-}" ] && [ -n "${WP_REMOTE_PATH:-}" ]; then
  echo "==> rsync (SSH): ${WP_SSH}:${WP_REMOTE_PATH}/"
  rsync -avz --progress --delete-delay \
    -e ssh \
    "${WP_SSH}:${WP_REMOTE_PATH}/" \
    "${DEST}/"
else
  echo "==> HTTPS ミラー (uploads/, img/)"
  echo "    全 wp-content が必要なら WP_SSH + WP_REMOTE_PATH で rsync を使ってください"

  if ! command -v wget >/dev/null 2>&1; then
    echo "wget が必要です: sudo apt-get install -y wget"
    exit 1
  fi

  for target in uploads img; do
    echo "==> ${target}/"
    wget -e robots=off -r -np -nH --cut-dirs=0 -c \
      --header="Host: ${HOST_HEADER}" \
      --no-check-certificate \
      -P "$(dirname "$DEST")" \
      "${BASE_URL}/wp-content/${target}/" || true
  done
fi

sync_theme_assets

echo ""
echo "==> 完了"
du -sh "$DEST" 2>/dev/null || true
echo ""
echo "次: docker compose restart nginx"
echo "確認: curl -sI --resolve animemiru.jp:443:127.0.0.1 https://animemiru.jp/wp-content/uploads/2026/03/nato-nato-00.jpg | head -1"
