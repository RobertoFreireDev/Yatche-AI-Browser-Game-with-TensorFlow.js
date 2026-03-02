import { CATEGORY_ROWS } from '../constants/categories'

function ScoreTable({ categories, totalScore, onScoreCategory }) {
  const midpoint = Math.ceil(CATEGORY_ROWS.length / 2)
  const leftCategories = CATEGORY_ROWS.slice(0, midpoint)
  const rightCategories = CATEGORY_ROWS.slice(midpoint)
  const rowCount = Math.max(leftCategories.length, rightCategories.length)

  function renderCategoryCells(category) {
    if (!category) {
      return (
        <>
          <th>Total</th>
          <th>{totalScore}</th>
        </>
      )
    }

    const [label, categoryKey] = category
    const value = categories[categoryKey]
    const used = value !== null
    const className = used ? 'used' : 'category'
    const handleClick = () => onScoreCategory(categoryKey)

    return (
      <>
        <td className={className} onClick={handleClick}>
          {label}
        </td>
        <td className={className} onClick={handleClick}>
          {used ? value : '-'}
        </td>
      </>
    )
  }

  return (
    <div id="scoreboard">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Score</th>
            <th>Category</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={`row-${index}`}>
              {renderCategoryCells(leftCategories[index])}
              {renderCategoryCells(rightCategories[index])}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoreTable
