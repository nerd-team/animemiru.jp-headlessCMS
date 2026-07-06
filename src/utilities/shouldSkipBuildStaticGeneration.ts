/** Docker ビルド時（MongoDB 未起動）は静的パス生成をスキップ */
export function shouldSkipBuildStaticGeneration(): boolean {
  return process.env.SKIP_BUILD_STATIC_GENERATION === 'true'
}
