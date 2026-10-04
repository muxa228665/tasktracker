/**
 * Заголовок приложения с логотипом и текущей датой.
 */
export default function Header({ total, completed }) {
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path
              d="M4 12l5 5L20 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <h1 className="app-header__title">Трекер задач</h1>
          <p className="app-header__subtitle">{today}</p>
        </div>
      </div>

      <div className="app-header__badge" title="Выполнено из общего числа задач">
        <strong>{completed}</strong>
        <span>/</span>
        <span>{total}</span>
      </div>
    </header>
  )
}
