import Link from 'next/link'

const SITE_NAME = '\u30a2\u30cb\u30e1\u30df\u30eb'
const SITE_TAGLINE = '\u30a2\u30cb\u30e1\u597d\u304d\u306e\u30a8\u30f3\u30bf\u30e1\u30de\u30ac\u30b8\u30f3'

export function AnimemiruHeader() {
  return (
    <div id="headbox-bg">
      <div className="clearfix" id="headbox">
        <div id="header-l">
          <p className="sitename sitenametop">
            <Link href="/">
              <img alt={SITE_NAME} src="/theme/images/logo.png" />
            </Link>
          </p>
          <h1 className="descr">{SITE_TAGLINE}</h1>
        </div>
        <div className="smanone" id="header-r" />
      </div>
    </div>
  )
}
