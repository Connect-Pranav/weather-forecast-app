# Atmos Weather - Development Guide

## Project Overview

Atmos Weather is a premium, production-quality weather forecast web application featuring immersive 3D weather environments, realistic weather simulation, and cinematic visual design. The application is entirely client-side powered by a local weather simulation engine—no external weather APIs are required.

## Architecture Principles

### No External Weather API
- **All weather data is generated locally** using a deterministic seeded random number generator
- Same location + date = identical weather (reproducible results)
- Offline-first: the application works completely without network access after initial load
- No API keys, no rate limits, no third-party dependencies

### Design System
- Premium, sophisticated visual language
- Cinematic 3D environments that react to weather conditions
- Strong visual hierarchy and intentional UI composition
- Responsive design: desktop-optimized primary experience, mobile-adapted secondary
- Smooth, deliberate animations respecting `prefers-reduced-motion`

### Performance First
- Lazy-load 3D scenes to prevent blocking initial render
- GPU-friendly particle systems with fallback for low-end devices
- React memoization and Zustand for efficient state management
- Code splitting and dynamic imports throughout

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom color system
- **3D Graphics:** Three.js + React Three Fiber + drei
- **Animation:** Framer Motion
- **State Management:** Zustand
- **Charts:** Recharts (future integration)
- **Icons:** Lucide React
- **Date/Time:** date-fns
- **Utilities:** clsx

## Directory Structure

```
atmos-weather/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home / Dashboard
│   ├── globals.css              # Global styles
│   ├── forecast/page.tsx        # 7-day forecast view
│   ├── map/page.tsx             # Weather map
│   ├── air/page.tsx             # Air quality
│   ├── astronomy/page.tsx       # Astronomy data
│   ├── favorites/page.tsx       # Saved locations
│   └── settings/page.tsx        # User preferences
│
├── components/
│   ├── navigation/
│   │   └── Navigation.tsx       # Top nav with search
│   ├── search/
│   │   └── LocationSearch.tsx   # City search
│   ├── weather/
│   │   ├── WeatherHero.tsx      # Main weather display
│   │   ├── WeatherDetails.tsx   # Detailed metrics + AQI
│   │   └── WeatherScene.tsx     # 3D scene placeholder
│   ├── forecast/
│   │   ├── HourlyForecast.tsx   # 24-hour forecast
│   │   └── DailyForecast.tsx    # 7-day forecast
│   └── three/
│       └── WeatherScene.tsx     # Three.js/R3F scene
│
├── lib/
│   └── weather/
│       ├── weather-types.ts     # TypeScript types
│       ├── weather-cities.ts    # City data & search
│       ├── weather-generator.ts # Data generation algorithm
│       ├── weather-engine.ts    # Main coordinator
│       ├── weather-utils.ts     # Unit conversion + formatting
│       └── weather-store.ts     # Zustand store
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── CLAUDE.md                    # This file
```

## Weather Engine

### How It Works

1. **Seeded Randomness:** Weather is generated using a deterministic seeded RNG based on:
   - Location (latitude/longitude)
   - Date (day of year)
   - This ensures reproducibility

2. **Weather Conditions:** 11 states
   - sunny, partly_cloudy, cloudy, overcast
   - rain, heavy_rain, thunderstorm
   - fog, snow
   - clear_night, cloudy_night, sunset

3. **Realistic Simulation:**
   - Temperature varies by latitude, elevation, season, time of day, and weather condition
   - Wind scales with weather intensity
   - Humidity, visibility, pressure, UV index all generated contextually
   - Sunrise/sunset calculated from latitude and date
   - Moon phases calculated from known astronomical data

4. **Performance:**
   - 5-minute cache duration per location
   - No heavy computations on each render
   - Lazy caching that respects memory

### Adding a New City

Edit `lib/weather/weather-cities.ts` and add an entry to `WEATHER_CITIES`:

```typescript
new_city: {
  location: {
    id: 'new_city',
    name: 'City Name',
    region: 'Region',
    country: 'Country',
    latitude: 0.0,
    longitude: 0.0,
    elevation: 0,
    timezone: 'Continent/City',
  },
  profile: {
    latitude: 0.0,
    longitude: 0.0,
    elevation: 0,
    climate: 'temperate', // tropical, subtropical, temperate, continental, polar
    winterTemp: 10,       // Typical winter temperature
    summerTemp: 25,       // Typical summer temperature
  },
}
```

## Design System

### Color Palette

