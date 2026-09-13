import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { PrismaClient } from '../src/generated/prisma/client'
import { hashPassword, validatePassword } from '../src/server/auth/password'
import { parseNormalizedEmail } from '../src/server/auth/identity'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required to create an editor')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

function promptHidden(label: string) {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Editor creation requires an interactive TTY so the password can be entered securely.')
  }

  output.write(label)
  input.setRawMode(true)
  input.resume()
  input.setEncoding('utf8')

  return new Promise<string>((resolve, reject) => {
    let value = ''
    const cleanup = () => {
      input.off('data', onData)
      input.setRawMode(false)
      input.pause()
    }
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\u0003') {
          cleanup()
          output.write('\n')
          reject(new Error('Editor creation cancelled.'))
          return
        }
        if (char === '\r' || char === '\n') {
          cleanup()
          output.write('\n')
          resolve(value)
          return
        }
        if (char === '\u007f' || char === '\b') {
          value = value.slice(0, -1)
          continue
        }
        if (char >= ' ') value += char
      }
    }
    input.on('data', onData)
  })
}

async function main() {
  await prisma.$queryRaw`SELECT 1`

  const rl = createInterface({ input, output })
  const emailInput = await rl.question('Editor email: ')
  const name = (await rl.question('Editor name: ')).trim()
  rl.close()

  if (!name || name.length > 120) throw new Error('Editor name must be between 1 and 120 characters.')
  const email = parseNormalizedEmail(emailInput)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error(`A user already exists for ${email}. Editor creation refuses to overwrite existing accounts.`)

  const password = await promptHidden('Editor password: ')
  if (!validatePassword(password)) throw new Error('Password must be between 12 and 128 characters.')

  const confirmation = await promptHidden('Confirm password: ')
  if (password !== confirmation) throw new Error('Passwords do not match.')

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'EDITOR',
      status: 'ACTIVE',
    },
    select: { email: true, role: true },
  })

  console.log(`Created ${user.role} account for ${user.email}.`)
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
