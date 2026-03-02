function CategoryRow({ label, categoryKey, value, onScoreCategory }) {
  const used = value !== null

  return (
    <tr
      className={used ? 'used' : 'category'}
      onClick={() => onScoreCategory(categoryKey)}
    >
      <td>{label}</td>
      <td>{used ? value : '-'}</td>
    </tr>
  )
}

export default CategoryRow
