function Dice({ value, held, showValue, onClick }) {
  return (
    <div className={`dice${held ? ' held' : ''}`} onClick={onClick}>
      {showValue ? value : '?'}
    </div>
  )
}

export default Dice
