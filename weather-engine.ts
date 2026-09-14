/**
 * Weather Engine
 * Main coordinator for weather data generation and management
 */

import {
  WeatherData,
  WeatherLocation,
  CityProfile,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AstronomyData,
  AQIData,
  WeatherAlert,
} from './weather-types';
import {
  generateCurrentWeather,
  generateHourlyForecast,
  generateDailyForecast,
  generateAstronomyData,
  generateAQIData,
  generateWeatherAlerts,
} from './weather-generator';

export class WeatherEngine {
  private cache: Map<string, WeatherData> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate complete weather data for a location
   */
  generateWeatherData(location: WeatherLocation, profile: CityProfile, date: Date = new Date()): WeatherData {
    const cacheKey = `${location.id}-${Math.floor(date.getTime() / this.CACHE_DURATION)}`;

    // Return cached data if available
    if (this.cache.has(cacheKey) && (this.cacheExpiry.get(cacheKey) ?? 0) > date.getTime()) {
      return this.cache.get(cacheKey)!;
    }

    // Generate fresh data
    const currentWeather = generateCurrentWeather(location, profile, date);
    const hourlyForecast = generateHourlyForecast(location, profile, date);
    const dailyForecast = generateDailyForecast(location, profile, date);
    const astronomy = generateAstronomyData(location, date);
    const aqi = generateAQIData(currentWeather.condition, this.createRandomizer(location.latitude, location.longitude, date));
    const alerts = generateWeatherAlerts(currentWeather.condition, date);

    const weatherData: WeatherData = {
      location,
      currentWeather,
      hourlyForecast,
      dailyForecast,
      astronomy,
      aqi,
      alerts,
      lastUpdated: date.getTime(),
    };

    // Cache the data
    this.cache.set(cacheKey, weatherData);
    this.cacheExpiry.set(cacheKey, date.getTime() + this.CACHE_DURATION);

    return weatherData;
  }

  /**
   * Update weather for location
   */
  updateWeather(location: WeatherLocation, profile: CityProfile, date: Date = new Date()): WeatherData {
    // Clear cache for this location to force refresh
    const keys = Array.from(this.cache.keys()).filter((k) => k.startsWith(location.id));
    keys.forEach((k) => {
      this.cache.delete(k);
      this.cacheExpiry.delete(k);
    });

    return this.generateWeatherData(location, profile, date);
  }

  /**
   * Create a randomizer instance for consistent results
   */
  private createRandomizer(latitude: number, longitude: number, date: Date) {
    const day = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    const seed = Math.abs(Math.sin(latitude + longitude + day) * 10000) | 0;
    return new SeededRandom(seed);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

/**
 * Seeded Random Number Generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  integer(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

// Singleton instance
export const weatherEngine = new WeatherEngine();
