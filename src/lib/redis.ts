import { Redis } from '@upstash/redis'

const redisKey = process.env.REDIS_KEY

if (!redisKey) {
  throw new Error('REDIS_KEY is not set')
}

export const redis = new Redis({
  url: 'https://handy-glowworm-35549.upstash.io',
  token: redisKey,
})

