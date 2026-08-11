import type { AppEntry } from '../types'
import AppAvatar from './AppAvatar'

interface Props {
  app: AppEntry
  editMode: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onEdit: () => void
  onArchive: () => void
}

export default function AppCard({
  app,
  editMode,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onArchive,
}: Props) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
      {editMode && (
        <div className="absolute top-2 left-2 z-10 flex gap-1">
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
            onClick={onArchive}
            aria-label={`Archive ${app.name}`}
            title="Archive"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <path d="M5 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
              <path d="M10 12h4" />
            </svg>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        aria-label={isFavorite ? `Unfavorite ${app.name}` : `Favorite ${app.name}`}
        aria-pressed={isFavorite}
        className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow dark:bg-neutral-800/90 ${
          isFavorite ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21.4l1.7-7L2 9.7l7.1-.6L12 2.5z" />
        </svg>
      </button>

      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Launch ${app.name}`}
        className="block aspect-video w-full transition-opacity hover:opacity-90"
      >
        <AppAvatar
          app={app}
          className="h-full w-full"
          textClassName="text-6xl"
          rounded="rounded-none"
        />
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {app.name}
            </h2>
            {app.category && (
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {app.category}
              </span>
            )}
          </div>
          {app.description && (
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {app.description}
            </p>
          )}
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
