import { useState } from 'react'
import type { ViewMode } from '../lib/useViewMode'

interface Props {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onExport: () => void
  onImportClick: () => void
  exportLabel: string
}

const VIEW_OPTIONS: { mode: ViewMode; label: string }[] = [
  { mode: 'list', label: 'Compact List' },
  { mode: 'grid', label: 'Grid' },
  { mode: 'card', label: 'Card' },
]

export default function OverflowMenu({
  viewMode,
  onViewModeChange,
  onExport,
  onImportClick,
  exportLabel,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More actions"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
              View
            </div>
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  onViewModeChange(opt.mode)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                {opt.label}
                {viewMode === opt.mode && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
            <button
              type="button"
              onClick={onExport}
              className="flex w-full items-center px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {exportLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onImportClick()
                setOpen(false)
              }}
              className="flex w-full items-center px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Import JSON…
            </button>
          </div>
        </>
      )}
    </div>
  )
}
