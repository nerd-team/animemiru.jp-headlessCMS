import Link from 'next/link'

import { POPULAR_TAGS } from '@/lib/popularTags'

const SITE_NAME = '\u30a2\u30cb\u30e1\u30df\u30eb'
const SITE_TAGLINE = '\u30a2\u30cb\u30e1\u597d\u304d\u306e\u30a8\u30f3\u30bf\u30e1\u30de\u30ac\u30b8\u30f3'

const FOOTER_SNS = [
  {
    href: 'https://www.youtube.com/@-animemiru2785/shorts',
    label: 'YouTube',
    className: 'youtube',
  },
  {
    href: 'https://twitter.com/animemiru_media',
    label: 'Twitter',
    className: 'twitter',
  },
  {
    href: 'http://facebook.com/animemiru',
    label: 'Facebook',
    className: 'facebook',
  },
  {
    href: 'https://www.instagram.com/animemiru/',
    label: 'Instagram',
    className: 'instagram',
  },
] as const

export function AnimemiruFooter() {
  return (
    <div className="site-footer-block">
      <div className="footermenubox">
        <div className="footermenubox-in clearfix">
          <div className="footermenu">
            <ul>
              {FOOTER_SNS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} rel="nofollow noopener noreferrer" target="_blank">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer>
        <div id="footer">
          <div id="footer-in">
            <div className="footer-wbox clearfix">
              <div className="footer-l">
                <h3 className="footerlogo">{SITE_NAME}</h3>
                <p>
                  <Link href="/">{SITE_TAGLINE}</Link>
                </p>
              </div>
              <div className="footer-r">
                <div id="footer-links">
                  <ul>
                    <li>
                      <Link href="/sitemap">サイトマップ</Link>
                    </li>
                    <li>
                      <Link href="/terms">利用規約</Link>
                    </li>
                    <li>
                      <Link href="/contact">お問い合わせ</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="ad">
              <p className="st-widgets-title">
                <span>人気のキーワード</span>
              </p>
              <div className="tagcloud">
                {POPULAR_TAGS.map((tag) => (
                  <Link href={`/search?s=${encodeURIComponent(tag)}`} key={tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <p className="copyr">
        Copyright&copy; {SITE_NAME} , {new Date().getFullYear()} All Rights Reserved.
      </p>
    </div>
  )
}
