#!/usr/bin/env bash
# 旧 WordPress サーバーから wp-content を新 VPS へ同期
#
# VPS で実行:
#   bash deploy/migrate-wp-content.sh
#
# SSH で旧サーバーに入れる場合（推奨・最速）:
#   WP_SSH=ユーザー@49.212.243.171 \
#   WP_REMOTE_PATH=/var/www/html/wp-content \
#   bash deploy/migrate-wp-content.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${WP_CONTENT_DEST:-$ROOT/data/wp-content}"
OLD_HOST="${WP_OLD_HOST:-49.212.243.171}"
HOST_HEADER="${WP_HOST_HEADER:-animemiru.jp}"
BASE_URL="https://${OLD_HOST}"
PER_PAGE="${WP_MEDIA_PER_PAGE:-100}"

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

path_to_dest() {
  local url_path="$1"
  local relative="${url_path#/wp-content/}"
  echo "${DEST}/${relative}"
}

url_to_path() {
  local url="$1"
  echo "$url" | sed -E 's|^https?://[^/]+(/wp-content/.+)$|\1|'
}

sync_theme_assets() {
  echo "==> テーマ用画像 (public/theme/images)"
  local theme_dir="$ROOT/public/theme/images"
  mkdir -p "$theme_dir/banners" "$DEST/img"

  fetch_one "/wp-content/uploads/2019/03/animeiru-logo-white-small.png" "$theme_dir/logo.png" || true
  fetch_one "/wp-content/themes/affinger5/images/no-img.png" "$theme_dir/no-img.png" || true
  fetch_one "/wp-content/img/ogp_top.jpg" "$DEST/img/ogp_top.jpg" || true
  fetch_one "/wp-content/img/good.png" "$DEST/img/good.png" || true
  fetch_one "/wp-content/img/bad.png" "$DEST/img/bad.png" || true
}

sync_via_wp_api() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "jq が必要です: sudo apt-get install -y jq"
    exit 1
  fi

  echo "==> WordPress REST API からメディア一覧を取得"
  local page=1
  local total_pages=1
  local downloaded=0
  local skipped=0

  while [ "$page" -le "$total_pages" ]; do
    local response
    response="$(curl -fsSL -k \
      -H "Host: ${HOST_HEADER}" \
      -D - \
      "${BASE_URL}/wp-json/wp/v2/media?per_page=${PER_PAGE}&page=${page}" \
      -o /tmp/wp-media-$$.json)" || {
      echo "メディア API 取得失敗 (page=${page})" >&2
      break
    }

    total_pages="$(echo "$response" | awk 'tolower($0) ~ /^x-wp-totalpages:/ {print $2}' | tr -d '\r')"
    total_pages="${total_pages:-1}"

    local count
    count="$(jq 'length' /tmp/wp-media-$$.json)"
    echo "  page ${page}/${total_pages} (${count} items)"

    while IFS= read -r url; do
      [ -z "$url" ] && continue
      local url_path
      url_path="$(url_to_path "$url")"
      [ -z "$url_path" ] && continue
      if fetch_one "$url_path" "$(path_to_dest "$url_path")"; then
        downloaded=$((downloaded + 1))
      else
        skipped=$((skipped + 1))
      fi
    done < <(
      jq -r '
        .[]
        | .source_url,
          (.media_details.sizes // {} | .[] | .source_url // empty)
      ' /tmp/wp-media-$$.json | sort -u
    )

    rm -f /tmp/wp-media-$$.json
    page=$((page + 1))
  done

  echo "  media downloaded=${downloaded} skipped=${skipped}"
}

sync_post_content_images() {
  if ! command -v jq >/dev/null 2>&1; then
    return 0
  fi

  echo "==> 記事本文内の wp-content 画像を補完"
  local page=1
  local total_pages=1
  local extra=0

  while [ "$page" -le "$total_pages" ]; do
    local response
    response="$(curl -fsSL -k \
      -H "Host: ${HOST_HEADER}" \
      -D - \
      "${BASE_URL}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&status=publish&_fields=content" \
      -o /tmp/wp-posts-$$.json)" || break

    total_pages="$(echo "$response" | awk 'tolower($0) ~ /^x-wp-totalpages:/ {print $2}' | tr -d '\r')"
    total_pages="${total_pages:-1}"

    while IFS= read -r url_path; do
      [ -z "$url_path" ] && continue
      if [ ! -f "$(path_to_dest "$url_path")" ]; then
        if fetch_one "$url_path" "$(path_to_dest "$url_path")"; then
          extra=$((extra + 1))
        fi
      fi
    done < <(
      jq -r '.[].content.rendered' /tmp/wp-posts-$$.json \
        | grep -oE '/wp-content/uploads/[^"'\''<> ]+' \
        | sort -u
    )

    rm -f /tmp/wp-posts-$$.json
    page=$((page + 1))
  done

  echo "  extra from post HTML: ${extra}"
}

if [ -n "${WP_SSH:-}" ] && [ -n "${WP_REMOTE_PATH:-}" ]; then
  echo "==> rsync (SSH): ${WP_SSH}:${WP_REMOTE_PATH}/"
  rsync -avz --progress \
    -e ssh \
    "${WP_SSH}:${WP_REMOTE_PATH}/" \
    "${DEST}/"
else
  echo "==> HTTPS + WordPress API（ディレクトリ一覧は 403 のため API 経由）"
  sync_via_wp_api
  sync_post_content_images
fi

sync_theme_assets

echo ""
echo "==> 完了"
du -sh "$DEST" 2>/dev/null || true
echo ""
echo "次: docker compose restart nginx"
echo "確認: curl -sI --resolve animemiru.jp:443:127.0.0.1 https://animemiru.jp/wp-content/uploads/2026/03/nato-nato-00.jpg | head -1"
