export const CATEGORY_ROWS = [
  ['Ones', 'ones'],
  ['Twos', 'twos'],
  ['Threes', 'threes'],
  ['Fours', 'fours'],
  ['Fives', 'fives'],
  ['Sixes', 'sixes'],
  ['Three of a Kind', 'threeKind'],
  ['Four of a Kind', 'fourKind'],
  ['Full House', 'fullHouse'],
  ['Small Straight', 'smallStraight'],
  ['Large Straight', 'largeStraight'],
  ['Yacht', 'yacht'],
  ['Chance', 'chance'],
]

export function getInitialCategories() {
  return {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeKind: null,
    fourKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yacht: null,
    chance: null,
  }
}
