import assert from 'node:assert/strict'
import test from 'node:test'
import { hasCapability } from './permissions'

test('ADMIN has publication administration capabilities', () => {
  assert.equal(hasCapability('ADMIN', 'cms:read'), true)
  assert.equal(hasCapability('ADMIN', 'settings:manage'), true)
  assert.equal(hasCapability('ADMIN', 'users:manage'), true)
})

test('EDITOR is limited to editorial capabilities', () => {
  assert.equal(hasCapability('EDITOR', 'cms:read'), true)
  assert.equal(hasCapability('EDITOR', 'content:write'), true)
  assert.equal(hasCapability('EDITOR', 'content:publish'), true)
  assert.equal(hasCapability('EDITOR', 'settings:manage'), false)
  assert.equal(hasCapability('EDITOR', 'users:manage'), false)
  assert.equal(hasCapability('EDITOR', 'monetization:manage'), false)
})
