import { generateArticleSummary } from '@/lib/articleSeo'

type Props = {
  excerpt?: string | null
  title?: string | null
}

export function ArticleSummary({ excerpt, title }: Props) {
  const items = generateArticleSummary({ title, excerpt })
  if (items.length === 0) return null

  return (
    <div className="article-summary-box">
      <p className="article-summary-heading">この記事でわかること</p>
      <ul className="article-summary-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
