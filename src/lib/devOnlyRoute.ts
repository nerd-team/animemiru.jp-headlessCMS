/** 開発専用ルートの本番ガード */
export function isDevOnlyRouteAllowed(): boolean {
  return process.env.NODE_ENV !== 'production'
}
