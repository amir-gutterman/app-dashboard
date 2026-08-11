import { ICONS } from '../icons'
import type { AppEntry } from '../types'

export const AVATAR_COLORS = {
  violet: 'from-violet-500 to-fuchsia-500',
  sky: 'from-sky-500 to-cyan-400',
  amber: 'from-amber-500 to-orange-500',
  emerald: 'from-emerald-500 to-teal-400',
  rose: 'from-rose-500 to-pink-500',
  indigo: 'from-indigo-500 to-blue-500',
} as const

export type AvatarColor = keyof typeof AVATAR_COLORS

export const AVATAR_COLOR_KEYS = Object.keys(AVATAR_COLORS) as AvatarColor[]

// Deterministic fallback so apps without an explicit color still look distinct and stable.
function autoColorFor(id: string): AvatarColor {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return AVATAR_COLOR_KEYS[hash % AVATAR_COLOR_KEYS.length]
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
  const gradient = AVATAR_COLORS[app.color ?? autoColorFor(app.id)]

  return (
    <div className={`shrink-0 overflow-hidden ${rounded} ${className}`}>
      {imageIsUrl ? (
        <img src={app.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
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
