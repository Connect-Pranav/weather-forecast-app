# Atmos Weather - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```bash
npm install && npm run dev
# Open http://localhost:3000
```

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page, main dashboard |
| `lib/weather/weather-engine.ts` | Core weather data generator |
| `lib/weather/weather-cities.ts` | City database and search |
| `components/weather/WeatherHero.tsx` | Main weather display |
| `components/three/WeatherScene.tsx` | 3D visualization |
| `lib/weather/weather-store.ts` | Global state (Zustand) |

## 🎨 Design System Quick Reference

### Colors (Tailwind)
- Primary: `bg-blue-500` / `text-blue-500`
- Secondary: `bg-cyan-500` / `text-cyan-500`
- Success: `bg-green-500` / `text-green-500`
- Warning: `bg-amber-500` / `text-amber-500`
- Error: `bg-red-500` / `text-red-500`
- Neutral: `bg-atmosphere-{50-950}` (grayscale)

### Components
```tsx
// Card
<div className="card p-6"> Content </div>

// Button
<button className="button button-primary">Click</button>

// Input
<input className="input" />

// Badge
<span className="badge badge-primary">Label</span>
```

## 🌡️ Adding a Weather Feature

### 1. Add to Types
```typescript
// lib/weather/weather-types.ts
export interface NewFeature {
  value: number;
  unit: string;
}
```

### 2. Generate Data
```typescript
// lib/weather/weather-generator.ts
export function generateNewFeature(...): NewFeature {
  // Implementation
}
```

### 3. Display Data
```tsx
// components/weather/MyComponent.tsx
export default function MyComponent() {
  const { weatherData } = useWeatherStore();
  return <div>{weatherData.newFeature.value}</div>;
}
```

## 🌍 Adding a City

Edit `lib/weather/weather-cities.ts`:

```typescript
paris: {
  location: { /* ... */ },
  profile: {
    climate: 'temperate',
    winterTemp: 3,
    summerTemp: 16,
  }
}
```

Then add to `getAllCities()` return if not in WEATHER_CITIES.

## 📊 Common Patterns

### Use Zustand Store
```tsx
const { weatherData, units, setUnits } = useWeatherStore();
```

### Unit Conversion
```typescript
import { convertTemperature, formatTemperature } from '@/lib/weather/weather-utils';

const fahrenheit = convertTemperature(celsius, 'celsius', 'fahrenheit');
const display = formatTemperature(celsius, 'celsius');
```

### Lazy Load 3D Component
```tsx
const Scene3D = dynamic(() => import('@/components/three/Scene'), {
  loading: () => <Loader />,
  ssr: false,
});
```

### Format Weather Description
```typescript
import { getWeatherDescription, getWeatherIcon } from '@/lib/weather/weather-utils';

const description = getWeatherDescription(condition); // "Rainy"
const icon = getWeatherIcon(condition); // "CloudRain"
```

## 🔍 Debugging

### Check Weather Data
```tsx
const { weatherData } = useWeatherStore();
console.log(weatherData);
```

### Test Weather Generation
```typescript
import { weatherEngine } from '@/lib/weather/weather-engine';
import { getCityById } from '@/lib/weather/weather-cities';

const city = getCityById('bengaluru');
const weather = weatherEngine.generateWeatherData(city.location, city.profile);
console.log(weather);
```

### Check Type Errors
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

## 🎯 Common Tasks

### Change Default Temperature Unit
`lib/weather/weather-utils.ts` → `DEFAULT_UNITS.temperature`

### Adjust Animation Speed
`tailwind.config.js` → `animation` section

### Modify 3D Scene
`components/three/WeatherScene.tsx` → `skyConfig` object

### Update Color Palette
`tailwind.config.js` → `colors` section

### Add New Route
1. Create `app/new-page/page.tsx`
2. Import `Navigation` component
3. Use `useWeatherStore()` hook

## 🚨 Do NOT

❌ Call external weather APIs
❌ Hardcode city data (add to database)
❌ Use `localStorage` in 3D components
❌ Commit `.env.local`
❌ Remove TypeScript strict mode
❌ Create components >300 lines
❌ Use `any` type

## ✅ DO

✅ Use Zustand for global state
✅ Keep components small and focused
✅ Use TypeScript types everywhere
✅ Test on mobile viewport
✅ Respect `prefers-reduced-motion`
✅ Use semantic HTML
✅ Lazy-load heavy 3D components
✅ Write self-documenting code

## 🧪 Testing

### Manual Checklist
- [ ] Search works
- [ ] City switching works
- [ ] Units convert correctly
- [ ] Theme switches properly
- [ ] Mobile layout responsive
- [ ] 3D scene loads
- [ ] No console errors
- [ ] localStorage persists
- [ ] Keyboard nav works
- [ ] Focus states visible

### Automated
```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run build       # Build check
```

## 📦 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel

# Deploy anywhere
npm run build && npm start
```

## 🔗 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Zustand](https://github.com/pmndrs/zustand)

## 📞 Troubleshooting

### "Module not found"
Check import path uses `@/` alias. Verify file exists.

### "3D scene not rendering"
Check browser console for WebGL errors. Verify GPU support.

### "Weather data not loading"
Verify city ID is in `WEATHER_CITIES`. Check Zustand store initialization.

### "Styles not applying"
Run `npm run dev` (CSS needs rebuild). Check class names match Tailwind.

### "Type errors"
Run `npm run type-check`. Ensure all functions have return types.

---

**Last Updated:** 2026-09-15
**Quick Ref Version:** 1.0
