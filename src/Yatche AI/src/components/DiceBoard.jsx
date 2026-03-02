import Dice from './Dice'

function DiceBoard({ dice, held, rollsLeft, onToggleHold, onRoll }) {
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
          className="roll-btn"
          onClick={onRoll}
          title="Roll dice"
          disabled={rollsLeft === 0}
          style={rollsLeft === 0 ? { background: '#8f8f8f', cursor: 'not-allowed' } : {}}
        >
          🎲
        </button>
        <span
          className="rolls-left-badge"
          style={{
            position: 'absolute',
            top: '2px',
            right: '4px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '22px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
          }}
        >
          {rollsLeft}
        </span>
      </div>
    </div>
  )
}

export default DiceBoard
