import { useCallback, useEffect, useState } from 'react'
import type { AvatarColor } from '../components/AppAvatar'
import type { IconKey } from '../icons'
import type { AppEntry } from '../types'
import { supabase } from './supabaseClient'

interface DbRow {
  id: string
  name: string
  description: string
  image: string
  icon: string | null
  color: string | null
  category: string | null
  url: string
  favorite: boolean
  archived: boolean
  sort_order: number
}

function rowToEntry(row: DbRow): AppEntry {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    icon: (row.icon ?? undefined) as IconKey | undefined,
    color: (row.color ?? undefined) as AvatarColor | undefined,
    category: row.category ?? undefined,
    url: row.url,
  }
}

function entryToColumns(entry: Omit<AppEntry, 'id'>) {
  return {
    name: entry.name,
    description: entry.description,
    image: entry.image,
    icon: entry.icon ?? null,
    color: entry.color ?? null,
    category: entry.category ?? null,
    url: entry.url,
  }
}

function makeId(name: string, existingIds: string[]) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'app'
  let id = base
  let n = 2
  while (existingIds.includes(id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}

export function useApps() {
  const [rows, setRows] = useState<DbRow[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from('apps').select('*').order('sort_order', { ascending: true })
    if (!error && data) setRows(data as DbRow[])
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    // Live cross-device sync: any device's change refreshes every open tab.
    const channel = supabase
      .channel('apps-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'apps' }, () => reload())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [reload])

  const activeRows = rows.filter((r) => !r.archived)
  const activeApps = activeRows.map(rowToEntry)
  const archivedApps = rows.filter((r) => r.archived).map(rowToEntry)
  const favoriteIds = new Set(rows.filter((r) => r.favorite).map((r) => r.id))

  async function addApp(entry: Omit<AppEntry, 'id'>) {
    const id = makeId(
      entry.name,
      rows.map((r) => r.id),
    )
    const nextOrder = rows.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1
    const { error } = await supabase.from('apps').insert({ id, ...entryToColumns(entry), sort_order: nextOrder })
    if (!error) await reload()
  }

  async function updateApp(id: string, entry: Omit<AppEntry, 'id'>) {
    const { error } = await supabase.from('apps').update(entryToColumns(entry)).eq('id', id)
    if (!error) await reload()
  }

  async function archiveApp(id: string) {
    const { error } = await supabase.from('apps').update({ archived: true }).eq('id', id)
    if (!error) await reload()
  }

  async function unarchiveApp(id: string) {
    const { error } = await supabase.from('apps').update({ archived: false }).eq('id', id)
    if (!error) await reload()
  }

  async function toggleFavorite(id: string) {
    const row = rows.find((r) => r.id === id)
    if (!row) return
    const { error } = await supabase.from('apps').update({ favorite: !row.favorite }).eq('id', id)
    if (!error) await reload()
  }

  // Commits a full reordering of the currently active ids, e.g. after a drag-and-drop drop.
  async function setOrder(newActiveOrder: string[]) {
    const orderIndex = new Map(newActiveOrder.map((id, index) => [id, index]))
    setRows((prev) => prev.map((r) => (orderIndex.has(r.id) ? { ...r, sort_order: orderIndex.get(r.id)! } : r)))
    await Promise.all(
      newActiveOrder.map((id, index) => supabase.from('apps').update({ sort_order: index }).eq('id', id)),
    )
    await reload()
  }

  // Upserts a batch of full AppEntry objects (matching Export JSON's shape) by id:
  // existing ids get updated in place (keeping their favorite/archived/order),
  // new ids get appended at the end.
  async function importApps(entries: AppEntry[]) {
    const existingById = new Map(rows.map((r) => [r.id, r]))
    let nextOrder = rows.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1
    const upserts = entries.map((entry) => {
      const existing = existingById.get(entry.id)
      return {
        id: entry.id,
        ...entryToColumns(entry),
        favorite: existing?.favorite ?? false,
        archived: existing?.archived ?? false,
        sort_order: existing ? existing.sort_order : nextOrder++,
      }
    })
    const { error } = await supabase.from('apps').upsert(upserts, { onConflict: 'id' })
    if (!error) await reload()
  }

  return {
    activeApps,
    archivedApps,
    favoriteIds,
    loaded,
    addApp,
    updateApp,
    archiveApp,
    unarchiveApp,
    toggleFavorite,
    setOrder,
    importApps,
  }
}
