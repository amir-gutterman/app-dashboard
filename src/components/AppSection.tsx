import { useState, type ReactNode } from 'react'
import type { AppEntry } from '../types'
import type { ViewMode } from '../lib/useViewMode'

interface Props {
  title: string
  apps: AppEntry[]
  renderItem: (app: AppEntry) => ReactNode
  layout: ViewMode
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const LAYOUT_CLASS: Record<ViewMode, string> = {
  list: 'flex flex-col gap-0.5',
  grid: 'grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8',
  card: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
}

export default function AppSection({
  title,
  apps,
  renderItem,
  layout,
  collapsible = false,
  defaultCollapsed = false,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  if (apps.length === 0) return null

  const heading = (
    <>
      <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
        {title}
      </span>
      <span className="text-xs text-neutral-300 dark:text-neutral-600">{apps.length}</span>
      {collapsible && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`ml-auto h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
            collapsed ? '-rotate-90' : ''
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </>
  )

  return (
    <section className="mb-1">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full cursor-pointer items-center gap-1.5 px-1 py-1.5 text-left"
        >
          {heading}
        </button>
      ) : (
        <div className="flex items-center gap-1.5 px-1 py-1.5">{heading}</div>
      )}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={LAYOUT_CLASS[layout]}>
            {apps.map((app) => (
              <div key={app.id} className="contents">
                {renderItem(app)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
