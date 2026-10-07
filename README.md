# Checklist de Viagem & Trilha

Interactive packing checklist (React + Vite). Check items off, filter by trip
type (Trilha / Viagem) or obligation, search, and track progress. State is
saved in the browser via `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy

### Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com → New Project → import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Deploy. Done.

### Netlify
- New site from Git → build command `npm run build`, publish directory `dist`.

### GitHub Pages
1. In `vite.config.js` set `base: '/YOUR_REPO_NAME/'`.
2. `npm run build`, then publish the `dist/` folder to the `gh-pages` branch
   (e.g. with the `gh-pages` npm package or a GitHub Action).

## Editing the list

All items live in the `SECTIONS` array at the top of `src/App.jsx`.
Each item is `["Nome", "T" | "V" | "T-V", true|false]`
where the last value is `true` for obrigatório, `false` for opcional.
