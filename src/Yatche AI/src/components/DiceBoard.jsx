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
      <div className="roll-btn" onClick={onRoll} title="Roll dice">
        🎲
      </div>
    </div>
  )
}

export default DiceBoard
