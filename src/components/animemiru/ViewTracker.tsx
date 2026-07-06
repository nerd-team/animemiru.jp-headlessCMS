'use client'

import { useEffect } from 'react'

type Props = {
  postId: string
}

export function ViewTracker({ postId }: Props) {
  useEffect(() => {
    fetch('/next/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {})
  }, [postId])

  return null
}
