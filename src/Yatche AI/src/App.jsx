import { useMemo, useState } from 'react'
import './App.css'

const CATEGORY_ROWS = [
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
  ['Yatche', 'yatche'],
  ['Chance', 'chance'],
]

function getInitialCategories() {
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
    yatche: null,
    chance: null,
  }
}

function hasStraight(arr, length) {
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

function DiceBoard({ dice, held, rollsLeft, onToggleHold, onRoll }) {
  return (
    <div id="dice-container">
      {dice.map((value, index) => (
        <div
          key={index}
          className={`dice${held[index] ? ' held' : ''}`}
          onClick={() => onToggleHold(index)}
        >
          {rollsLeft < 3 ? value : '?'}
        </div>
      ))}
      <div className="roll-btn" onClick={onRoll} title="Roll dice">
        🎲
      </div>
    </div>
  )
}

function ScoreTable({ categories, totalScore, onScoreCategory }) {
  return (
    <div id="scoreboard">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_ROWS.map(([label, key]) => {
            const value = categories[key]
            const used = value !== null

            return (
              <tr
                key={key}
                className={used ? 'used' : 'category'}
                onClick={() => onScoreCategory(key)}
              >
                <td>{label}</td>
                <td>{used ? value : '-'}</td>
              </tr>
            )
          })}
          <tr>
            <th>Total</th>
            <th>{totalScore}</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [dice, setDice] = useState([1, 1, 1, 1, 1])
  const [held, setHeld] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(3)
  const [categories, setCategories] = useState(getInitialCategories)

  const totalScore = useMemo(
    () => Object.values(categories).reduce((sum, value) => sum + (value || 0), 0),
    [categories],
  )

  function toggleHold(index) {
    if (rollsLeft === 3) return

    setHeld((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  function rollDice() {
    if (rollsLeft === 0) return

    setDice((prevDice) =>
      prevDice.map((value, index) =>
        held[index] ? value : Math.floor(Math.random() * 6) + 1,
      ),
    )
    setRollsLeft((prev) => prev - 1)
  }

  function scoreCategory(category) {
    if (categories[category] !== null) return

    const counts = {}
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1
    }

    const values = Object.values(counts)
    const sum = dice.reduce((a, b) => a + b, 0)
    const unique = [...new Set(dice)].sort((a, b) => a - b)

    let score = 0
    switch (category) {
      case 'ones':
      case 'twos':
      case 'threes':
      case 'fours':
      case 'fives':
      case 'sixes': {
        const face = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(category) + 1
        score = dice
          .filter((d) => d === face)
          .reduce((acc, current) => acc + current, 0)
        break
      }
      case 'threeKind':
        score = values.includes(3) ? sum : 0
        break
      case 'fourKind':
        score = values.includes(4) ? sum : 0
        break
      case 'fullHouse':
        score = values.includes(3) && values.includes(2) ? 25 : 0
        break
      case 'smallStraight':
        score = hasStraight(unique, 4) ? 30 : 0
        break
      case 'largeStraight':
        score = hasStraight(unique, 5) ? 40 : 0
        break
      case 'yatche':
        score = values.includes(5) ? 50 : 0
        break
      case 'chance':
        score = sum
        break
      default:
        break
    }

    const nextCategories = { ...categories, [category]: score }
    setCategories(nextCategories)
    setRollsLeft(3)
    setHeld([false, false, false, false, false])

    const finished = Object.values(nextCategories).every((value) => value !== null)
    if (finished) {
      const finalScore = Object.values(nextCategories).reduce((acc, value) => acc + (value || 0), 0)
      window.alert(`Game Over! Final Score: ${finalScore}`)
    }
  }

  return (
    <>
      <DiceBoard
        dice={dice}
        held={held}
        rollsLeft={rollsLeft}
        onToggleHold={toggleHold}
        onRoll={rollDice}
      />
      <ScoreTable
        categories={categories}
        totalScore={totalScore}
        onScoreCategory={scoreCategory}
      />
    </>
  )
}

export default App
