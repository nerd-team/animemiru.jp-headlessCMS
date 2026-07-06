import { spawn } from 'node:child_process'
import net from 'node:net'
import { MongoMemoryServer } from 'mongodb-memory-server'

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port })
    socket.once('connect', () => {
      socket.end()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

const port = 27017
const mongoAlreadyRunning = await isPortOpen(port)

let memoryServer

if (!mongoAlreadyRunning) {
  console.log('[dev] Starting in-memory MongoDB...')
  memoryServer = await MongoMemoryServer.create()
  process.env.DATABASE_URL = memoryServer.getUri('animemiru')
  console.log(`[dev] DATABASE_URL=${process.env.DATABASE_URL}`)
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1/animemiru'
  console.log(`[dev] Using existing MongoDB at ${process.env.DATABASE_URL}`)
}

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
})

const shutdown = async () => {
  child.kill()
  if (memoryServer) await memoryServer.stop()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

child.on('exit', async (code) => {
  if (memoryServer) await memoryServer.stop()
  process.exit(code ?? 0)
})
