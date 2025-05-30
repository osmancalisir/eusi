Here are the three professional README files structured for a Staff Engineer perspective:

### README
```markdown
# Orbital Edge Imaging - Core API Service

## Overview
RESTful API for satellite image catalog and order management system. Implements spatial queries using PostGIS with containerized infrastructure. Serves as the foundation for OEI's customer-facing platform.

## Backend Tech Stack
- Node.js 20 (TypeScript)
- Express 5.x
- PostgreSQL 15 + PostGIS 3.3
- Docker 24.0+
- Zod for schema validation

## Frontend Tech Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- GraphQL 16
- OpenLayers 10.x
- MUI 7.x
- React Toastify

## Prerequisites
- Docker 24.0+
- Node.js 20.x
- PostgreSQL client tools

--- Development Workflow ---
# Backend steps to run and install packages and docker
cd backend && yarn

# Start PostgreSQL container inside backend folder
docker-compose up -d db

# Apply schema migrations inside backend folder
docker-compose -f docker-compose.yml run app npm run migrate
--passport: postgres

# Start backend
yarn start

# Frontend steps
cd frontend && yarn

# Start frontend
yarn dev
```

## API Endpoints
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/images` | GET | List satellite images | `?minResolution=0.3&maxCloudCoverage=20` |
| `/api/orders` | POST | Create new order | `{ catalogId: string }` |
| `/health` | GET | System diagnostics | - |

## Testing
```bash
# Test database connection
curl http://localhost:4000/health
```

## Key Components
| Component | Responsibility |
|-----------|----------------|
| `Map` | OpenLayers integration with GeoJSON rendering |
| `GeoJsonUploadPanel` | Drag-n-drop + paste GeoJSON handling |
| `SearchResultsPanel` | Filterable image results display |
| `ThemeToggle` | Light/dark mode with system preference |

## GIS Features
- Coordinate transformation (EPSG:4326 → 3857)
- GeoJSON validation and processing
- View state persistence
- AOI boundary visualization
- Mobile-responsive map controls

## Environment Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `db` | Database hostname |
| `DB_PORT` | `5432` | Database port |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:4000` | API base URL |
| `NODE_ENV` | `development` | Runtime environment |

## Deployment Strategies
| Platform | Configuration |
|----------|---------------|
| Vercel | Automatic CI/CD from GitHub |
| GitHub Pages | Static export via `next export` |
| AWS Amplify | Managed Next.js hosting |


## frontend/.env
````
# .env.example

NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000

DB_USER=eusi
DB_HOST=localhost
DB_NAME=orbital
DB_PASSWORD=postgres
DB_PORT=5432
NODE_ENV=development
````

## backend/.env
````
DB_USER=eusi
DB_HOST=localhost
DB_NAME=orbital
DB_PASSWORD=postgres
DB_PORT=5432
NODE_ENV=development
````

## Example GeoJSON file
Please note that, you can either create a "Munich.geojson" file and import it or simply paste the code below inside the "Paste GeoJSON" modal in the app. These coordinates shows the Munich in the simplest way, where you can list the images that I put as a sample data for Munich, and can check it with ordering the images:
````
{
  "type": "Polygon",
  "coordinates": [
    [
      [11.3, 48.0],
      [11.8, 48.0],
      [11.8, 48.3],
      [11.3, 48.3],
      [11.3, 48.0]
    ]
  ]
}
````