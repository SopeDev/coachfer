#!/usr/bin/env node
/**
 * Merges DATABASE_URL (and related Neon vars) from `.env.vercel`
 * into `.env` so local and Vercel share the same hosted database.
 * Keeps other local secrets (NEXTAUTH_SECRET, SMTP, etc.) intact.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const vercelEnvPath = path.join(root, '.env.vercel')
const localEnvPath = path.join(root, '.env')

const KEYS_TO_SYNC = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_USER',
  'POSTGRES_HOST',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'PGHOST',
  'PGHOST_UNPOOLED',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
  'NEON_PROJECT_ID'
]

const parseEnv = (raw) => {
  const map = new Map()
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    map.set(key, value)
  }
  return map
}

const serializeValue = (value) => {
  if (/[\s#"']/.test(value)) return `"${value.replace(/"/g, '\\"')}"`
  return value
}

if (!fs.existsSync(vercelEnvPath)) {
  console.error('Missing .env.vercel — run: npx vercel env pull .env.vercel --yes')
  process.exit(1)
}

const vercelVars = parseEnv(fs.readFileSync(vercelEnvPath, 'utf8'))
let localRaw = fs.existsSync(localEnvPath)
  ? fs.readFileSync(localEnvPath, 'utf8')
  : fs.readFileSync(path.join(root, '.env.example'), 'utf8')

const localVars = parseEnv(localRaw)
let synced = 0

for (const key of KEYS_TO_SYNC) {
  if (!vercelVars.has(key)) continue
  const value = vercelVars.get(key)
  localVars.set(key, value)
  synced += 1

  const lineRe = new RegExp(`^${key}=.*$`, 'm')
  const line = `${key}=${serializeValue(value)}`
  if (lineRe.test(localRaw)) {
    localRaw = localRaw.replace(lineRe, line)
  } else {
    localRaw = `${localRaw.trimEnd()}\n${line}\n`
  }
}

if (!localVars.get('DATABASE_URL') && localVars.get('POSTGRES_PRISMA_URL')) {
  const value = localVars.get('POSTGRES_PRISMA_URL')
  localVars.set('DATABASE_URL', value)
  const line = `DATABASE_URL=${serializeValue(value)}`
  if (/^DATABASE_URL=/m.test(localRaw)) {
    localRaw = localRaw.replace(/^DATABASE_URL=.*$/m, line)
  } else {
    localRaw = `${localRaw.trimEnd()}\n${line}\n`
  }
  synced += 1
}

if (!localVars.get('DATABASE_URL') && localVars.get('POSTGRES_URL')) {
  const value = localVars.get('POSTGRES_URL')
  localRaw = localRaw.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${serializeValue(value)}`)
  if (!/^DATABASE_URL=/m.test(localRaw)) {
    localRaw = `${localRaw.trimEnd()}\nDATABASE_URL=${serializeValue(value)}\n`
  }
  synced += 1
}

fs.writeFileSync(localEnvPath, localRaw.endsWith('\n') ? localRaw : `${localRaw}\n`)

if (!synced) {
  console.error('No database URL found in .env.vercel. Is Neon connected to the project?')
  process.exit(1)
}

console.log(`Synced ${synced} DB env var(s) from Vercel → .env`)
console.log('Local and Vercel now share the same hosted database URL.')
