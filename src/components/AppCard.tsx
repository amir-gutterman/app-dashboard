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

export default function AppCard({ app }: { app: AppEntry }) {
  const initial = app.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
      <div className="aspect-video w-full">
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
            <span className="text-5xl font-bold text-white/90">{initial}</span>
          </div>
        )}
      </div>

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
