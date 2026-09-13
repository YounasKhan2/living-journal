import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.systemSetting.upsert({
    where: { key: 'foundation.status' },
    update: {
      value: {
        phase: '0D',
        status: 'ready',
      },
    },
    create: {
      key: 'foundation.status',
      value: {
        phase: '0D',
        status: 'ready',
      },
    },
  })

  console.log('Seeded Phase 0 foundation setting.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
