/**
 * Weather Utilities
 * Unit conversion, formatting, and helper functions
 */

import { WeatherCondition } from './weather-types';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type DistanceUnit = 'km' | 'mi';
export type PressureUnit = 'hpa' | 'inhg';

export interface Units {
  temperature: TemperatureUnit;
  speed: SpeedUnit;
  distance: DistanceUnit;
  pressure: PressureUnit;
}

export const DEFAULT_UNITS: Units = {
  temperature: 'celsius',
  speed: 'kmh',
  distance: 'km',
  pressure: 'hpa',
};

/**
 * Convert temperature between units
 */
export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return value;

  if (from === 'celsius' && to === 'fahrenheit') {
    return (value * 9) / 5 + 32;
  } else if (from === 'fahrenheit' && to === 'celsius') {
    return ((value - 32) * 5) / 9;
  }

  return value;
}

/**
 * Convert speed between units
 */
export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  if (from === to) return value;

  // Convert to m/s first
  let ms = value;
  if (from === 'kmh') ms = value / 3.6;
  else if (from === 'mph') ms = value / 2.237;

  // Convert from m/s to target
  if (to === 'kmh') return ms * 3.6;
  if (to === 'mph') return ms * 2.237;
  return ms;
}

/**
 * Convert distance between units
 */
export function convertDistance(value: number, from: DistanceUnit, to: DistanceUnit): number {
  if (from === to) return value;

  if (from === 'km' && to === 'mi') {
    return value * 0.621371;
  } else if (from === 'mi' && to === 'km') {
    return value / 0.621371;
  }

  return value;
}

/**
 * Convert pressure between units
 */
export function convertPressure(value: number, from: PressureUnit, to: PressureUnit): number {
  if (from === to) return value;

  if (from === 'hpa' && to === 'inhg') {
    return value * 0.02953;
  } else if (from === 'inhg' && to === 'hpa') {
    return value / 0.02953;
  }

  return value;
}

/**
 * Get weather icon name
 */
export function getWeatherIcon(condition: WeatherCondition): string {
  const iconMap: Record<WeatherCondition, string> = {
    sunny: 'Sun',
    partly_cloudy: 'Cloud',
    cloudy: 'CloudDrizzle',
    overcast: 'CloudRain',
    rain: 'CloudRain',
    heavy_rain: 'CloudRain',
    thunderstorm: 'CloudLightning',
    fog: 'CloudFog',
    snow: 'CloudSnow',
    clear_night: 'Moon',
    cloudy_night: 'Cloud',
    sunset: 'Sun',
  };

  return iconMap[condition] || 'Cloud';
}

/**
 * Get weather description
 */
export function getWeatherDescription(condition: WeatherCondition): string {
  const descriptions: Record<WeatherCondition, string> = {
    sunny: 'Sunny',
    partly_cloudy: 'Partly Cloudy',
    cloudy: 'Cloudy',
    overcast: 'Overcast',
    rain: 'Rainy',
    heavy_rain: 'Heavy Rain',
    thunderstorm: 'Thunderstorm',
    fog: 'Foggy',
    snow: 'Snowy',
    clear_night: 'Clear Night',
    cloudy_night: 'Cloudy Night',
    sunset: 'Sunset',
  };

  return descriptions[condition] || 'Unknown';
}

/**
 * Get AQI description
 */
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Get AQI color
 */
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981'; // Green
  if (aqi <= 100) return '#f59e0b'; // Yellow
  if (aqi <= 150) return '#f97316'; // Orange
  if (aqi <= 200) return '#ef4444'; // Red
  if (aqi <= 300) return '#8b5cf6'; // Purple
  return '#7c2d12'; // Maroon
}

/**
 * Get moon phase name
 */
export function getMoonPhaseName(phase: number): string {
  const phases = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ];

  const index = Math.round(phase * 8) % 8;
  return phases[index];
}

/**
 * Format temperature with unit
 */
export function formatTemperature(value: number, unit: TemperatureUnit = 'celsius', decimals: number = 0): string {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${value.toFixed(decimals)}${symbol}`;
}

/**
 * Format speed with unit
 */
export function formatSpeed(value: number, unit: SpeedUnit = 'kmh', decimals: number = 1): string {
  const labels: Record<SpeedUnit, string> = {
    kmh: 'km/h',
    mph: 'mph',
    ms: 'm/s',
  };

  return `${value.toFixed(decimals)} ${labels[unit]}`;
}

/**
 * Format distance with unit
 */
export function formatDistance(value: number, unit: DistanceUnit = 'km', decimals: number = 1): string {
  const labels: Record<DistanceUnit, string> = {
    km: 'km',
    mi: 'mi',
  };

  return `${value.toFixed(decimals)} ${labels[unit]}`;
}

/**
 * Format pressure with unit
 */
export function formatPressure(value: number, unit: PressureUnit = 'hpa', decimals: number = 0): string {
  const labels: Record<PressureUnit, string> = {
    hpa: 'hPa',
    inhg: 'inHg',
  };

  return `${value.toFixed(decimals)} ${labels[unit]}`;
}

/**
 * Get temperature color for gradient
 */
export function getTemperatureColor(temp: number, high: number, low: number): string {
  const normalized = (temp - low) / (high - low);

  if (normalized < 0.2) return '#3b82f6'; // Cold - Blue
  if (normalized < 0.4) return '#06b6d4'; // Cool - Cyan
  if (normalized < 0.6) return '#10b981'; // Mild - Green
  if (normalized < 0.8) return '#f59e0b'; // Warm - Amber
  return '#ef4444'; // Hot - Red
}

/**
 * Check if night time
 */
export function isNightTime(hour: number): boolean {
  return hour < 6 || hour > 20;
}

/**
 * Format time to 12-hour or 24-hour
 */
export function formatHour(hour: number, is24Hour: boolean = false): string {
  if (is24Hour) {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
}

/**
 * Get wind direction abbreviation from degrees
 */
export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Calculate UV index intensity
 */
export function getUVIntensity(uvIndex: number): string {
  if (uvIndex < 3) return 'Low';
  if (uvIndex < 6) return 'Moderate';
  if (uvIndex < 8) return 'High';
  if (uvIndex < 11) return 'Very High';
  return 'Extreme';
}

/**
 * Calculate UV index color
 */
export function getUVColor(uvIndex: number): string {
  if (uvIndex < 3) return '#10b981';
  if (uvIndex < 6) return '#f59e0b';
  if (uvIndex < 8) return '#ef4444';
  if (uvIndex < 11) return '#8b5cf6';
  return '#7c2d12';
}
