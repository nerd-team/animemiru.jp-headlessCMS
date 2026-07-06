export type DemoPost = {
  wpId: number
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category: { title: string; slug: string }
  body: string
}

export const DEMO_POSTS: DemoPost[] = [
  {
    wpId: 149407,
    slug: 'post-149407',
    title: '【正反対な君と僕】登場 キャラ 人気ランキングTOP9',
    excerpt:
      'TVアニメ「正反対な君と僕」に登場するキャラクターの人気ランキングTOP9を紹介します。鈴木みゆや谷悠介をはじめとした魅力的な登場人物たちを、公式投票や原作での活躍をもとに順位付けしました。',
    publishedAt: '2026-03-06T14:04:52',
    category: { title: '正反対な君と僕', slug: 'hantai-kimi-to-boku' },
    body: 'TVアニメ「正反対な君と僕」キャラクター人気ランキングのデモ記事です。',
  },
  {
    wpId: 149400,
    slug: 'post-149400',
    title:
      '【聖女なのに国を追い出されたので、崩壊寸前の隣国へ来ました シーズン2】登場 キャラ 人気ランキングTOP9',
    excerpt:
      '「聖女なのに国を追い出されたので、崩壊寸前の隣国へ来ました シーズン2」に登場するキャラクターたちの魅力を、人気ランキング形式で徹底紹介します。',
    publishedAt: '2026-03-05T14:05:23',
    category: {
      title: '聖女なのに国を追い出されたので、崩壊寸前の隣国へ来ました シーズン2',
      slug: 'seijo-s2',
    },
    body: '聖女なのに国を追い出されたので、崩壊寸前の隣国へ来ました シーズン2のデモ記事です。',
  },
  {
    wpId: 149393,
    slug: 'post-149393',
    title: '【人外教室の人間嫌い教師】登場 キャラ 人気ランキングTOP9',
    excerpt:
      '『人外教室の人間嫌い教師』は、人間嫌いの教師・人間零が人外たちが通う学校で教師として働く物語です。魅力的なキャラクターたちの人気ランキングを紹介します。',
    publishedAt: '2026-03-04T14:06:51',
    category: { title: '人外教室の人間嫌い教師', slug: 'jingai-kyoshitsu' },
    body: '人外教室の人間嫌い教師キャラクター人気ランキングのデモ記事です。',
  },
]
