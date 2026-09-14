/**
 * Weather Store
 * Global state management using Zustand
 */

import { create } from 'zustand';
import { WeatherData, WeatherLocation } from './weather-types';
import { Units, DEFAULT_UNITS } from './weather-utils';
import { getCityById, getAllCities } from './weather-cities';
import { weatherEngine } from './weather-engine';

export interface WeatherStoreState {
  // Current selection
  selectedLocation: WeatherLocation | null;
  selectedForecastHour: number;

  // Preferences
  units: Units;
  theme: 'light' | 'dark' | 'auto' | 'weather';
  reducedMotion: boolean;

  // Data
  weatherData: WeatherData | null;
  favorites: WeatherLocation[];
  recentSearches: string[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedLocation: (location: WeatherLocation) => void;
  setSelectedForecastHour: (hour: number) => void;
  setUnits: (units: Partial<Units>) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto' | 'weather') => void;
  setReducedMotion: (enabled: boolean) => void;
  addFavorite: (location: WeatherLocation) => void;
  removeFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  refreshWeather: () => Promise<void>;
  loadInitialData: () => Promise<void>;
}

const FAVORITES_STORAGE_KEY = 'atmos-favorites';
const RECENT_SEARCHES_STORAGE_KEY = 'atmos-recent-searches';
const UNITS_STORAGE_KEY = 'atmos-units';
const THEME_STORAGE_KEY = 'atmos-theme';

export const useWeatherStore = create<WeatherStoreState>((set, get) => ({
  // Initial state
  selectedLocation: null,
  selectedForecastHour: 0,
  units: DEFAULT_UNITS,
  theme: 'auto',
  reducedMotion: false,
  weatherData: null,
  favorites: [],
  recentSearches: [],
  isLoading: false,
  error: null,

  // Actions
  setSelectedLocation: (location) => {
    set({ selectedLocation: location, isLoading: true, error: null });

    try {
      const cityData = getCityById(location.id);
      if (cityData) {
        const weatherData = weatherEngine.generateWeatherData(location, cityData.profile);
        set({ weatherData, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load weather data',
        isLoading: false,
      });
    }
  },

  setSelectedForecastHour: (hour) => set({ selectedForecastHour: hour }),

  setUnits: (units) => {
    const currentUnits = get().units;
    const newUnits = { ...currentUnits, ...units };
    set({ units: newUnits });

    if (typeof window !== 'undefined') {
      localStorage.setItem(UNITS_STORAGE_KEY, JSON.stringify(newUnits));
    }
  },

  setTheme: (theme) => {
    set({ theme });

    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  },

  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });

    if (typeof window !== 'undefined') {
      localStorage.setItem('atmos-reduced-motion', String(reducedMotion));
    }
  },

  addFavorite: (location) => {
    const favorites = get().favorites;
    if (!favorites.some((f) => f.id === location.id)) {
      const updated = [...favorites, location];
      set({ favorites: updated });

      if (typeof window !== 'undefined') {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      }
    }
  },

  removeFavorite: (locationId) => {
    const updated = get().favorites.filter((f) => f.id !== locationId);
    set({ favorites: updated });

    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  isFavorite: (locationId) => {
    return get().favorites.some((f) => f.id === locationId);
  },

  addRecentSearch: (query) => {
    const recent = get().recentSearches;
    const updated = [query, ...recent.filter((s) => s !== query)].slice(0, 10);
    set({ recentSearches: updated });

    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    }
  },

  refreshWeather: async () => {
    const location = get().selectedLocation;
    if (!location) return;

    set({ isLoading: true, error: null });

    try {
      const cityData = getCityById(location.id);
      if (cityData) {
        const weatherData = weatherEngine.updateWeather(location, cityData.profile);
        set({ weatherData, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh weather data',
        isLoading: false,
      });
    }
  },

  loadInitialData: async () => {
    // Load from localStorage
    if (typeof window === 'undefined') return;

    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const savedRecentSearches = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    const savedUnits = localStorage.getItem(UNITS_STORAGE_KEY);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const savedReducedMotion = localStorage.getItem('atmos-reduced-motion');

    if (savedFavorites) {
      try {
        set({ favorites: JSON.parse(savedFavorites) });
      } catch (e) {
        console.error('Failed to parse saved favorites');
      }
    }

    if (savedRecentSearches) {
      try {
        set({ recentSearches: JSON.parse(savedRecentSearches) });
      } catch (e) {
        console.error('Failed to parse saved recent searches');
      }
    }

    if (savedUnits) {
      try {
        set({ units: JSON.parse(savedUnits) });
      } catch (e) {
        console.error('Failed to parse saved units');
      }
    }

    if (savedTheme) {
      set({ theme: savedTheme as any });
    }

    if (savedReducedMotion) {
      set({ reducedMotion: savedReducedMotion === 'true' });
    }

    // Load default location
    const cities = getAllCities();
    if (cities.length > 0) {
      const defaultCity = cities[0];
      const state = get();
      state.setSelectedLocation(defaultCity.location);
    }
  },
}));
