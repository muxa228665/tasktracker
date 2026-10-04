import { useState, useRef, useEffect } from 'react'

const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

/** Форматирует ISO-дату в удобочитаемый вид. */
function formatDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Возвращает true, если дедлайн просрочен (для незавершённых задач). */
function isOverdue(iso, completed) {
  if (!iso || completed) return false
  const due = new Date(iso)
  due.setHours(23, 59, 59, 999)
  return due.getTime() < Date.now()
}

/**
 * Отдельная строка задачи: чекбокс, текст, метаданные,
 * режим редактирования и кнопки действий.
 */
export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, { title: trimmed })
    } else {
      setDraft(task.title)
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraft(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') commitEdit()
    if (event.key === 'Escape') cancelEdit()
  }

  const overdue = isOverdue(task.dueDate, task.completed)

  return (
    <li className={`task ${task.completed ? 'task--completed' : ''}`}>
      <label className="task__checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={task.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
        />
        <span className="task__checkmark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              d="M4 12l5 5L20 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      <div className="task__body">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="task__edit-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <p className="task__title" onDoubleClick={() => setIsEditing(true)}>
            {task.title}
          </p>
        )}

        <div className="task__meta">
          <span className={`task__priority task__priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.dueDate && (
            <span className={`task__due ${overdue ? 'task__due--overdue' : ''}`}>
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {formatDate(task.dueDate)}
              {overdue && ' · просрочено'}
            </span>
          )}
        </div>
      </div>

      <div className="task__actions">
        {!isEditing && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Редактировать задачу"
            title="Редактировать"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(task.id)}
          aria-label="Удалить задачу"
          title="Удалить"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12M10 11v5M14 11v5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}
