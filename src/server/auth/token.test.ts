import assert from 'node:assert/strict'
import test from 'node:test'
import { generateSessionToken, hashSessionToken, sessionExpiryFromNow } from './token'

test('session token is random and hashes deterministically', () => {
  const first = generateSessionToken()
  const second = generateSessionToken()

  assert.notEqual(first, second)
  assert.equal(hashSessionToken(first), hashSessionToken(first))
  assert.notEqual(hashSessionToken(first), first)
  assert.match(hashSessionToken(first), /^[a-f0-9]{64}$/)
})

test('session expiry uses centralized 24 hour policy', () => {
  const now = new Date('2026-09-13T12:00:00.000Z')
  assert.equal(sessionExpiryFromNow(now).toISOString(), '2026-09-14T12:00:00.000Z')
})
