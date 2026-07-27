import { useState } from 'react'
import type { AppEntry } from '../types'

interface Props {
  onImport: (entries: AppEntry[]) => void
  onClose: () => void
}

export default function ImportDialog({ onImport, onClose }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleImport() {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('That is not valid JSON.')
      return
    }
    if (!Array.isArray(parsed)) {
      setError('Expected a JSON array of app entries.')
      return
    }
    for (const entry of parsed) {
      if (
        typeof entry !== 'object' ||
        entry === null ||
        typeof entry.id !== 'string' ||
        typeof entry.name !== 'string' ||
        typeof entry.url !== 'string'
      ) {
        setError('Each entry needs at least "id", "name", and "url" strings.')
        return
      }
    }
    onImport(parsed as AppEntry[])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Import JSON</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Paste an array of app entries (e.g. from Export JSON). Matching ids get updated, new ids get added.
        </p>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setError('')
          }}
          rows={8}
          placeholder='[{"id": "my-app", "name": "My App", "url": "https://..."}]'
          className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-xs focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}
