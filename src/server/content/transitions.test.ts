import assert from 'node:assert/strict'
import test from 'node:test'
import { canTransitionPost } from './transitions'

test('editorial lifecycle permits intended transitions', () => {
  assert.equal(canTransitionPost('DRAFT', 'IN_REVIEW'), true)
  assert.equal(canTransitionPost('IN_REVIEW', 'PUBLISHED'), true)
  assert.equal(canTransitionPost('IN_REVIEW', 'SCHEDULED'), true)
  assert.equal(canTransitionPost('SCHEDULED', 'PUBLISHED'), true)
  assert.equal(canTransitionPost('PUBLISHED', 'ARCHIVED'), true)
  assert.equal(canTransitionPost('ARCHIVED', 'DRAFT'), true)
})

test('editorial lifecycle rejects bypasses', () => {
  assert.equal(canTransitionPost('DRAFT', 'PUBLISHED'), false)
  assert.equal(canTransitionPost('DRAFT', 'ARCHIVED'), false)
  assert.equal(canTransitionPost('PUBLISHED', 'DRAFT'), false)
  assert.equal(canTransitionPost('ARCHIVED', 'PUBLISHED'), false)
})
