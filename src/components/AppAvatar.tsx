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

// A URL/path starts with a scheme or a slash; anything else typed into the
// image field (e.g. an emoji) is rendered as large text instead of <img>.
export function isImageUrl(value: string) {
  return /^(https?:\/\/|\/|data:|\.\/|\.\.\/)/.test(value)
}

interface Props {
  app: AppEntry
  className?: string
  textClassName?: string
  rounded?: string
}

export default function AppAvatar({
  app,
  className = 'h-11 w-11',
  textClassName = 'text-lg',
  rounded = 'rounded-xl',
}: Props) {
  const initial = app.name.trim().charAt(0).toUpperCase() || '?'
  const Icon = app.icon ? ICONS[app.icon] : null
  const imageIsUrl = app.image && isImageUrl(app.image)

  return (
    <div className={`shrink-0 overflow-hidden ${rounded} ${className}`}>
      {imageIsUrl ? (
        <img src={app.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientFor(app.id)}`}
        >
          {app.image ? (
            <span className={textClassName}>{app.image}</span>
          ) : Icon ? (
            <Icon className="h-[55%] w-[55%] text-white/90" />
          ) : (
            <span className={`${textClassName} font-bold text-white/90`}>{initial}</span>
          )}
        </div>
      )}
    </div>
  )
}
