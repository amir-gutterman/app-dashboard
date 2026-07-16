import { useState } from 'react'
import { useApps } from '../lib/useApps'
import type { AppEntry } from '../types'
import AppCard from './AppCard'
import AppForm from './AppForm'
import ArchiveSection from './ArchiveSection'

export default function Dashboard() {
  const { activeApps, archivedApps, addApp, updateApp, archiveApp, unarchiveApp } = useApps()
  const [editing, setEditing] = useState<AppEntry | 'new' | null>(null)
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-4 pt-10 pb-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">
            App Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            All of our web apps, in one place.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            title="Copy the current list as JSON, to paste into src/data/apps.json and persist it permanently"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {copied ? 'Copied!' : 'Export JSON'}
          </button>
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add App
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        {activeApps.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No apps yet — click "Add App" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={() => setEditing(app)}
                onArchive={() => archiveApp(app.id)}
              />
            ))}
          </div>
        )}

        <ArchiveSection apps={archivedApps} onUnarchive={unarchiveApp} />
      </main>

      {editing && (
        <AppForm
          initial={editing === 'new' ? undefined : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
