export function hasStraight(arr, length) {
  let count = 1

  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] === arr[i - 1] + 1) {
      count += 1
      if (count >= length) return true
    } else {
      count = 1
    }
  }

  return false
}

export function calculateCategoryScore(category, dice) {
  const counts = {}
  for (const value of dice) {
    counts[value] = (counts[value] || 0) + 1
  }

  const values = Object.values(counts)
  const sum = dice.reduce((a, b) => a + b, 0)
  const unique = [...new Set(dice)].sort((a, b) => a - b)

  switch (category) {
    case 'ones':
    case 'twos':
    case 'threes':
    case 'fours':
    case 'fives':
    case 'sixes': {
      const face = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(category) + 1
      return dice.filter((d) => d === face).reduce((acc, current) => acc + current, 0)
    }
    case 'threeKind':
      return values.includes(3) ? sum : 0
    case 'fourKind':
      return values.includes(4) ? sum : 0
    case 'fullHouse':
      return values.includes(3) && values.includes(2) ? 25 : 0
    case 'smallStraight':
      return hasStraight(unique, 4) ? 30 : 0
    case 'largeStraight':
      return hasStraight(unique, 5) ? 40 : 0
    case 'yacht':
      return values.includes(5) ? 50 : 0
    case 'chance':
      return sum
    default:
      return 0
  }
}

export function getTotalScore(categories) {
  return Object.values(categories).reduce((sum, value) => sum + (value || 0), 0)
}
