import type { AppEntry } from '../types'

interface Props {
  apps: AppEntry[]
  onUnarchive: (id: string) => void
}

export default function ArchiveSection({ apps, onUnarchive }: Props) {
  if (apps.length === 0) return null

  return (
    <section className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <h2 className="text-xs font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
        Archived ({apps.length})
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {apps.map((app) => (
          <li
            key={app.id}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1 pr-1 pl-3 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
          >
            <span>{app.name}</span>
            <button
              type="button"
              onClick={() => onUnarchive(app.id)}
              aria-label={`Unarchive ${app.name}`}
              title="Unarchive"
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M3 12a9 9 0 1 1 3 6.7" />
                <path d="M3 8v5h5" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
