# Web Application

Interactive website that visualizes climate data for Japan using Static Site Generation (SSG).

## Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Vike**: SSG framework (formerly vite-plugin-ssr)
- **Vite**: Build tool and dev server
- **Mantine**: Component library and UI framework
- **MapLibre GL JS**: Map rendering engine
- **react-map-gl**: React wrapper for MapLibre
- **Recharts**: Charting library for data visualization
- **Biome**: Linter and formatter

## Features

### Station Detail Pages (`/station/:id`)

- Temperature (daily, yearly)
- Precipitation (monthly, yearly)
- Sunshine duration (monthly, yearly)
- WBGT (Wet Bulb Globe Temperature) (daily, yearly)
- Interactive charts with Recharts

### Map View (`/map`)

- Interactive map visualization
- Annual average overlays
- Location markers with popup details

### Ranking View (`/ranking`)

- Sortable data tables
- Top 10 highlights
- Compare metrics across all stations

## Directory Structure

```
web/
├── assets/              # Static assets (logo, images)
├── components/          # Shared React components
├── layouts/             # Layout components and theme
│   ├── LayoutDefault.tsx
│   └── theme.ts
├── pages/               # Vike pages (SSG)
│   ├── about/          # About page
│   ├── index/          # Home page
│   ├── map/            # Map visualization
│   ├── ranking/        # Ranking tables
│   ├── station/        # Station details
│   │   ├── @id/       # Dynamic station pages
│   │   └── index/     # Station index
│   └── _error/         # Error page
└── dist/                # Build output (git-ignored)
    └── client/         # Client-side bundle
```

## Setup

Install dependencies:

```bash
npm install
```

## Usage

### Development Server

Start local development server with hot reload:

```bash
npm run dev
```

Runs at `http://localhost:3000` by default.

### Production Build

Build static site for production:

```bash
npm run build
```

Output generated in [`dist/`](dist/).

### Preview Build

Preview production build locally:

```bash
npm run preview
```

## Development

### Linting

```bash
npx biome lint              # Check for issues
npx biome lint --write      # Auto-fix issues
```

### Formatting

```bash
npx biome format            # Check formatting
npx biome format --write    # Format code
```

## Data Source

This application reads processed JSON files from [`../data/processed/`](../data/processed/):

- `station_index.json`: Station metadata
- `daily_normal.json`: Daily climate normals
- `monthly_yearly_normal.json`: Monthly/yearly climate normals
- `daily_wbgt.json`: Daily WBGT values
- `monthly_yearly_wbgt.json`: Monthly/yearly WBGT values

See [data-processing/README.md](../data-processing/README.md) for data generation details.

## Build Configuration

- Memory limit increased to 4GB for large dataset processing
- SSG pre-renders all pages at build time
- Cloudflare Pages deployment configured via [`wrangler.jsonc`](wrangler.jsonc)
