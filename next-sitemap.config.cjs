const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://animemiru.jp'

/**
 * 静的 sitemap は生成しない。
 * /sitemap.xml /pages-sitemap.xml /posts-sitemap.xml は App Router の route.ts で配信する。
 * postbuild でこの設定を走らせると空の public/sitemap.xml が作られ、動的ルートを上書きしてしまう。
 *
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  exclude: ['/*'],
}
