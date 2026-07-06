# animemiru.jp Headless CMS

[animemiru.jp](https://animemiru.jp/) を **Payload CMS + Next.js** で再構築するプロジェクトです。  
現行の WordPress（AFFINGER5 テーマ）と同じ見た目・URL 構造を維持しつつ、さくらのVPS 上でヘッドレス CMS として運用します。

## アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│  さくらのVPS                                         │
│  ┌─────────┐    ┌──────────────────────────────┐   │
│  │  nginx  │───▶│  Next.js + Payload CMS       │   │
│  │  :443   │    │  - フロント: animemiru.jp      │   │
│  └─────────┘    │  - 管理画面: /admin            │   │
│                 │  - API: /api                     │   │
│                 └──────────┬─────────────────────┘   │
│                            │                          │
│                 ┌──────────▼──────────┐               │
│                 │  MongoDB            │               │
│                 └─────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

| 役割 | 技術 |
|------|------|
| CMS | [Payload CMS 3.x](https://payloadcms.com/) |
| フロントエンド | Next.js 15 (App Router) |
| DB | MongoDB |
| テーマ CSS | AFFINGER5（`public/theme/css/`） |
| デプロイ | Docker Compose + nginx |

## ローカル開発

### 前提

- Node.js 20.9+
- MongoDB（ローカル or Docker）

### セットアップ

```bash
git clone https://github.com/nerd-team/animemiru.jp-headlessCMS.git
cd animemiru.jp-headlessCMS
cp .env.example .env
# .env を編集（PAYLOAD_SECRET 等）

# MongoDB を Docker で起動する場合
docker compose up mongo -d

npm install
npm run dev
```

- サイト: http://localhost:3000
- 管理画面: http://localhost:3000/admin（初回アクセスで管理者作成）

## さくらのVPS へのデプロイ

### 1. サーバー準備

```bash
# VPS に SSH 接続後
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
```

### 2. リポジトリのクローンと環境変数

```bash
git clone https://github.com/nerd-team/animemiru.jp-headlessCMS.git
cd animemiru.jp-headlessCMS
cp .env.example .env
nano .env
```

`.env` の例:

```env
DATABASE_URL=mongodb://mongo:27017/animemiru
PAYLOAD_SECRET=（32文字以上のランダム文字列）
NEXT_PUBLIC_SERVER_URL=https://animemiru.jp
PREVIEW_SECRET=（ランダム文字列）
CRON_SECRET=（ランダム文字列）
```

### 3. SSL 証明書

```bash
# certbot で取得（nginx 停止時）
sudo certbot certonly --standalone -d animemiru.jp -d www.animemiru.jp
sudo cp /etc/letsencrypt/live/animemiru.jp/fullchain.pem deploy/certs/
sudo cp /etc/letsencrypt/live/animemiru.jp/privkey.pem deploy/certs/
```

### 4. 起動

```bash
docker compose up -d --build
```

詳細な手順・移行・運用は **[deploy/DEPLOY.md](deploy/DEPLOY.md)** を参照してください。

### 5. DNS

さくらのVPS のグローバル IP を `animemiru.jp` / `www.animemiru.jp` の A レコードに設定。

## WordPress からのコンテンツ移行

1. WordPress 管理画面で **Application Passwords** を発行
2. `.env` に設定:

```env
WP_URL=https://animemiru.jp
WP_USER=管理者ユーザー名
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

3. 移行実行:

```bash
# VPS 上（Docker 内）
docker compose --profile tools run --rm tools npm run migrate:wp -- --limit 10
docker compose --profile tools run --rm tools npm run migrate:wp -- --all
```

移行スクリプトは以下を行います:

- カテゴリの作成
- 記事のタイトル・抜粋・日付・`wpId`（旧 URL `/articles/{id}` 維持用）の移行

> **注意**: 本文 HTML → Lexical リッチテキストの完全変換は別途カスタム処理が必要です。  
> 本番移行前に数件でテストし、表示を確認してください。

## URL 設計（現行サイトとの互換）

| ページ | URL |
|--------|-----|
| トップ | `/` |
| 記事 | `/articles/{wpId}` または `/articles/{slug}` |
| カテゴリ | `/articles/category/{slug}` |
| 検索 | `/search?q=` |
| 管理画面 | `/admin` |

## ディレクトリ構成

```
src/
  app/(frontend)/          # 公開サイト
    page.tsx               # トップ（スライダー + 記事一覧）
    articles/[slug]/       # 記事詳細
  collections/Posts/       # 記事コレクション（wpId, excerpt 追加済み）
  components/animemiru/    # AFFINGER5 互換 UI コンポーネント
public/theme/              # AFFINGER5 CSS・画像
deploy/                    # nginx 設定
scripts/wp-migrate.ts      # WordPress 移行スクリプト
```

## 見た目を完全再現するために

現行 FTP から AFFINGER5 の `style.css` を `public/theme/css/` に配置済みです。  
さらに完全一致させるには:

1. WordPress 管理画面の AFFINGER カスタム CSS（`st-kanricss.php` 相当）をエクスポートして追加
2. ロゴ画像を `public/theme/images/logo.png` に配置
3. 広告タグ（MicroAd 等）をレイアウトに追加
4. サイドバーウィジェット内容を Payload の Globals で管理

## 今後の作業

- [ ] 本文 HTML → Lexical 変換の本格実装
- [ ] カテゴリ一覧ページ (`/articles/category/[slug]`)
- [ ] 検索ページ
- [ ] 固定ページ（利用規約・お問い合わせ等）
- [ ] 旧 WordPress からのリダイレクト一括設定
- [ ] bbPress 掲示板（別途検討 or 廃止）

## ライセンス

MIT
