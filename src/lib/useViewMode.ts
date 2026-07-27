import { useEffect, useState } from 'react'

export type ViewMode = 'list' | 'grid' | 'card'

const STORAGE_KEY = 'app-dashboard.viewMode'
const VALID: ViewMode[] = ['list', 'grid', 'card']

function load(): ViewMode {
  const raw = localStorage.getItem(STORAGE_KEY)
  return VALID.includes(raw as ViewMode) ? (raw as ViewMode) : 'list'
}

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => load())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, viewMode)
  }, [viewMode])

  return [viewMode, setViewMode] as const
}
