import { useState, useEffect } from 'react'

/**
 * Хук для синхронизации состояния с localStorage.
 * При первом рендере пытается прочитать сохранённое значение,
 * при изменении — записывает его обратно.
 *
 * @param {string} key - ключ в localStorage
 * @param {*} initialValue - значение по умолчанию
 * @returns {[*, Function]} кортеж [значение, сеттер]
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.warn(`Не удалось прочитать ключ "${key}" из localStorage:`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Не удалось сохранить ключ "${key}" в localStorage:`, error)
    }
  }, [key, value])

  return [value, setValue]
}
