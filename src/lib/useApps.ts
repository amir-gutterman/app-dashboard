import { useEffect, useState } from 'react'
import defaultApps from '../data/apps.json'
import type { AppEntry } from '../types'

// Stores only local *changes* relative to apps.json (never a full snapshot),
// so newly deployed entries in apps.json always show up on every device,
// and a device's local edits/additions/archiving/ordering still layer on top.
const STORAGE_KEY = 'app-dashboard.overrides.v3'

interface Overrides {
  added: AppEntry[]
  edited: Record<string, Omit<AppEntry, 'id'>>
  archivedIds: string[]
  order: string[]
}

const EMPTY_OVERRIDES: Overrides = { added: [], edited: {}, archivedIds: [], order: [] }

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

  function moveApp(id: string, direction: 'up' | 'down') {
    setOverrides((prev) => {
      const currentAll = computeAll(prev)
      const currentActiveIds = sortByOrder(
        currentAll.filter((a) => !prev.archivedIds.includes(a.id)).map((a) => a.id),
        prev.order,
      )
      const index = currentActiveIds.indexOf(id)
      const swapWith = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapWith < 0 || swapWith >= currentActiveIds.length) return prev
      const newOrder = [...currentActiveIds]
      ;[newOrder[index], newOrder[swapWith]] = [newOrder[swapWith], newOrder[index]]
      return { ...prev, order: newOrder }
    })
  }

  function resetToDefaults() {
    setOverrides(EMPTY_OVERRIDES)
  }

  return {
    activeApps,
    archivedApps,
    addApp,
    updateApp,
    archiveApp,
    unarchiveApp,
    moveApp,
    resetToDefaults,
  }
}
