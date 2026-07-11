import { useEffect, useState } from 'react'
import defaultApps from '../data/apps.json'
import type { AppEntry } from '../types'

const STORAGE_KEY = 'app-dashboard.apps.v1'

function load(): AppEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultApps as AppEntry[]
  try {
    return JSON.parse(raw) as AppEntry[]
  } catch {
    return defaultApps as AppEntry[]
  }
}

function makeId(name: string, existing: AppEntry[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'app'
  let id = base
  let n = 2
  while (existing.some((a) => a.id === id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}

export function useApps() {
  const [apps, setApps] = useState<AppEntry[]>(() => load())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
  }, [apps])

  function addApp(entry: Omit<AppEntry, 'id'>) {
    setApps((prev) => [...prev, { ...entry, id: makeId(entry.name, prev) }])
  }

  function updateApp(id: string, entry: Omit<AppEntry, 'id'>) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...entry, id } : a)))
  }

  function deleteApp(id: string) {
    setApps((prev) => prev.filter((a) => a.id !== id))
  }

  function resetToDefaults() {
    setApps(defaultApps as AppEntry[])
  }

  return { apps, addApp, updateApp, deleteApp, resetToDefaults }
}
