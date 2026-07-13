import type { Metadata } from 'next'

import { ContactForm } from '@/components/animemiru/ContactForm'
import { StaticPageLayout } from '@/components/animemiru/StaticPageLayout'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { generateStaticPageMeta } from '@/utilities/generateStaticPageMeta'

export const metadata: Metadata = generateStaticPageMeta(
  'お問い合わせ',
  '/contact',
  'アニメミルへのお問い合わせ・広告掲載のご相談はこちらから。',
)

export default async function ContactPage() {
  const popularPosts = await fetchPopularPosts()

  return (
    <StaticPageLayout
      author={false}
      path="/contact"
      popularPosts={popularPosts}
      title="お問い合わせ"
    >
      <p>
        アニメミルに関するお問い合わせ、広告掲載等のご相談は以下のお問い合わせフォームからお願いします。
      </p>
      <h2>お問い合わせ</h2>
      <ContactForm />
    </StaticPageLayout>
  )
}
