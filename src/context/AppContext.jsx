/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, translate } from '../i18n.js'

const AppContext = createContext(null)
const SESSION_KEY = 'coffee_os_session'
const LANGUAGE_KEY = 'coffee_os_language'
const emptyData = { tasks: [], reflections: {}, mood: 'latte' }
const AUTH_GOOGLE_URL = import.meta.env.VITE_AUTH_GOOGLE_URL || '/api/auth/google'
const AUTH_ME_URL = import.meta.env.VITE_AUTH_ME_URL || '/api/auth/me'
const AUTH_LOGOUT_URL = import.meta.env.VITE_AUTH_LOGOUT_URL || '/api/auth/logout'

const todayKey = () => new Date().toISOString().slice(0, 10)
const dataKey = (userId) => `coffee_os_data_${userId || 'guest'}`

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function normalizeData(data) {
  return {
    tasks: Array.isArray(data?.tasks) ? data.tasks : [],
    reflections: data?.reflections && typeof data.reflections === 'object' ? data.reflections : {},
    mood: ['latte', 'espresso', 'iced', 'cocoa'].includes(data?.mood) ? data.mood : 'latte',
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => loadJson(SESSION_KEY, null))
  const [language, setLanguageState] = useState(() => localStorage.getItem(LANGUAGE_KEY) || 'zh-TW')
  const [data, setData] = useState(() => normalizeData(loadJson(dataKey(loadJson(SESSION_KEY, null)?.id), emptyData)))

  useEffect(() => {
    localStorage.setItem(dataKey(user?.id), JSON.stringify(data))
  }, [data, user?.id])

  const signIn = useCallback((profile) => {
    const nextUser = { ...profile, id: profile.id || 'guest' }
    setData(normalizeData(loadJson(dataKey(nextUser.id), emptyData)))
    setUser(nextUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
  }, [])

  const signOut = useCallback(async () => {
    if (user?.provider === 'supabase') {
      try {
        await fetch(AUTH_LOGOUT_URL, { credentials: 'include', method: 'POST' })
      } catch {
        // Local state still clears even if the backend session has already expired.
      }
    }
    setData(normalizeData(loadJson(dataKey('guest'), emptyData)))
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [user?.provider])

  function setLanguage(value) {
    setLanguageState(value)
    localStorage.setItem(LANGUAGE_KEY, value)
  }

  function setMood(mood) {
    setData((current) => ({ ...current, mood }))
  }

  function addTask(title, time = '09:00', moodTag = data.mood) {
    const trimmed = title.trim()
    if (!trimmed) return
    setData((current) => ({
      ...current,
      tasks: [
        ...current.tasks,
        {
          id: crypto.randomUUID(),
          title: trimmed,
          time,
          completed: false,
          moodTag,
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }

  function updateTask(id, patch) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    }))
  }

  function deleteTask(id) {
    setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }))
  }

  function moveTask(id, direction) {
    setData((current) => {
      const tasks = [...current.tasks]
      const index = tasks.findIndex((task) => task.id === id)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= tasks.length) return current
      const [task] = tasks.splice(index, 1)
      tasks.splice(nextIndex, 0, task)
      return { ...current, tasks }
    })
  }

  function setReflection(value, key = todayKey()) {
    setData((current) => ({
      ...current,
      reflections: {
        ...current.reflections,
        [key]: value,
      },
    }))
  }

  const signInWithSupabaseGoogle = useCallback(() => {
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const authUrl = new URL(AUTH_GOOGLE_URL, window.location.origin)
    authUrl.searchParams.set('redirectTo', redirectTo)
    window.location.assign(authUrl.toString())
    return { ok: true }
  }, [])

  const completeSupabaseLogin = useCallback(async () => {
    const response = await fetch(AUTH_ME_URL, { credentials: 'include' })
    if (response.status === 401 || response.status === 404) return { ok: false }
    if (!response.ok) return { ok: false, messageKey: 'backendSessionError' }

    const backendUser = await response.json()
    if (!backendUser?.id) return { ok: false }
    signIn({
      id: backendUser.id,
      name: backendUser.name || backendUser.email || 'Supabase user',
      email: backendUser.email || '',
      picture: backendUser.picture || '',
      provider: 'supabase',
    })
    return { ok: true }
  }, [signIn])

  const stats = useMemo(() => {
    const completed = data.tasks.filter((task) => task.completed).length
    const moodCounts = data.tasks.reduce(
      (acc, task) => ({ ...acc, [task.moodTag]: (acc[task.moodTag] || 0) + 1 }),
      { latte: 0, espresso: 0, iced: 0, cocoa: 0 },
    )
    return {
      completed,
      open: data.tasks.length - completed,
      moodCounts,
      coffeeTime: completed * 25,
    }
  }, [data.tasks])

  const t = useCallback((key, values) => translate(dictionaries[language], key, values), [language])

  const value = {
    user,
    language,
    tasks: data.tasks,
    reflections: data.reflections,
    mood: data.mood,
    stats,
    todayKey: todayKey(),
    addTask,
    completeSupabaseLogin,
    deleteTask,
    moveTask,
    setLanguage,
    setMood,
    setReflection,
    signIn,
    signInWithSupabaseGoogle,
    signOut,
    updateTask,
    t,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
