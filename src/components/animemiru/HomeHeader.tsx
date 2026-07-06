import type { Post } from '@/payload-types'

import { AnimemiruHeader } from '@/components/animemiru/Header'
import { HeaderSlider } from '@/components/animemiru/HeaderSlider'

type Props = {
  posts: Post[]
  showSlider?: boolean
}

export function AnimemiruHomeHeader({ posts, showSlider = true }: Props) {
  return (
    <header id="">
      <AnimemiruHeader />
      {showSlider && <HeaderSlider posts={posts} />}
    </header>
  )
}
