import assert from 'node:assert/strict'
import test from 'node:test'
import { safeReturnTo } from './redirects'

test('safeReturnTo accepts local admin paths', () => {
  assert.equal(safeReturnTo('/admin'), '/admin')
  assert.equal(safeReturnTo('/admin/posts'), '/admin/posts')
  assert.equal(safeReturnTo('/admin/posts/123/edit?tab=seo#top'), '/admin/posts/123/edit?tab=seo#top')
})

test('safeReturnTo rejects external and traversal paths', () => {
  assert.equal(safeReturnTo('https://evil.example'), '/admin')
  assert.equal(safeReturnTo('//evil.example'), '/admin')
  assert.equal(safeReturnTo('javascript:alert(1)'), '/admin')
  assert.equal(safeReturnTo('/admin/../external'), '/admin')
  assert.equal(safeReturnTo('/about'), '/admin')
})
