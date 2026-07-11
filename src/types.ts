export interface AppEntry {
  id: string
  name: string
  description: string
  /** Path or URL to a screenshot/logo. Leave empty to fall back to a generated placeholder. */
  image: string
  url: string
}
