# さくらVPS 本番デプロイ手順（Phase 7）

animemiru.jp を WordPress から Headless CMS（Payload + Next.js）へ移行するための手順書です。

## 全体の流れ

```
① VPS準備 → ② アプリ起動（ステージング） → ③ WP移行 → ④ 動作確認 → ⑤ DNS切替
```

DNS を切り替える**前**に、VPS 上でサイトが正しく動くことを確認します。

---

## 前提

| 項目 | 内容 |
|------|------|
| VPS | さくらのVPS（Ubuntu 22.04/24.04 推奨） |
| スペック目安 | メモリ 4GB 以上（移行・ビルド用） |
| ドメイン | animemiru.jp（お名前.com 等で管理） |
| 現行サイト | WordPress（移行元として REST API で取得） |

---

## Step 1 — VPS 初期設定

### 1-1. SSH 接続

さくらVPSコントロールパネルから:

- グローバル IP をメモ
- SSH 鍵またはパスワードでログイン

```bash
ssh root@<VPSのIP>
```

### 1-2. リポジトリの配置

```bash
apt update && apt install -y git
git clone https://github.com/nerd-team/animemiru.jp-headlessCMS.git
cd animemiru.jp-headlessCMS
bash deploy/setup.sh
```

### 1-3. 環境変数（`.env`）

```bash
cp .env.example .env
nano .env
```

**本番で必ず変更する項目:**

```env
DATABASE_URL=mongodb://mongo:27017/animemiru
PAYLOAD_SECRET=（openssl rand -base64 32 で生成）
NEXT_PUBLIC_SERVER_URL=https://animemiru.jp
PREVIEW_SECRET=（ランダム文字列）
CRON_SECRET=（ランダム文字列）

WP_URL=https://animemiru.jp
WP_MIGRATE_IMAGES=true

# 本番でアクセス数を記録する場合
ENABLE_VIEW_TRACKING=true
```

シークレット生成例:

```bash
openssl rand -base64 32
```

---

## Step 2 — SSL 証明書

### パターンA: DNS を先に VPS に向ける場合（推奨）

お名前.com 等で A レコードを VPS の IP に設定してから:

```bash
docker compose down   # 80番を空ける
bash deploy/ssl-init.sh animemiru.jp admin@animemiru.jp
```

### パターンB: DNS 切替前に IP で確認する場合

1. ローカル PC の `hosts` ファイルに一時追加:
   ```
   <VPSのIP>  animemiru.jp
   ```
2. 上記と同様に certbot で証明書取得
3. 確認後、本番 DNS を切り替え

---

## Step 3 — アプリ起動

```bash
docker compose up -d --build
```

起動確認:

```bash
docker compose ps
docker compose logs -f app
```

- サイト: https://animemiru.jp/
- 管理画面: https://animemiru.jp/admin（初回アクセスで管理者作成）

---

## Step 4 — WordPress から記事移行

### 4-1. テスト移行（10件）

```bash
docker compose --profile tools run --rm tools npm run migrate:wp -- --limit 10
```

ブラウザで記事表示・画像・カテゴリを確認。

### 4-2. 本番一括移行（約4,255件）

```bash
docker compose --profile tools run --rm tools npm run migrate:wp -- --all
```

> 画像ダウンロード込みで数時間かかる場合があります。  
> `screen` や `tmux` の利用を推奨します。

### 4-3. 移行後処理

```bash
# 本文 HTML の alt / lazy load 付与（CRON_SECRET 認証）
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://animemiru.jp/next/enrich-content
```

---

## Step 5 — DNS 本番切替

1. お名前.com で `animemiru.jp` / `www.animemiru.jp` の A レコードを VPS IP に変更
2. TTL 経過後（最大24〜48時間）、https://animemiru.jp/ で最終確認
3. 問題なければ旧 WordPress サーバーを停止（ロールバック用に数日残すのも可）

---

## 運用コマンド

| 操作 | コマンド |
|------|---------|
| 更新デプロイ | `bash deploy/update.sh` |
| バックアップ | `bash deploy/backup.sh` |
| ログ確認 | `docker compose logs -f app` |
| 再起動 | `docker compose restart` |

### SSL 自動更新（cron）

```cron
0 3 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/animemiru.jp/*.pem /path/to/deploy/certs/ && cd /path/to/repo && docker compose restart nginx
```

---

## アーキテクチャ

```
Internet → nginx (:443) → app (:3000, 内部のみ) → mongo (:27017, localhost のみ)
                ↓
         media_uploads（Docker ボリューム）
         mongo_data（Docker ボリューム）
```

---

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| `/admin` が 500 | `docker compose down && rm -rf .next && docker compose up -d --build` |
| ビルド失敗 | メモリ不足 → VPS のスワップ追加 or スペックアップ |
| 移行が止まる | `docker compose logs tools` を確認。`--limit 10` で再テスト |
| 画像が表示されない | `bash deploy/migrate-wp-content.sh` で同期後 `docker compose restart nginx`。`NEXT_PUBLIC_SERVER_URL` も確認 |

### 画像（wp-content）の移行

記事本文・サムネは `/wp-content/uploads/` にあります。新 VPS へコピーします。

```bash
# 1. コード更新
git pull origin main

# 2. jq（初回のみ）
sudo apt-get install -y jq

# 3. 旧サーバーから同期（メディア数により 30分〜数時間）
bash deploy/migrate-wp-content.sh

# 旧サーバーに SSH できる場合（推奨・途中再開可）
# WP_SSH=ユーザー@49.212.243.171 WP_REMOTE_PATH=/var/www/html/wp-content bash deploy/migrate-wp-content.sh

# 3. nginx 反映
docker compose up -d
docker compose restart nginx

# 4. 確認
curl -sI --resolve animemiru.jp:443:127.0.0.1 \
  https://animemiru.jp/wp-content/uploads/2026/03/nato-nato-00.jpg | head -1
```

`data/wp-content/` は Git に含めません（`.gitignore`）。バックアップは `deploy/backup.sh` または `rsync` で別途。

---

## 次に共有いただきたい情報

VPS への実際の作業を一緒に進めるため、以下を教えてください:

1. **VPS のグローバル IP**
2. **OS バージョン**（Ubuntu 22.04 など）
3. **SSH 接続方法**（鍵 or パスワード）
4. **ドメイン DNS の管理場所**（お名前.com など）
5. **GitHub リポジトリは push 済みか**（未 push なら先に push が必要）

これが揃えば、SSH 経由でセットアップを進められます。
