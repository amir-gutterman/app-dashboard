import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import type { AppEntry } from '../types'
import AppAvatar from './AppAvatar'

interface DragHandleProps {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void
}

interface Props {
  app: AppEntry
  editMode: boolean
  isFavorite: boolean
  isDragging?: boolean
  dragOffset?: number
  rowRef?: (el: HTMLElement | null) => void
  dragHandleProps?: DragHandleProps
  onToggleFavorite: () => void
  onEdit: () => void
  onArchive: () => void
}

export default function AppRow({
  app,
  editMode,
  isFavorite,
  isDragging = false,
  dragOffset = 0,
  rowRef,
  dragHandleProps,
  onToggleFavorite,
  onEdit,
  onArchive,
}: Props) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit()
    }
  }

  const baseClass =
    'flex min-h-[72px] items-center gap-3 rounded-xl px-2.5 py-2.5 select-none'

  const content = (
    <>
      {editMode && (
        <button
          type="button"
          aria-label={`Reorder ${app.name}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-9 w-6 shrink-0 touch-none items-center justify-center text-neutral-300 active:cursor-grabbing dark:text-neutral-600"
          {...dragHandleProps}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <circle cx="9" cy="6" r="1.4" />
            <circle cx="15" cy="6" r="1.4" />
            <circle cx="9" cy="12" r="1.4" />
            <circle cx="15" cy="12" r="1.4" />
            <circle cx="9" cy="18" r="1.4" />
            <circle cx="15" cy="18" r="1.4" />
          </svg>
        </button>
      )}

      <AppAvatar app={app} className="h-11 w-11" textClassName="text-lg" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
            {app.name}
          </span>
          {app.category && (
            <span className="hidden shrink-0 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 sm:inline dark:bg-neutral-800 dark:text-neutral-400">
              {app.category}
            </span>
          )}
        </div>
        {app.description && (
          <p className="truncate text-[13px] text-neutral-500 dark:text-neutral-400">
            {app.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onToggleFavorite()
        }}
        aria-label={isFavorite ? `Unfavorite ${app.name}` : `Favorite ${app.name}`}
        aria-pressed={isFavorite}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isFavorite
            ? 'text-amber-400'
            : 'text-neutral-300 hover:text-neutral-400 dark:text-neutral-700 dark:hover:text-neutral-500'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21.4l1.7-7L2 9.7l7.1-.6L12 2.5z" />
        </svg>
      </button>

      {editMode && (
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            aria-label={`Edit ${app.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onArchive()
            }}
            aria-label={`Archive ${app.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
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
    </>
  )

  if (editMode) {
    return (
      <div
        ref={rowRef}
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={handleKeyDown}
        style={
          isDragging
            ? { transform: `translateY(${dragOffset}px)`, zIndex: 20, position: 'relative' }
            : undefined
        }
        className={`${baseClass} cursor-pointer ${
          isDragging
            ? 'bg-white shadow-lg ring-1 ring-black/10 dark:bg-neutral-800'
            : 'transition-[background-color,transform] duration-150 hover:bg-neutral-100 active:bg-neutral-100 dark:hover:bg-neutral-900 dark:active:bg-neutral-900'
        }`}
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
      className={`${baseClass} transition-colors active:bg-neutral-100 dark:active:bg-neutral-900`}
    >
      {content}
    </a>
  )
}
