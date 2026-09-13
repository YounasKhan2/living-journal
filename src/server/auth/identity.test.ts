import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeEmail, parseNormalizedEmail } from './identity'

test('email identifiers are trimmed and normalized', () => {
  assert.equal(normalizeEmail('  Editor@Example.COM  '), 'editor@example.com')
  assert.equal(parseNormalizedEmail('  Editor@Example.COM  '), 'editor@example.com')
})

test('invalid email identifiers are rejected', () => {
  assert.throws(() => parseNormalizedEmail('not-an-email'))
})
