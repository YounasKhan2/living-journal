import assert from 'node:assert/strict'
import test from 'node:test'
import { formatCategorySlug, slugify } from './format'

test('slugify normalizes spaces and punctuation', () => {
  assert.equal(slugify('  AI & Future Tech!  '), 'ai-future-tech')
})

test('slugify trims repeated separators from the edges', () => {
  assert.equal(slugify('---React Server Components---'), 'react-server-components')
})

test('formatCategorySlug uses the canonical slug formatter', () => {
  assert.equal(formatCategorySlug('Products & Tools'), 'products-tools')
})
