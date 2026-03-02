import CategoryRow from './CategoryRow'
import { CATEGORY_ROWS } from '../constants/categories'

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
          {CATEGORY_ROWS.map(([label, categoryKey]) => (
            <CategoryRow
              key={categoryKey}
              label={label}
              categoryKey={categoryKey}
              value={categories[categoryKey]}
              onScoreCategory={onScoreCategory}
            />
          ))}
          <tr>
            <th>Total</th>
            <th>{totalScore}</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ScoreTable
