import Dice from './Dice'

function DiceBoard({ dice, held, rollsLeft, onToggleHold, onRoll }) {
  const isRollDisabled = rollsLeft === 0

  return (
    <div id="dice-container">
      {dice.map((value, index) => (
        <Dice
          key={index}
          value={value}
          held={held[index]}
          showValue={rollsLeft < 3}
          onClick={() => onToggleHold(index)}
        />
      ))}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          className={`roll-btn${isRollDisabled ? ' disabled' : ''}`}
          onClick={onRoll}
          title="Roll dice"
          disabled={isRollDisabled}
        >
          🎲
        </button>
        <span className="rolls-left-badge">
          {rollsLeft}
        </span>
      </div>
    </div>
  )
}

export default DiceBoard
