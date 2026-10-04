import TaskItem from './TaskItem.jsx'

/**
 * Список задач. Показывает пустое состояние, если задач нет.
 * Пустое состояние различается для разных фильтров и режима поиска.
 */
export default function TaskList({ tasks, filter, hasSearch, onToggle, onDelete, onUpdate }) {
  if (tasks.length === 0) {
    const messages = {
      all: 'Пока задач нет. Добавьте первую задачу выше 👆',
      active: 'Активных задач нет — отличная работа! 🎉',
      completed: 'Выполненных задач пока нет.',
    }
    const text = hasSearch
      ? 'По вашему запросу ничего не найдено 🔍'
      : messages[filter] || messages.all

    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40">
            <rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <p>{text}</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}
