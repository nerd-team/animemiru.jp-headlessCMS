type Props = {
  className?: string
  title: string
  url: string
}

export function SnsShare({ className = 'sns st-sns-top', title, url }: Props) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className={className}>
      <ul className="clearfix">
        <li className="twitter">
          <a
            href={`//twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=animemiru&via=animemiru_media`}
            rel="nofollow"
            target="_blank"
          >
            <i className="fa fa-twitter" />
            <span className="snstext">Twitter</span>
          </a>
        </li>
        <li className="facebook">
          <a
            href={`//www.facebook.com/sharer.php?src=bm&u=${encodedUrl}&t=${encodedTitle}`}
            rel="nofollow"
            target="_blank"
          >
            <i className="fa fa-facebook" />
            <span className="snstext">Share</span>
          </a>
        </li>
        <li className="googleplus">
          <a href={`//plus.google.com/share?url=${encodedUrl}`} rel="nofollow" target="_blank">
            <i className="fa fa-google-plus" />
            <span className="snstext">Google+</span>
          </a>
        </li>
        <li className="pocket">
          <a
            href={`//getpocket.com/edit?url=${encodedUrl}&title=${encodedTitle}`}
            rel="nofollow"
            target="_blank"
          >
            <i className="fa fa-get-pocket" />
            <span className="snstext">Pocket</span>
          </a>
        </li>
        <li className="hatebu">
          <a href={`//b.hatena.ne.jp/entry/${url}`} rel="nofollow" target="_blank">
            <i className="fa st-svg-hateb" />
            <span className="snstext">Hatena</span>
          </a>
        </li>
        <li className="line">
          <a
            href={`//line.me/R/msg/text/?${encodedTitle}%0A${encodedUrl}`}
            rel="nofollow"
            target="_blank"
          >
            <i aria-hidden="true" className="fa fa-comment" />
            <span className="snstext">LINE</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
