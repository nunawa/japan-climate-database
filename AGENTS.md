# nunawa/japan-climate-database

## Project Overview

This is a website that analyzes, organizes, and visualizes past weather data for Japan.

The weather data is sourced from CSV files provided by the Japan Meteorological Agency (JMA) for approximately 1300 locations, containing daily, monthly, and annual data for temperature, precipitation, and sunshine duration based on the 2020 climate normals. Additionally, Wet Bulb Globe Temperature (WBGT) data is obtained from CSV files from the Ministry of the Environment's Heatstroke Prevention Information Site, covering approximately 840 locations for the months of April through October over the past five years. This data is organized into JSON files using a Python script for easier handling.

The website references these organized JSON files to create pages that visualize temperature, precipitation, sunshine duration, and WBGT for each location. It also generates pages that visualize the annual average for each metric on a map and display a table listing the data for all locations. These pages are generated using Static Site Generation (SSG) with Vike (vite-plugin-ssr).

## Directory Structure

The `/data` directory contains large files and should not be loaded as it will consume a large amount of context.

```text
.
├── data
│   ├── processed
│   └── raw
│       ├── jma-normal
│       ├── jma-station
│       └── moe-wbgt
├── data-processing
└── web
    ├── assets
    ├── components
    ├── dist
    │   ├── client
    │   └── server
    ├── layouts
    └── pages
        ├──_error
        ├── index
        │   └── components
        ├── map
        ├── ranking
        └── station
            ├── @id
            └── index
```

## Data Fetching and Processing (/data-processing)

### Main Tech Stack

- Python
  - DuckDB
  - Requests
- uv
- Ruff

### Available Commands

```bash
uv sync                     # Install packages from the lock file
uv run main.py              # Run data processing
uv run download.py          # Run data download
uv run ruff check           # Run linter
uv run ruff check --fix     # Run linter and apply auto-fixes
uv run ruff format --check  # Run format check
uv run ruff format          # Format the code
```

## Website (/web)

### Main Tech Stack

- Node.js + TypeScript
  - React
  - Vite
  - Vike
  - Mantine
  - react-map-gl
  - MapLibre GL JS
- Biome

### Available Commands

```bash
npm install                 # Install packages
npm run dev                 # Start a development server
npm run build               # Build for production
npm run preview             # Start a preview server with the build output
npx biome lint              # Run linter
npx biome lint --write      # Run linter and apply auto-fixes
npx biome format            # Run format check
npx biome format --write    # Format the code
```
