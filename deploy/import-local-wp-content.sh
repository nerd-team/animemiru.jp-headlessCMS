#!/usr/bin/env bash
# FTP 等で取得した wp-content を新 VPS の data/wp-content/ へ取り込む
#
# 例（VPS 上で uploads フォルダを rsync した後）:
#   bash deploy/import-local-wp-content.sh ~/uploads-backup
#
# 例（tar.gz を VPS に scp した後）:
#   bash deploy/import-local-wp-content.sh ~/wp-content-uploads.tar.gz

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${WP_CONTENT_DEST:-$ROOT/data/wp-content}"
SRC="${1:-}"

if [ -z "$SRC" ]; then
  echo "使い方:"
  echo "  bash deploy/import-local-wp-content.sh /path/to/uploads"
  echo "  bash deploy/import-local-wp-content.sh /path/to/wp-content-uploads.tar.gz"
  exit 1
fi

mkdir -p "$DEST"

if [ -f "$SRC" ]; then
  echo "==> 展開: $SRC"
  case "$SRC" in
    *.tar.gz | *.tgz)
      tar xzf "$SRC" -C "$DEST"
      ;;
    *.zip)
      unzip -o "$SRC" -d "$DEST"
      ;;
    *)
      echo "未対応の形式です（.tar.gz / .zip）"
      exit 1
      ;;
  esac
elif [ -d "$SRC" ]; then
  if [ -d "$SRC/uploads" ]; then
    echo "==> rsync: $SRC/uploads/ -> $DEST/uploads/"
    rsync -av --progress "$SRC/uploads/" "$DEST/uploads/"
  else
    echo "==> rsync: $SRC/ -> $DEST/uploads/"
    rsync -av --progress "$SRC/" "$DEST/uploads/"
  fi
else
  echo "パスが見つかりません: $SRC"
  exit 1
fi

echo ""
echo "==> 完了"
du -sh "$DEST" 2>/dev/null || true
echo ""
echo "次: docker compose restart nginx"
