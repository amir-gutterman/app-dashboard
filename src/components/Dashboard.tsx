import apps from '../data/apps.json'
import type { AppEntry } from '../types'
import AppCard from './AppCard'

export default function Dashboard() {
  const entries = apps as AppEntry[]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="mx-auto max-w-5xl px-4 pt-10 pb-6 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">
          App Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          All of our web apps, in one place.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        {entries.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No apps yet — add one to src/data/apps.json.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
