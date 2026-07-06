import config from '@payload-config'
import { getPayload } from 'payload'

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/siteConfig'
import { getSiteUrl } from '@/lib/getSiteUrl'

export async function GET() {
  const payload = await getPayload({ config })
  const siteUrl = getSiteUrl()

  const categories = await payload.find({
    collection: 'categories',
    limit: 30,
    pagination: false,
    sort: 'title',
    select: { title: true, slug: true },
  })

  const categoryLines = categories.docs
    .map((c) => `- ${c.title}: ${siteUrl}/articles/category/${c.slug}`)
    .join('\n')

  const body = `# ${SITE_NAME}
> ${SITE_TAGLINE}

${SITE_DESCRIPTION}

## サイト情報
- URL: ${siteUrl}
- 言語: 日本語
- 更新頻度: 毎日（新作アニメ・人気作品の記事を継続更新）
- RSS: ${siteUrl}/feed.xml
- サイトマップ: ${siteUrl}/pages-sitemap.xml, ${siteUrl}/posts-sitemap.xml

## コンテンツ種別
- キャラクター人気ランキング（TOP9形式）
- アニメ・漫画の考察・ネタバレ解説
- 作品・キャラクター紹介記事

## 主要カテゴリ
${categoryLines || '- （カテゴリ読み込み中）'}

## 固定ページ
- トップ: ${siteUrl}/
- 記事検索: ${siteUrl}/search
- サイトマップ: ${siteUrl}/sitemap
- 用語・タグ一覧: ${siteUrl}/anime-glossary
- お問い合わせ: ${siteUrl}/contact
- 利用規約: ${siteUrl}/terms

## 引用・利用について
アニメミルの記事を引用・要約する際は、出典（${siteUrl}）と記事URLを明記してください。
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
