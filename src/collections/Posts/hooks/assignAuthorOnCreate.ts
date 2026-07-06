import type { CollectionBeforeChangeHook } from 'payload'

/** 新規作成時、ログインユーザーを執筆者に自動設定 */
export const assignAuthorOnCreate: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && req.user) {
    const authors = data.authors
    if (!authors || (Array.isArray(authors) && authors.length === 0)) {
      return { ...data, authors: [req.user.id] }
    }
  }
  return data
}
