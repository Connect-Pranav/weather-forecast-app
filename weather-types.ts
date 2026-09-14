/**
 * Weather Engine Types
 * Comprehensive type definitions for the weather simulation system
 */

export type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'fog'
  | 'snow'
  | 'clear_night'
  | 'cloudy_night'
  | 'sunset';

export interface TemperatureData {
  current: number;
  feelsLike: number;
  high: number;
  low: number;
  dewPoint: number;
}

export interface WindData {
  speed: number;
  gust: number;
  direction: number;
  directionLabel: string;
}

export interface CurrentWeather {
  condition: WeatherCondition;
  temperature: TemperatureData;
  humidity: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  windData: WindData;
  precipitation: number;
  cloudCover: number;
  timestamp: number;
}

export interface HourlyForecast extends CurrentWeather {
  hour: number;
  precipitationProbability: number;
}

export interface DailyForecast {
  date: Date;
  condition: WeatherCondition;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitationProbability: number;
  sunrise: Date;
  sunset: Date;
  dayLength: number;
}

export interface MoonData {
  phase: number;
  illumination: number;
  rise: Date;
  set: Date;
}

export interface AstronomyData {
  sunrise: Date;
  sunset: Date;
  dayLength: number;
  solarNoon: Date;
  moonData: MoonData;
}

export interface AQIData {
  aqi: number;
  category: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  co: number;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'thunderstorm' | 'heat' | 'cold' | 'wind' | 'fog' | 'air_quality';
  severity: 'advisory' | 'warning' | 'watch';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface WeatherLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  isFavorite?: boolean;
}

export interface WeatherData {
  location: WeatherLocation;
  currentWeather: CurrentWeather;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  astronomy: AstronomyData;
  aqi: AQIData;
  alerts: WeatherAlert[];
  lastUpdated: number;
}

export interface CityProfile {
  latitude: number;
  longitude: number;
  elevation: number;
  climate: 'tropical' | 'subtropical' | 'temperate' | 'continental' | 'polar';
  winterTemp: number;
  summerTemp: number;
}
