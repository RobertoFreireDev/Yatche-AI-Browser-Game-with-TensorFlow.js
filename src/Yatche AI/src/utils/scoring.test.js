import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateCategoryScore } from './scoring.js'

test('calculateCategoryScore: ones to sixes', () => {
  assert.equal(calculateCategoryScore('ones', [1, 2, 1, 4, 6]), 2)
  assert.equal(calculateCategoryScore('twos', [2, 2, 3, 4, 5]), 4)
  assert.equal(calculateCategoryScore('threes', [3, 3, 3, 1, 2]), 9)
  assert.equal(calculateCategoryScore('fours', [4, 2, 4, 1, 6]), 8)
  assert.equal(calculateCategoryScore('fives', [5, 5, 1, 2, 3]), 10)
  assert.equal(calculateCategoryScore('sixes', [6, 6, 6, 1, 2]), 18)
  assert.equal(calculateCategoryScore('sixes', [1, 2, 3, 4, 5]), 0)
})

test('calculateCategoryScore: threeKind', () => {
  assert.equal(calculateCategoryScore('threeKind', [2, 2, 2, 4, 5]), 15)
  assert.equal(calculateCategoryScore('threeKind', [3, 3, 3, 3, 1]), 13)
  assert.equal(calculateCategoryScore('threeKind', [6, 6, 6, 6, 6]), 30)
  assert.equal(calculateCategoryScore('threeKind', [1, 2, 3, 4, 5]), 0)
  assert.equal(calculateCategoryScore('threeKind', [2, 2, 3, 4, 5]), 0)
})

test('calculateCategoryScore: fourKind', () => {
  assert.equal(calculateCategoryScore('fourKind', [4, 4, 4, 4, 2]), 18)
  assert.equal(calculateCategoryScore('fourKind', [5, 5, 5, 5, 5]), 25)
  assert.equal(calculateCategoryScore('fourKind', [1, 2, 3, 4, 5]), 0)
  assert.equal(calculateCategoryScore('fourKind', [1, 1, 2, 2, 3]), 0)
  assert.equal(calculateCategoryScore('fourKind', [1, 1, 1, 2, 3]), 0)
})

test('calculateCategoryScore: fullHouse', () => {
  assert.equal(calculateCategoryScore('fullHouse', [2, 2, 2, 5, 5]), 25)
  assert.equal(calculateCategoryScore('fullHouse', [3, 3, 3, 3, 1]), 0)
  assert.equal(calculateCategoryScore('fullHouse', [6, 6, 6, 6, 6]), 0)
  assert.equal(calculateCategoryScore('fullHouse', [3, 3, 4, 4, 1]), 0)
})

test('calculateCategoryScore: smallStraight', () => {
  assert.equal(calculateCategoryScore('smallStraight', [1, 2, 3, 4, 6]), 30)
  assert.equal(calculateCategoryScore('smallStraight', [1, 2, 3, 4, 5]), 30)
  assert.equal(calculateCategoryScore('smallStraight', [1, 1, 3, 4, 6]), 0)
})

test('calculateCategoryScore: largeStraight', () => {
  assert.equal(calculateCategoryScore('largeStraight', [1, 2, 3, 4, 5]), 40)
  assert.equal(calculateCategoryScore('largeStraight', [2, 3, 4, 5, 6]), 40)
  assert.equal(calculateCategoryScore('largeStraight', [1, 2, 3, 4, 6]), 0)
})

test('calculateCategoryScore: yacht', () => {
  assert.equal(calculateCategoryScore('yacht', [5, 5, 5, 5, 5]), 50)
  assert.equal(calculateCategoryScore('yacht', [5, 5, 5, 5, 4]), 0)
})

test('calculateCategoryScore: chance', () => {
  assert.equal(calculateCategoryScore('chance', [1, 3, 3, 5, 6]), 18)
})
