/**
 * WordPress REST API から Payload CMS へ記事を移行
 *
 * 使い方:
 *   npm run migrate:wp
 *   npm run migrate:wp -- --limit=100 --page=1
 *   npm run migrate:wp -- --all
 *
 * 開発中は dev サーバー経由でも実行できます:
 *   http://localhost:3002/next/migrate-wp?limit=50&page=1
 */

import 'dotenv/config'
import net from 'node:net'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { migrateFromWordPress } from '../src/lib/wpMigrate.ts'

function parseArg(name: string, fallback: string) {
  const fromEnv = process.env[name]
  if (fromEnv) return fromEnv
  const dashed = name.toLowerCase().replace(/_/g, '-')
  const match = process.argv.find((arg) => arg.startsWith(`--${dashed}=`))
  return match?.split('=')[1] ?? fallback
}

function isPortOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port })
    socket.once('connect', () => {
      socket.end()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

async function main() {
  const migrateAll = process.argv.includes('--all')
  const limit = migrateAll ? 999999 : Number(parseArg('WP_MIGRATE_LIMIT', '50'))
  const startPage = Number(parseArg('WP_MIGRATE_PAGE', '1'))
  const downloadImages = !process.argv.includes('--no-images')
  const dryRun = process.argv.includes('--dry-run')

  if (!(await isPortOpen(27017))) {
    console.log('[migrate] Starting temporary MongoDB...')
    const memoryServer = await MongoMemoryServer.create()
    process.env.DATABASE_URL = memoryServer.getUri('animemiru')
    console.log(`[migrate] DATABASE_URL=${process.env.DATABASE_URL}`)
    console.log('[migrate] Note: dev server uses a separate DB unless MongoDB is running on port 27017')
  }

  console.log(`[migrate] WP_URL=${process.env.WP_URL || 'https://animemiru.jp'}`)
  console.log(`[migrate] limit=${limit} page=${startPage} images=${downloadImages} dryRun=${dryRun}`)

  let page = startPage
  let totalCreated = 0
  let totalSkipped = 0
  let totalFailed = 0
  let lastResult: Awaited<ReturnType<typeof migrateFromWordPress>> | undefined

  while (true) {
    const batchLimit = migrateAll ? 50 : limit - totalCreated - totalSkipped - totalFailed
    if (batchLimit <= 0) break

    lastResult = await migrateFromWordPress({
      limit: batchLimit,
      startPage: page,
      downloadImages,
      dryRun,
    })

    totalCreated += lastResult.created
    totalSkipped += lastResult.skipped
    totalFailed += lastResult.failed

    console.log(
      `[migrate] page=${page} created=${lastResult.created} skipped=${lastResult.skipped} failed=${lastResult.failed} categories=${lastResult.categories}`,
    )

    if (!lastResult.hasMore || dryRun) break
    if (!migrateAll && totalCreated + totalSkipped + totalFailed >= limit) break

    page = lastResult.nextPage
  }

  console.log('[migrate] Done')
  console.log(`  created: ${totalCreated}`)
  console.log(`  skipped: ${totalSkipped}`)
  console.log(`  failed: ${totalFailed}`)
  if (lastResult?.hasMore) {
    console.log(`  next page: ${lastResult.nextPage}`)
  }

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
