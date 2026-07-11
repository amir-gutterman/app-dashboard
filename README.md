# App Dashboard

A single page that lists all our web apps as cards with a "Launch App" button. Vite + React + TypeScript + Tailwind CSS.

## Adding a new app

Open [`src/data/apps.json`](src/data/apps.json) and append an object:

```json
{
  "id": "my-app",
  "name": "My App",
  "description": "One sentence describing what it does.",
  "image": "",
  "url": "https://my-app.example.com"
}
```

- `id` — unique, used as the React key.
- `image` — optional path or URL to a screenshot/logo. Leave `""` to get an auto-generated color placeholder with the app's initial.
- `url` — where "Launch App" sends the user.

No other code changes are needed.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```
