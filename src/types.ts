import type { IconKey } from './icons'

export interface AppEntry {
  id: string
  name: string
  description: string
  /** Path or URL to a screenshot/logo. Takes priority over `icon` when set. */
  image: string
  /** Built-in vector icon shown when `image` is empty. Falls back to the name's initial when unset. */
  icon?: IconKey
  url: string
}
