import type { CollectionBeforeChangeHook } from 'payload'

/** 保存時に更新日時を自動設定 */
export const setModifiedAt: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    return {
      ...data,
      modifiedAt: new Date().toISOString(),
    }
  }
  return data
}
