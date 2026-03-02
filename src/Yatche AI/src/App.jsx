import { useMemo, useState } from 'react'
import './App.css'
import DiceBoard from './components/DiceBoard'
import ScoreTable from './components/ScoreTable'
import { getInitialCategories } from './constants/categories'
import { calculateCategoryScore, getTotalScore } from './utils/scoring'

function App() {
  const [dice, setDice] = useState([1, 1, 1, 1, 1])
  const [held, setHeld] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(3)
  const [categories, setCategories] = useState(getInitialCategories)

  const totalScore = useMemo(() => getTotalScore(categories), [categories])

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

  function scoreCategory(categoryKey) {
    if (categories[categoryKey] !== null) return

    const score = calculateCategoryScore(categoryKey, dice)
    const nextCategories = { ...categories, [categoryKey]: score }

    setCategories(nextCategories)
    setRollsLeft(3)
    setHeld([false, false, false, false, false])

    const finished = Object.values(nextCategories).every((value) => value !== null)
    if (finished) {
      window.alert(`Game Over! Final Score: ${getTotalScore(nextCategories)}`)
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
