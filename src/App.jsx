import { useState, useMemo } from 'react'
import Header from './components/Header.jsx'
import Stats from './components/Stats.jsx'
import TaskForm from './components/TaskForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import TaskList from './components/TaskList.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

/** Приоритет для сортировки: чем больше число, тем выше задача в списке. */
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 }

/** Генерирует уникальный идентификатор задачи. */
function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const INITIAL_TASKS = [
  {
    id: createId(),
    title: 'Изучить документацию React',
    priority: 'medium',
    dueDate: null,
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: createId(),
    title: 'Собрать проект через Vite',
    priority: 'high',
    dueDate: null,
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: createId(),
    title: 'Настроить голубую цветовую тему',
    priority: 'low',
    dueDate: null,
    completed: true,
    createdAt: Date.now(),
  },
]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('task-tracker:tasks', INITIAL_TASKS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  /* ---------- операции с задачами ---------- */

  const addTask = ({ title, priority, dueDate }) => {
    const task = {
      id: createId(),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateTask = (id, changes) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...changes } : task)),
    )
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  /* ---------- производные данные ---------- */

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const active = total - completed
    const byPriority = { high: 0, medium: 0, low: 0 }
    tasks.forEach((task) => {
      if (!task.completed && byPriority[task.priority] !== undefined) {
        byPriority[task.priority] += 1
      }
    })
    return { total, completed, active, byPriority }
  }, [tasks])

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  )

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks
      .filter((task) => {
        if (filter === 'active' && task.completed) return false
        if (filter === 'completed' && !task.completed) return false
        if (query && !task.title.toLowerCase().includes(query)) return false
        return true
      })
      .sort((a, b) => {
        // незавершённые — выше завершённых
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        // затем по приоритету
        const weight = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
        if (weight !== 0) return weight
        // затем по времени создания (новые выше)
        return (b.createdAt || 0) - (a.createdAt || 0)
      })
  }, [tasks, filter, search])

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />
      <main className="app__container">
        <Header total={stats.total} completed={stats.completed} />

        <Stats
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          byPriority={stats.byPriority}
        />

        <TaskForm onAdd={addTask} />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
        />

        <TaskList
          tasks={visibleTasks}
          filter={filter}
          hasSearch={search.trim().length > 0}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />

        {stats.completed > 0 && (
          <div className="app__footer">
            <button type="button" className="btn btn--ghost" onClick={clearCompleted}>
              Очистить выполненные ({stats.completed})
            </button>
          </div>
        )}

        <footer className="app__credits">
          Трекер задач · React + Vite
        </footer>
      </main>
    </div>
  )
}
