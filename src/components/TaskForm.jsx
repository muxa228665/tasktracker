import { useState } from 'react'

const PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]

/**
 * Форма добавления новой задачи.
 * Позволяет задать название, приоритет и необязательный дедлайн.
 */
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = title.trim()

    if (!trimmed) {
      setError('Введите название задачи')
      return
    }

    onAdd({ title: trimmed, priority, dueDate: dueDate || null })
    setTitle('')
    setPriority('medium')
    setDueDate('')
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__row">
        <input
          type="text"
          className={`task-form__input ${error ? 'task-form__input--error' : ''}`}
          placeholder="Что нужно сделать?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (error) setError('')
          }}
          aria-label="Название задачи"
        />
        <button type="submit" className="btn btn--primary">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          Добавить
        </button>
      </div>

      <div className="task-form__row task-form__row--meta">
        <label className="task-form__field">
          <span className="task-form__label">Приоритет</span>
          <select
            className="task-form__select"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="task-form__field">
          <span className="task-form__label">Срок</span>
          <input
            type="date"
            className="task-form__date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
      </div>

      {error && <p className="task-form__error">{error}</p>}
    </form>
  )
}
