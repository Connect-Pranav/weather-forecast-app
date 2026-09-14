# Atmos Weather

Premium interactive 3D weather forecast web application with cinematic visuals and realistic weather simulation.

## Features

🌍 **Local Weather Simulation** - No external APIs required. All weather data is generated locally using deterministic algorithms.

🎬 **Cinematic 3D Environments** - React Three Fiber-powered 3D scenes that visualize weather conditions in real-time.

📍 **13+ Cities** - Search and compare weather across major cities worldwide (Bengaluru, Mumbai, Delhi, New York, London, Tokyo, and more).

⚡ **Blazingly Fast** - Client-side only, works completely offline after initial load. Optimized for performance.

🎨 **Premium Design** - Sophisticated visual language with smooth animations and responsive layouts.

📱 **Fully Responsive** - Desktop-optimized primary experience with mobile-adapted secondary layouts.

♿ **Accessible** - WCAG AA compliant with full keyboard navigation and reduced motion support.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Strict type safety
- **Tailwind CSS** - Utility-first styling
- **Three.js + React Three Fiber** - 3D graphics
- **Zustand** - Global state management
- **Framer Motion** - Smooth animations

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd atmos-weather

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/              - Next.js pages and routes
components/       - React components
lib/weather/      - Weather simulation engine
  ├── weather-types.ts      - TypeScript types
  ├── weather-cities.ts     - City database
  ├── weather-generator.ts  - Data generation
  ├── weather-engine.ts     - Main coordinator
  ├── weather-utils.ts      - Utilities
  └── weather-store.ts      - Zustand store
```

## How It Works

### Weather Simulation Engine

The core of Atmos Weather is a **local weather simulation engine** that generates realistic weather data based on:

- **Location** (latitude, longitude, elevation, climate zone)
- **Date** (season, day of year, time of day)
- **Seeded Randomness** (reproducible results)

**Same location + date = identical weather every time.** This ensures consistency while maintaining realistic variability.

### Why No External API?

✅ **No rate limits** - Generate unlimited data
✅ **No API keys** - Nothing to expose or manage
✅ **100% offline** - Works without internet
✅ **Instant loads** - No network latency
✅ **Full control** - Customize weather generation
✅ **Privacy** - No tracking, no third parties

## Features Breakdown

### Pages

- **Home** - Current weather with 3D scene, hourly + 7-day forecast
- **Forecast** - Extended forecast view
- **Map** - Weather map visualization (coming soon)
- **Air** - Air quality index and pollutant levels
- **Astronomy** - Sunrise, sunset, moon phases
- **Favorites** - Saved locations
- **Settings** - Units, theme, accessibility options

### Metrics Displayed

- Current temperature, feels-like, high/low
- Humidity, wind speed/direction
- Visibility, pressure, UV index
- Precipitation probability
- Air quality (AQI + pollutants)
- Sunrise/sunset times
- Moon phase and illumination

### 3D Weather Visualization

Each weather condition has unique visual characteristics:

- **Sunny** - Clear sky, bright lighting, subtle clouds
- **Cloudy** - Layered clouds, diffused lighting
- **Rainy** - Dense rain particles, wet atmosphere
- **Stormy** - Heavy rain, dark clouds, occasional lightning
- **Snowy** - Snow particles, cool lighting
- **Foggy** - Volumetric fog, reduced visibility
- **Night** - Starfield, moon, dark environment
- **Sunset** - Warm colors, atmospheric glow

## Customization

### Add a New City

Edit `lib/weather/weather-cities.ts`:

```typescript
amsterdam: {
  location: {
    id: 'amsterdam',
    name: 'Amsterdam',
    region: 'North Holland',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    elevation: -2,
    timezone: 'Europe/Amsterdam',
  },
  profile: {
    latitude: 52.3676,
    longitude: 4.9041,
    elevation: -2,
    climate: 'temperate',
    winterTemp: 3,
    summerTemp: 17,
  },
}
```

### Change Unit Defaults

Edit `lib/weather/weather-utils.ts`:

```typescript
export const DEFAULT_UNITS: Units = {
  temperature: 'fahrenheit',  // or 'celsius'
  speed: 'mph',              // or 'kmh', 'ms'
  distance: 'mi',            // or 'km'
  pressure: 'inhg',          // or 'hpa'
};
```

### Adjust Theme Colors

Edit `tailwind.config.js` to modify the color palette.

## Performance

- **Code Splitting** - Each page lazy-loads only required code
- **3D Optimization** - Particles use GPU instancing, reduced LOD for low-end devices
- **State Management** - Zustand with selective subscriptions
- **Image Optimization** - Next.js auto-optimizes assets
- **Caching** - 5-minute weather data cache per location

## Accessibility

- ✅ Semantic HTML and ARIA labels
- ✅ Keyboard navigation throughout
- ✅ Focus-visible states
- ✅ `prefers-reduced-motion` respected
- ✅ Color contrast WCAG AA compliant
- ✅ Screen reader friendly

## Development

### Linting & Type Checking

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript strict mode
```

### Testing

Manually test:
- Different weather conditions
- City search and favorites
- Unit switching
- Theme switching
- Responsive breakpoints (375px, 768px, 1024px, 1440px)
- Keyboard navigation
- Reduced motion mode

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## License

Created as a premium weather application demonstration.

## Credits

- Weather simulation algorithm and UI/UX design
- 3D visualization using Three.js and React Three Fiber
- Typography and color system inspired by premium products
- Icons from Lucide React

---

**Version:** 1.0.0  
**Last Updated:** 2026-09-15

For detailed development documentation, see [CLAUDE.md](./CLAUDE.md)
