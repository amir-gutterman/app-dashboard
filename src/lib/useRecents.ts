import { useEffect, useState } from 'react'

const STORAGE_KEY = 'app-dashboard.recents.v1'
const MAX_RECENTS = 5

function load(): Record<string, number> {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function useRecents() {
  const [launchedAt, setLaunchedAt] = useState<Record<string, number>>(() => load())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(launchedAt))
  }, [launchedAt])

  function recordLaunch(id: string) {
    setLaunchedAt((prev) => ({ ...prev, [id]: Date.now() }))
  }

  const recentIds = Object.entries(launchedAt)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_RECENTS)
    .map(([id]) => id)

  return { recentIds, recordLaunch }
}
