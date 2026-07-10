import Link from 'next/link'

import {
  YOUTUBE_SHORTS_CHANNEL_URL,
  fetchYoutubeShortIds,
} from '@/lib/youtubeShorts'

export async function YouTubeShortsWidget() {
  const videoIds = await fetchYoutubeShortIds(6)

  return (
    <div className="ad youtube-shorts-widget">
      <p className="st-widgets-title">
        <span>ショート動画</span>
      </p>
      <div className="youtube-shorts-list">
        {videoIds.map((id) => (
          <div className="youtube-short-item" key={id}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              src={`https://www.youtube.com/embed/${id}`}
              title="アニメミル ショート動画"
            />
          </div>
        ))}
      </div>
      <p className="youtube-shorts-more">
        <Link
          className="youtube-shorts-more-btn"
          href={YOUTUBE_SHORTS_CHANNEL_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          もっと見る
        </Link>
      </p>
    </div>
  )
}
