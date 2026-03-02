import { useMemo, useState } from 'react'
import DiceBoard from '../components/DiceBoard'
import ScoreTable from '../components/ScoreTable'
import { getInitialCategories } from '../constants/categories'
import { calculateCategoryScore, getTotalScore } from '../utils/scoring'

const MAX_ROLLS = 3

function TrainingTablePage() {
  const [dices, setDices] = useState([0, 0, 0, 0, 0])
  const [held, setHeld] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS)
  const [categories, setCategories] = useState(getInitialCategories)
  const [finalScore, setFinalScore] = useState(null)

  const totalScore = useMemo(() => getTotalScore(categories), [categories])

  function toggleHold(index) {
    if (rollsLeft === MAX_ROLLS) return

    setHeld((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  function resetGame() {
    setDices([0, 0, 0, 0, 0])
    setHeld([false, false, false, false, false])
    setRollsLeft(MAX_ROLLS)
    setCategories(getInitialCategories())
    setFinalScore(null)
  }

  function rollDice() {
    if (finalScore !== null)
    {
      resetGame();
    }

    if (rollsLeft === 0) return

    setDices((prevDice) =>
      prevDice.map((value, index) =>
        held[index] ? value : Math.floor(Math.random() * 6) + 1,
      ),
    )
    setRollsLeft((prev) => prev - 1)
  }

  function scoreCategory(categoryKey) {
    if (MAX_ROLLS === rollsLeft) return

    if (categories[categoryKey] !== null) return

    const score = calculateCategoryScore(categoryKey, dices)
    const nextCategories = { ...categories, [categoryKey]: score }

    setCategories(nextCategories)
    setRollsLeft(MAX_ROLLS)
    setHeld([false, false, false, false, false])

    const finished = Object.values(nextCategories).every((value) => value !== null)
    if (finished) {
      setFinalScore(getTotalScore(nextCategories))
    }
  }

  return (
    <>
      <DiceBoard
        dice={dices}
        held={held}
        rollsLeft={rollsLeft}
        onToggleHold={toggleHold}
        onRoll={rollDice}
      />
      <ScoreTable
        rollsLeft={rollsLeft}
        categories={categories}
        totalScore={totalScore}
        onScoreCategory={scoreCategory}
      />
      {finalScore !== null && (
        <div className="final-score-banner" role="status" aria-live="polite">
          <span className="final-score-chip">♠</span>
          <span>Game Over</span>
          <span className="final-score-value">Final Score: {finalScore}</span>
          <span className="final-score-chip">♣</span>
        </div>
      )}
    </>
  )
}

export default TrainingTablePage
