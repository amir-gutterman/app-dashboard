import { useMemo, useState } from 'react'
import { useApps } from '../lib/useApps'
import { useDragReorder } from '../lib/useDragReorder'
import { useRecents } from '../lib/useRecents'
import { useViewMode } from '../lib/useViewMode'
import type { AppEntry } from '../types'
import AppCard from './AppCard'
import AppForm from './AppForm'
import AppGridItem from './AppGridItem'
import AppRow from './AppRow'
import AppSection from './AppSection'
import ArchiveSection from './ArchiveSection'
import ImportDialog from './ImportDialog'
import OverflowMenu from './OverflowMenu'
import SearchBar from './SearchBar'

export default function Dashboard() {
  const {
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
  } = useApps()
  const { recentIds, recordLaunch } = useRecents()
  const [viewMode, setViewMode] = useViewMode()

  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState<AppEntry | 'new' | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')

  const activeIds = useMemo(() => activeApps.map((a) => a.id), [activeApps])
  const dragReorder = useDragReorder(activeIds, setOrder)
  const byId = useMemo(() => new Map(activeApps.map((a) => [a.id, a])), [activeApps])
  const orderedApps = dragReorder.order.map((id) => byId.get(id)).filter((a): a is AppEntry => !!a)

  const existingCategories = useMemo(
    () => Array.from(new Set(activeApps.map((a) => a.category).filter((c): c is string => !!c))).sort(),
    [activeApps],
  )

  const query = search.trim().toLowerCase()
  const searching = query.length > 0
  const searchResults = searching
    ? orderedApps.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          (app.category ?? '').toLowerCase().includes(query),
      )
    : []

  const favoriteApps = orderedApps.filter((app) => favoriteIds.has(app.id))
  const recentApps = recentIds.map((id) => byId.get(id)).filter((a): a is AppEntry => !!a)

  const categories = useMemo(
    () => Array.from(new Set(orderedApps.map((a) => a.category).filter((c): c is string => !!c))),
    [orderedApps],
  )
  const uncategorized = orderedApps.filter((a) => !a.category)

  async function handleExport() {
    await navigator.clipboard.writeText(JSON.stringify(activeApps, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleSubmit(entry: Omit<AppEntry, 'id'>) {
    if (editing && editing !== 'new') {
      updateApp(editing.id, entry)
    } else {
      addApp(entry)
    }
    setEditing(null)
  }

  function renderItem(app: AppEntry) {
    const common = {
      app,
      editMode,
      isFavorite: favoriteIds.has(app.id),
      onToggleFavorite: () => toggleFavorite(app.id),
      onLaunch: () => recordLaunch(app.id),
      onEdit: () => setEditing(app),
      onArchive: () => archiveApp(app.id),
    }

    if (viewMode === 'grid') return <AppGridItem {...common} />
    if (viewMode === 'card') return <AppCard {...common} />

    const isDragging = dragReorder.dragId === app.id
    return (
      <AppRow
        {...common}
        rowRef={editMode ? dragReorder.registerItem(app.id) : undefined}
        isDragging={isDragging}
        dragOffset={isDragging ? dragReorder.dragOffset : 0}
        dragHandleProps={
          editMode
            ? {
                onPointerDown: (e) => dragReorder.handlePointerDown(app.id, e),
                onPointerMove: (e) => dragReorder.handlePointerMove(app.id, e),
                onPointerUp: (e) => dragReorder.handlePointerUp(app.id, e),
                onPointerCancel: (e) => dragReorder.handlePointerCancel(app.id, e),
              }
            : undefined
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="mx-auto flex max-w-3xl items-center gap-2 px-4 pt-3 pb-1 sm:px-6">
        <h1 className="text-base font-semibold text-neutral-900 sm:text-lg dark:text-neutral-100">
          App Dashboard
        </h1>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            aria-pressed={editMode}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              editMode
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
          <OverflowMenu
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={handleExport}
            onImportClick={() => setImportOpen(true)}
            exportLabel={copied ? 'Copied!' : 'Export JSON'}
          />
        </div>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      <main className="mx-auto max-w-3xl px-4 pb-28 sm:px-6">
        {activeApps.length === 0 ? (
          <p className="px-1 py-6 text-sm text-neutral-500 dark:text-neutral-400">
            No apps yet — tap the + button to create one.
          </p>
        ) : searching ? (
          searchResults.length === 0 ? (
            <p className="px-1 py-6 text-sm text-neutral-500 dark:text-neutral-400">
              No apps match "{search}".
            </p>
          ) : (
            <AppSection title="Results" apps={searchResults} renderItem={renderItem} layout={viewMode} />
          )
        ) : (
          <>
            <AppSection title="Recently Used" apps={recentApps} renderItem={renderItem} layout={viewMode} />
            <AppSection title="Favorites" apps={favoriteApps} renderItem={renderItem} layout={viewMode} />
            {categories.length === 0 ? (
              <AppSection title="Apps" apps={uncategorized} renderItem={renderItem} layout={viewMode} />
            ) : (
              <>
                {categories.map((category) => (
                  <AppSection
                    key={category}
                    title={category}
                    apps={orderedApps.filter((a) => a.category === category)}
                    renderItem={renderItem}
                    layout={viewMode}
                    collapsible
                  />
                ))}
                <AppSection title="Other" apps={uncategorized} renderItem={renderItem} layout={viewMode} collapsible />
              </>
            )}
          </>
        )}

        <ArchiveSection apps={archivedApps} onUnarchive={unarchiveApp} />
      </main>

      <button
        type="button"
        onClick={() => setEditing('new')}
        aria-label="Add app"
        className={`fixed right-5 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 ${
          editMode ? 'pointer-events-none scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {editing && (
        <AppForm
          initial={editing === 'new' ? undefined : editing}
          existingCategories={existingCategories}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      {importOpen && <ImportDialog onImport={importApps} onClose={() => setImportOpen(false)} />}
    </div>
  )
}
