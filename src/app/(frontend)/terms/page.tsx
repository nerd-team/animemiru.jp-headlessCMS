import type { Metadata } from 'next'

import { StaticPageLayout } from '@/components/animemiru/StaticPageLayout'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { fetchWpPageHtml } from '@/lib/fetchWpPageHtml'
import { generateStaticPageMeta } from '@/utilities/generateStaticPageMeta'

export const metadata: Metadata = generateStaticPageMeta(
  '利用規約',
  '/terms',
  'アニメミルの利用規約・免責事項・プライバシーポリシーです。',
)

export default async function TermsPage() {
  const [page, popularPosts] = await Promise.all([
    fetchWpPageHtml('policy'),
    fetchPopularPosts(),
  ])

  return (
    <StaticPageLayout
      path="/terms"
      popularPosts={popularPosts}
      title={page?.title || '利用規約'}
      updatedAt={page?.updatedAt}
    >
      {page?.html ? (
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      ) : (
        <p>利用規約を読み込めませんでした。しばらくしてから再度お試しください。</p>
      )}
    </StaticPageLayout>
  )
}
