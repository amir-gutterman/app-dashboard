import { useEffect, useState } from 'react'
import defaultApps from '../data/apps.json'
import type { AppEntry } from '../types'

// Stores only local *changes* relative to apps.json (never a full snapshot),
// so newly deployed entries in apps.json always show up on every device,
// and a device's local edits/additions/archiving/ordering/favorites still
// layer on top.
const STORAGE_KEY = 'app-dashboard.overrides.v4'

interface Overrides {
  added: AppEntry[]
  edited: Record<string, Omit<AppEntry, 'id'>>
  archivedIds: string[]
  favoriteIds: string[]
  order: string[]
}

const EMPTY_OVERRIDES: Overrides = {
  added: [],
  edited: {},
  archivedIds: [],
  favoriteIds: [],
  order: [],
}

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

function computeAll(overrides: Overrides): AppEntry[] {
  const base = (defaultApps as AppEntry[]).map((a) =>
    overrides.edited[a.id] ? { ...overrides.edited[a.id], id: a.id } : a,
  )
  return [...base, ...overrides.added]
}

// Orders `ids` by their position in `order`, appending any id missing from
// `order` (e.g. one just added, or a newly deployed apps.json entry) at the end.
function sortByOrder(ids: string[], order: string[]): string[] {
  const known = order.filter((id) => ids.includes(id))
  const unknown = ids.filter((id) => !order.includes(id))
  return [...known, ...unknown]
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
  const all = computeAll(overrides)
  const byId = new Map(all.map((a) => [a.id, a]))

  const activeIds = sortByOrder(
    all.filter((a) => !overrides.archivedIds.includes(a.id)).map((a) => a.id),
    overrides.order,
  )
  const activeApps = activeIds.map((id) => byId.get(id)!)
  const archivedApps = all.filter((a) => overrides.archivedIds.includes(a.id))
  const favoriteIds = new Set(overrides.favoriteIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

  function addApp(entry: Omit<AppEntry, 'id'>) {
    setOverrides((prev) => ({
      ...prev,
      added: [...prev.added, { ...entry, id: makeId(entry.name, computeAll(prev)) }],
    }))
  }

  function updateApp(id: string, entry: Omit<AppEntry, 'id'>) {
    setOverrides((prev) =>
      isDefaultId(id)
        ? { ...prev, edited: { ...prev.edited, [id]: entry } }
        : { ...prev, added: prev.added.map((a) => (a.id === id ? { ...entry, id } : a)) },
    )
  }

  function archiveApp(id: string) {
    setOverrides((prev) =>
      prev.archivedIds.includes(id) ? prev : { ...prev, archivedIds: [...prev.archivedIds, id] },
    )
  }

  function unarchiveApp(id: string) {
    setOverrides((prev) => ({
      ...prev,
      archivedIds: prev.archivedIds.filter((existingId) => existingId !== id),
    }))
  }

  function toggleFavorite(id: string) {
    setOverrides((prev) => ({
      ...prev,
      favoriteIds: prev.favoriteIds.includes(id)
        ? prev.favoriteIds.filter((existingId) => existingId !== id)
        : [...prev.favoriteIds, id],
    }))
  }

  // Commits a full reordering of the currently active ids, e.g. after a drag-and-drop drop.
  function setOrder(newActiveOrder: string[]) {
    setOverrides((prev) => ({ ...prev, order: newActiveOrder }))
  }

  // Upserts a batch of full AppEntry objects (matching Export JSON's shape) by id:
  // ids that match a default app become edits, everything else becomes an addition.
  function importApps(entries: AppEntry[]) {
    setOverrides((prev) => {
      let next = { ...prev, edited: { ...prev.edited }, added: [...prev.added] }
      for (const entry of entries) {
        const { id, ...rest } = entry
        if (isDefaultId(id)) {
          next.edited[id] = rest
        } else {
          const existingIndex = next.added.findIndex((a) => a.id === id)
          if (existingIndex >= 0) {
            next.added[existingIndex] = entry
          } else {
            next.added.push(entry)
          }
        }
      }
      return next
    })
  }

  function resetToDefaults() {
    setOverrides(EMPTY_OVERRIDES)
  }

  return {
    activeApps,
    archivedApps,
    favoriteIds,
    addApp,
    updateApp,
    archiveApp,
    unarchiveApp,
    toggleFavorite,
    setOrder,
    importApps,
    resetToDefaults,
  }
}
