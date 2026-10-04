/**
 * Блок статистики: прогресс-бар выполнения, счётчики по приоритетам.
 */
export default function Stats({ total, completed, active, byPriority }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <section className="stats">
      <div className="stats__progress">
        <div className="stats__progress-head">
          <span className="stats__progress-label">Прогресс выполнения</span>
          <span className="stats__progress-value">{percent}%</span>
        </div>
        <div
          className="stats__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="stats__bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="stats__cards">
        <div className="stats__card">
          <span className="stats__card-value">{active}</span>
          <span className="stats__card-label">В работе</span>
        </div>
        <div className="stats__card">
          <span className="stats__card-value">{completed}</span>
          <span className="stats__card-label">Выполнено</span>
        </div>
        <div className="stats__card stats__card--high">
          <span className="stats__card-value">{byPriority.high}</span>
          <span className="stats__card-label">Высокий приоритет</span>
        </div>
      </div>
    </section>
  )
}
