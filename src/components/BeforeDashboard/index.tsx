import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>アニメミル 管理画面</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <strong>記事の作成・編集:</strong>{' '}
          <a href="/admin/collections/posts">記事一覧</a>
          {' → 右上「新規作成」'}
        </li>
        <li>
          保存だけではサイトに出ません。<strong>「公開」（Publish）</strong>を押してください。
        </li>
        <li>
          一覧に記事がない場合（開発環境）:
          <a href="/next/seed-demo" rel="noopener noreferrer" target="_blank">
            デモ記事を投入
          </a>
          （3件）または
          <a href="/next/migrate-wp?limit=10" rel="noopener noreferrer" target="_blank">
            WPから10件移行
          </a>
        </li>
        <li>
          開発サーバーのURLを確認してください（複数起動時はポートが異なります）。
          <a href="/next/status" rel="noopener noreferrer" target="_blank">
            記事数を確認
          </a>
        </li>
        <li>
          <a href="/" rel="noopener noreferrer" target="_blank">
            サイトを表示
          </a>
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
