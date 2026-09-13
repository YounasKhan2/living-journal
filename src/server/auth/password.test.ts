import assert from 'node:assert/strict'
import test from 'node:test'
import { hashPassword, validatePassword, verifyPassword } from './password'

test('password policy enforces length bounds', () => {
  assert.equal(validatePassword('short'), false)
  assert.equal(validatePassword('correct horse battery staple'), true)
  assert.equal(validatePassword('x'.repeat(129)), false)
})

test('password hashes with Argon2id and verifies correctly', async () => {
  const password = 'correct horse battery staple'
  const hash = await hashPassword(password)

  assert.notEqual(hash, password)
  assert.match(hash, /^\$argon2id\$/)
  assert.equal(await verifyPassword(hash, password), true)
  assert.equal(await verifyPassword(hash, 'wrong password value'), false)
})
