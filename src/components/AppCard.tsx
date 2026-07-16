import { ICONS } from '../icons'
import type { AppEntry } from '../types'

const GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-cyan-400',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-pink-500',
  'from-indigo-500 to-blue-500',
]

function gradientFor(id: string) {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return GRADIENTS[hash % GRADIENTS.length]
}

interface Props {
  app: AppEntry
  onEdit: () => void
  onDelete: () => void
}

export default function AppCard({ app, onEdit, onDelete }: Props) {
  const initial = app.name.trim().charAt(0).toUpperCase() || '?'
  const Icon = app.icon ? ICONS[app.icon] : null

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${app.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${app.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
          </svg>
        </button>
      </div>

      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Launch ${app.name}`}
        className="block aspect-video w-full transition-opacity hover:opacity-90"
      >
        {app.image ? (
          <img
            src={app.image}
            alt={`${app.name} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientFor(app.id)}`}
          >
            {Icon ? (
              <Icon className="h-14 w-14 text-white/90" />
            ) : (
              <span className="text-5xl font-bold text-white/90">{initial}</span>
            )}
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {app.name}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {app.description}
          </p>
        </div>

        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Launch App
        </a>
      </div>
    </div>
  )
}