- **Primary:** Blue (#3b82f6) - Primary actions, highlights
- **Secondary:** Cyan (#06b6d4) - Secondary accents
- **Accent:** Amber (#f59e0b) - Warnings, important info
- **Success:** Green (#10b981) - Positive states
- **Error:** Red (#ef4444) - Errors, high severity
- **Atmosphere:** 50-950 scale - Grayscale for backgrounds and text

### Typography

- **Display Large:** 3.5rem (bold headlines)
- **Display Medium:** 2.5rem
- **Display Small:** 2rem
- **Heading Large:** 1.875rem (section titles)
- **Body Large:** 1.125rem
- **Body Medium:** 1rem (default)
- **Body Small:** 0.875rem
- **Caption:** 0.75rem

### Components

All components use Tailwind utilities with custom color variables. Key classes:

- `.card` - Surface with border and hover effect
- `.button` - Flexible button utility (primary, secondary, ghost variants)
- `.input` - Form input styling
- `.badge` - Small labeled component
- `.glass` - Glass-morphism effect
- `.gradient-text` - Gradient text color

## State Management (Zustand)

The `useWeatherStore` manages:

```typescript
{
  selectedLocation: WeatherLocation | null,
  selectedForecastHour: number,
  units: Units,
  theme: 'light' | 'dark' | 'auto' | 'weather',
  reducedMotion: boolean,
  weatherData: WeatherData | null,
  favorites: WeatherLocation[],
  recentSearches: string[],
  isLoading: boolean,
  error: string | null,
  // + actions
}
```

Data persists to `localStorage`.

## 3D Weather Scene

### Architecture

- Uses React Three Fiber for declarative 3D
- Suspense boundaries for lazy loading
- OrbitControls for user interaction (disabled zoom/pan, auto-rotate)
- Weather-reactive sky configuration
- Particle systems for rain/snow (disabled on low-end devices)
- Respects `prefers-reduced-motion`

### Weather-Specific Visuals

Each weather condition has a unique sky, lighting, fog, and particle configuration. See `WeatherScene.tsx` for the `skyConfig` object.

## Performance Guidelines

1. **Use `dynamic()` for 3D scenes**
   ```typescript
   const WeatherScene3D = dynamic(() => import('@/components/three/WeatherScene'), {
     loading: () => <Loader />,
     ssr: false,
   });
   ```

2. **Memoize expensive computations**
   ```typescript
   const results = useMemo(() => searchCities(query), [query]);
   ```

3. **Lazy load routes**
   - Each page route is automatically code-split by Next.js

4. **Optimize 3D**
   - Use BufferGeometry
   - Instance particles instead of individual meshes
   - Adjust particle count based on device performance

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation fully supported
- Focus visible states on all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Supports `prefers-reduced-motion` - animations disabled, transitions minimized
- All text has appropriate semantic meaning

## Testing

### Manual Testing Checklist

- [ ] Load app, verify home page renders
- [ ] Search for a city, verify results
- [ ] Select a city, verify weather data loads
- [ ] Check all metrics display correctly
- [ ] Test unit switching (Celsius ↔ Fahrenheit, etc.)
- [ ] Test theme switching
- [ ] Add/remove favorites
- [ ] Check responsive design on mobile (375px viewport)
- [ ] Verify 3D scene loads without blocking UI
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify all pages load (forecast, map, air, astronomy, settings)
- [ ] Test keyboard navigation and focus states
- [ ] Verify localStorage persistence across page reloads

### Build Verification

```bash
npm run lint       # TypeScript and ESLint
npm run build      # Next.js production build
npm run type-check # Strict type checking
```

## Development Workflow

1. **Local development**
   ```bash
   npm install
   npm run dev
   # App runs on http://localhost:3000
   ```

2. **Type checking**
   ```bash
   npm run type-check
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

4. **Production build**
   ```bash
   npm run build
   npm start
   ```

## Important Rules

### Do NOT:
- Call external weather APIs (OpenWeather, WeatherAPI, etc.)
- Use `localStorage` in 3D components (may break rendering)
- Make HTTP requests to third-party weather services
- Hardcode API keys anywhere
- Use `any` type in TypeScript
- Create giant monolithic components (keep components <300 lines)

### Do:
- Use the local weather engine for all data
- Keep weather generation deterministic
- Test all UI changes on mobile viewports
- Respect `prefers-reduced-motion`
- Use semantic HTML
- Write clear variable/function names
- Add TypeScript types to all functions
- Use Zustand for global state, local useState for component state
- Lazy-load heavy 3D components

## Future Enhancements

- Interactive weather map with precipitation/cloud layers
- 3D globe with city markers
- Radar visualization with storm tracking
- Weather alerts with push notifications
- Astronomy calculator with satellite tracking
- Historical weather data viewer
- Multi-location comparison
- Weather timeline scrubber
- Advanced charts (Recharts integration)

## Deployment

- **Vercel:** `vercel` (recommended for Next.js)
- **Docker:** Containerize with `npm run build && npm start`
- **Static Export:** `npm run build` produces static files in `.next`

The app is 100% client-side after initial HTML/JS download, so any static host works.

---

**Last Updated:** 2026-09-15
**Version:** 1.0.0
