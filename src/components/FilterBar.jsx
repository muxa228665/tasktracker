const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
]

/**
 * Панель фильтрации и поиска задач.
 */
export default function FilterBar({ filter, onFilterChange, search, onSearchChange, counts }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__tabs" role="tablist" aria-label="Фильтр задач">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={filter === item.value}
            className={`filter-bar__tab ${filter === item.value ? 'filter-bar__tab--active' : ''}`}
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
            <span className="filter-bar__count">{counts[item.value]}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar__search">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Поиск задач..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Поиск задач"
        />
        {search && (
          <button
            type="button"
            className="filter-bar__clear"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
