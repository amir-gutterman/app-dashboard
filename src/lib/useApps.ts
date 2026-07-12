import { useEffect, useState } from 'react'
import defaultApps from '../data/apps.json'
import type { AppEntry } from '../types'

// Stores only local *changes* relative to apps.json (never a full snapshot),
// so newly deployed entries in apps.json always show up on every device,
// and a device's local edits/additions/deletions still layer on top.
const STORAGE_KEY = 'app-dashboard.overrides.v1'

interface Overrides {
  added: AppEntry[]
  edited: Record<string, Omit<AppEntry, 'id'>>
  deletedIds: string[]
}

const EMPTY_OVERRIDES: Overrides = { added: [], edited: {}, deletedIds: [] }

function loadOverrides(): Overrides {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return EMPTY_OVERRIDES
  try {
    return { ...EMPTY_OVERRIDES, ...JSON.parse(raw) }
  } catch {
    return EMPTY_OVERRIDES
  }
}

function isDefaultId(id: string) {
  return (defaultApps as AppEntry[]).some((a) => a.id === id)
}

function computeApps(overrides: Overrides): AppEntry[] {
  const base = (defaultApps as AppEntry[])
    .filter((a) => !overrides.deletedIds.includes(a.id))
    .map((a) => (overrides.edited[a.id] ? { ...overrides.edited[a.id], id: a.id } : a))
  const added = overrides.added.filter((a) => !overrides.deletedIds.includes(a.id))
  return [...base, ...added]
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
  const [overrides, setOverrides] = useState<Overrides>(() => loadOverrides())
  const apps = computeApps(overrides)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

  function addApp(entry: Omit<AppEntry, 'id'>) {
    setOverrides((prev) => ({
      ...prev,
      added: [...prev.added, { ...entry, id: makeId(entry.name, computeApps(prev)) }],
    }))
  }

  function updateApp(id: string, entry: Omit<AppEntry, 'id'>) {
    setOverrides((prev) =>
      isDefaultId(id)
        ? { ...prev, edited: { ...prev.edited, [id]: entry } }
        : { ...prev, added: prev.added.map((a) => (a.id === id ? { ...entry, id } : a)) },
    )
  }

  function deleteApp(id: string) {
    setOverrides((prev) =>
      isDefaultId(id)
        ? { ...prev, deletedIds: [...prev.deletedIds, id] }
        : { ...prev, added: prev.added.filter((a) => a.id !== id) },
    )
  }

  function resetToDefaults() {
    setOverrides(EMPTY_OVERRIDES)
  }

  return { apps, addApp, updateApp, deleteApp, resetToDefaults }
}
