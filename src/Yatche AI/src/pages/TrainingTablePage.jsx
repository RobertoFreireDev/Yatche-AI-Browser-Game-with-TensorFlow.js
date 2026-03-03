import { useMemo, useRef, useState } from 'react'
import DiceBoard from '../components/DiceBoard'
import ScoreTable from '../components/ScoreTable'
import { CATEGORY_ROWS, getInitialCategories } from '../constants/categories'
import tensorflowService from '../services/tensorflowService'
import { calculateCategoryScore, getTotalScore } from '../utils/scoring'

const MAX_ROLLS = 3

function TrainingTablePage() {
  const [dices, setDices] = useState([0, 0, 0, 0, 0])
  const [held, setHeld] = useState([false, false, false, false, false])
  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS)
  const [categories, setCategories] = useState(getInitialCategories)
  const [finalScore, setFinalScore] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [predictionError, setPredictionError] = useState('')
  const [isPredicting, setIsPredicting] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [feedbackCategoryKey, setFeedbackCategoryKey] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [trainingMessage, setTrainingMessage] = useState('')
  const [storageMessage, setStorageMessage] = useState('')
  const [storageMessageType, setStorageMessageType] = useState('info')
  const importInputRef = useRef(null)
  const categoryKeys = useMemo(() => Object.keys(getInitialCategories()), [])
  const categoryLabelsByKey = useMemo(
    () => Object.fromEntries(CATEGORY_ROWS.map(([label, key]) => [key, label])),
    [],
  )

  const totalScore = useMemo(() => getTotalScore(categories), [categories])

  function mapChosenCategoryFlags(categoryValues) {
    return categoryKeys.map((key) => (categoryValues[key] !== null ? 0 : 1))
  }

  function buildModelInput() {
    return [
      ...dices,
      ...mapChosenCategoryFlags(categories),
    ]
  }

  function normalizeInput(input) {
    return input.map((value, index) => {
      if (index < 5) return value / 6
      return Math.max(0, Math.min(1, value))
    })
  }

  function pushPendingSample(normalizedOutput) {
    const normalizedInput = normalizeInput(buildModelInput())
    tensorflowService.addPendingSample({
      input: normalizedInput,
      output: normalizedOutput,
    })
  }

  function addSuggestionFeedbackSample() {
    const selectedCategoryKey = feedbackCategoryKey
    if (!selectedCategoryKey || categories[selectedCategoryKey] !== null) {
      setFeedbackMessage('Please select an available category.')
      return
    }

    pushPendingSample([...categoryKeys.map((key) => (key === selectedCategoryKey ? 1 : 0))])
    setFeedbackMessage(`Added sample for ${categoryLabelsByKey[selectedCategoryKey]}.`)
    setShowPrediction(false)
  }

  async function showModelSuggestion() {
    setIsPredicting(true)
    setPredictionError('')
    setFeedbackCategoryKey('')
    setFeedbackMessage('')

    try {
      const normalizedInput = normalizeInput(buildModelInput())
      const result = await tensorflowService.predict(normalizedInput)
      setPrediction(result)
      setShowPrediction(true)
    } catch (error) {
      setPrediction(null)
      setShowPrediction(true)
      setPredictionError(error instanceof Error ? error.message : 'Could not get suggestion.')
    } finally {
      setIsPredicting(false)
    }
  }

  async function trainAiModel() {
    setIsTraining(true)
    setTrainingMessage('')
    setPredictionError('')

    try {
      await tensorflowService.trainModel()
      await tensorflowService.saveModelToStorage()
      setTrainingMessage('AI model trained and saved in local storage.')
    } catch (error) {
      setTrainingMessage(error instanceof Error ? error.message : 'Could not train AI model.')
    } finally {
      setIsTraining(false)
    }
  }

  function setStorageFeedback(message, type = 'info') {
    setStorageMessage(message)
    setStorageMessageType(type)
  }

  function downloadPendingSamples() {
    try {
      const pendingSamples = tensorflowService.getPendingSamplesSnapshot()
      const payload = JSON.stringify(pendingSamples, null, 2)
      const blob = new Blob([payload], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')

      anchor.href = url
      anchor.download = `yacht-ai-pending-samples-${stamp}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      setStorageFeedback(`Downloaded ${pendingSamples.length} pending samples.`, 'success')
    } catch (error) {
      setStorageFeedback(
        error instanceof Error ? error.message : 'Could not download pending samples.',
        'error',
      )
    }
  }

  function openImportDialog() {
    importInputRef.current?.click()
  }

  function handleImportPendingSamples(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const count = tensorflowService.importPendingSamples(parsed)
        setStorageFeedback(`Imported ${count} pending samples.`, 'success')
      } catch (error) {
        setStorageFeedback(
          error instanceof Error ? error.message : 'Could not import pending samples.',
          'error',
        )
      } finally {
        event.target.value = ''
      }
    }
    reader.onerror = () => {
      setStorageFeedback('Could not read selected file.', 'error')
      event.target.value = ''
    }
    reader.readAsText(file)
  }

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
    if (finalScore !== null) {
      resetGame()
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

    pushPendingSample([...categoryKeys.map((key) => (key === categoryKey ? 1 : 0))])

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

  const suggestedCategoryKey =
    prediction && prediction.categoryIndex >= 0 ? categoryKeys[prediction.categoryIndex] : null
  const suggestedCategoryLabel = suggestedCategoryKey
    ? categoryLabelsByKey[suggestedCategoryKey]
    : null
  const availableCategoryKeys = categoryKeys.filter((key) => categories[key] === null)

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
          <span className="final-score-chip">&spades;</span>
          <span>Game Over</span>
          <span className="final-score-value">Final Score: {finalScore}</span>
          <span className="final-score-chip">&clubs;</span>
        </div>
      )}
      <div className="floating-actions-left">
        <button
          type="button"
          className="train-btn"
          onClick={trainAiModel}
          disabled={isTraining || isPredicting}
        >
          {isTraining ? 'Training...' : 'Train AI'}
        </button>
      </div>
      <div className="floating-actions">
        <button
          type="button"
          className="suggestion-btn"
          onClick={showModelSuggestion}
          disabled={isPredicting || isTraining || rollsLeft === MAX_ROLLS}
        >
          {isPredicting ? 'Thinking...' : 'What should I do?'}
        </button>
      </div>
      <div className="storage-actions-top-right">
        <button
          type="button"
          className="storage-icon-btn"
          onClick={downloadPendingSamples}
          title="Download pending samples"
          aria-label="Download pending samples"
        >
          ⤓
        </button>
        <button
          type="button"
          className="storage-icon-btn"
          onClick={openImportDialog}
          title="Upload pending samples"
          aria-label="Upload pending samples"
        >
          ⤒
        </button>
        <input
          ref={importInputRef}
          className="storage-file-input"
          type="file"
          accept="application/json,.json"
          onChange={handleImportPendingSamples}
        />
      </div>
      {storageMessage && (
        <aside className={`storage-panel ${storageMessageType}`} aria-live="polite">
          <p>{storageMessage}</p>
        </aside>
      )}
      {showPrediction && (
        <aside className="suggestion-panel" aria-live="polite">
          {predictionError ? (
            <p>{predictionError}</p>
          ) : (
            <>
              <p>Suggested category: {suggestedCategoryLabel ?? 'Unknown'}</p>
              <div className="suggestion-feedback-controls">
                <label className="suggestion-feedback-label" htmlFor="suggestion-category-select">
                  Add training sample:
                </label>
                <select
                  className="suggestion-select"
                  id="suggestion-category-select"
                  value={feedbackCategoryKey}
                  onChange={(event) => {
                    setFeedbackCategoryKey(event.target.value)
                    setFeedbackMessage('')
                  }}
                >
                  <option value="">Select a category</option>
                  {availableCategoryKeys.map((key) => (
                    <option key={key} value={key}>
                      {categoryLabelsByKey[key]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="suggestion-add-btn"
                  onClick={addSuggestionFeedbackSample}
                  disabled={feedbackCategoryKey === ''}
                >
                  Add sample
                </button>
              </div>
              {feedbackMessage && <p>{feedbackMessage}</p>}
            </>
          )}
        </aside>
      )}
      {trainingMessage && (
        <aside className="training-panel" aria-live="polite">
          <p>{trainingMessage}</p>
        </aside>
      )}
    </>
  )
}

export default TrainingTablePage
