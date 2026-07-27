import type { KeyboardEvent } from 'react'
import type { AppEntry } from '../types'
import AppAvatar from './AppAvatar'

interface Props {
  app: AppEntry
  editMode: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onLaunch: () => void
  onEdit: () => void
  onArchive: () => void
}

export default function AppGridItem({
  app,
  editMode,
  isFavorite,
  onToggleFavorite,
  onLaunch,
  onEdit,
  onArchive,
}: Props) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit()
    }
  }

  const content = (
    <>
      <div className="relative">
        <AppAvatar app={app} className="h-14 w-14" textClassName="text-2xl" rounded="rounded-2xl" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onToggleFavorite()
          }}
          aria-label={isFavorite ? `Unfavorite ${app.name}` : `Favorite ${app.name}`}
          aria-pressed={isFavorite}
          className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow dark:bg-neutral-800 ${
            isFavorite ? 'text-amber-400' : 'text-neutral-300'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21.4l1.7-7L2 9.7l7.1-.6L12 2.5z" />
          </svg>
        </button>
        {editMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onArchive()
            }}
            aria-label={`Archive ${app.name}`}
            className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-neutral-500 shadow dark:bg-neutral-800"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <path d="M5 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
            </svg>
          </button>
        )}
      </div>
      <span className="line-clamp-2 max-w-[76px] text-center text-[11px] leading-tight font-medium text-neutral-700 dark:text-neutral-300">
        {app.name}
      </span>
    </>
  )

  const baseClass = 'flex flex-col items-center gap-1.5 rounded-xl p-2 select-none'

  if (editMode) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={handleKeyDown}
        className={`${baseClass} cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900`}
      >
        {content}
      </div>
    )
  }

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onLaunch}
      className={`${baseClass} transition-colors active:bg-neutral-100 dark:active:bg-neutral-900`}
    >
      {content}
    </a>
  )
}
