/**
 * Weather Generator
 * Deterministic weather simulation engine
 * Uses seeded randomness for consistent results
 */

import {
  WeatherCondition,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AstronomyData,
  AQIData,
  WeatherAlert,
  TemperatureData,
  WindData,
  MoonData,
  CityProfile,
  WeatherLocation,
} from './weather-types';

/**
 * Seeded random number generator
 * Ensures consistent weather for same seed/location/time
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

/**
 * Generate deterministic seed from location and date
 */
function generateSeed(latitude: number, longitude: number, date: Date): number {
  const day = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return Math.abs(Math.sin(latitude + longitude + day) * 10000) | 0;
}

/**
 * Calculate moon phase and illumination
 */
function calculateMoonData(date: Date): MoonData {
  const knownNewMoon = new Date(2000, 0, 6);
  const lunarCycle = 29.53058867;
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  const riseOffset = Math.sin(phase * Math.PI * 2) * 60;
  const setOffset = Math.cos(phase * Math.PI * 2) * 60;

  const rise = new Date(date);
  rise.setMinutes(rise.getMinutes() + 360 + riseOffset);

  const set = new Date(date);
  set.setMinutes(set.getMinutes() + 1080 + setOffset);

  return { phase, illumination, rise, set };
}

/**
 * Calculate sunrise and sunset
 */
function calculateSunriseSunset(latitude: number, date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const latitude_rad = (latitude * Math.PI) / 180;

  const J2000 = 2451545;
  const JD = J2000 + dayOfYear + (date.getHours() - 12) / 24;
  const n = JD - 2451545.0;
  const J = n / 36525.0;

  const M = 357.52910833 + 35999.0502833 * J;
  const M_rad = (M * Math.PI) / 180;
  const epsilon = 23.439291 - 0.0130042 * J;
  const epsilon_rad = (epsilon * Math.PI) / 180;

  const L0 = 280.46646 + 36000.76983 * J;
  const e = 0.016708634 - 0.000042037 * J;

  const C =
    (1.914602 - 0.004817 * J - 0.000014 * J * J) * Math.sin(M_rad) +
    (0.019993 - 0.000101 * J) * Math.sin(2 * M_rad) +
    0.000029 * Math.sin(3 * M_rad);

  const O = L0 + C;
  const v = M + C;
  const v_rad = (v * Math.PI) / 180;

  const R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(v_rad));

  const lon = O - 0.00569;
  const lon_rad = (lon * Math.PI) / 180;

  const y = Math.cos(epsilon_rad) * Math.sin(lon_rad);
  const x = Math.cos(lon_rad);
  const RA = Math.atan2(y, x);

  const delta = Math.asin(Math.sin(epsilon_rad) * Math.sin(lon_rad));

  const H0_rad = Math.acos(-Math.tan(latitude_rad) * Math.tan(delta)) || 0;
  const H0 = (H0_rad * 180) / Math.PI;

  const GMST0 = L0 + 48.8567 + 15 * 0 + (0.1919 * J) % 360;
  const A = ((RA * 180) / Math.PI - GMST0) % 360;

  const sunrise = 12 - H0 / 15 - A / 15;
  const sunset = 12 + H0 / 15 - A / 15;

  const sunriseDate = new Date(date);
  sunriseDate.setHours(Math.floor(sunrise), Math.floor((sunrise % 1) * 60), 0);

  const sunsetDate = new Date(date);
  sunsetDate.setHours(Math.floor(sunset), Math.floor((sunset % 1) * 60), 0);

  return { sunrise: sunriseDate, sunset: sunsetDate };
}

/**
 * Determine weather condition based on random and seasonal factors
 */
function determineWeatherCondition(
  random: SeededRandom,
  profile: CityProfile,
  hour: number,
  month: number
): WeatherCondition {
  const conditionRand = random.next();

  // More rain in monsoon season for tropical climates
  const isMonsoony = profile.climate === 'tropical' && (month === 6 || month === 7 || month === 8 || month === 9);
  const rainThreshold = isMonsoony ? 0.5 : 0.3;
  const stormThreshold = isMonsoony ? 0.15 : 0.08;

  const isNight = hour < 6 || hour > 20;

  if (conditionRand < stormThreshold) {
    return 'thunderstorm';
  } else if (conditionRand < rainThreshold) {
    return random.next() < 0.3 ? 'heavy_rain' : 'rain';
  } else if (conditionRand < rainThreshold + 0.15) {
    return 'fog';
  } else if (conditionRand < rainThreshold + 0.35) {
    return random.next() < 0.5 ? 'cloudy' : 'overcast';
  } else if (conditionRand < rainThreshold + 0.5) {
    return 'partly_cloudy';
  } else if (isNight) {
    return random.next() < 0.7 ? 'clear_night' : 'cloudy_night';
  } else if (hour > 17 || hour < 7) {
    return 'sunset';
  }

  return 'sunny';
}

/**
 * Calculate temperature based on time of day and season
 */
function calculateTemperature(
  profile: CityProfile,
  hour: number,
  month: number,
  condition: WeatherCondition,
  random: SeededRandom
): TemperatureData {
  const dayOfYear = month * 30.44;
  const seasonProgress = Math.sin((dayOfYear * Math.PI) / 182.5);

  const baseTemp = profile.winterTemp + (profile.summerTemp - profile.winterTemp) * (seasonProgress + 1) / 2;

  // Diurnal temperature variation
  const hourProgress = hour / 24;
  const tempVariation = Math.sin((hourProgress - 0.25) * Math.PI * 2) * 8;

  // Condition modifiers
  let conditionModifier = 0;
  switch (condition) {
    case 'sunny':
      conditionModifier = 3;
      break;
    case 'partly_cloudy':
      conditionModifier = 1;
      break;
    case 'cloudy':
    case 'overcast':
      conditionModifier = -1;
      break;
    case 'rain':
    case 'heavy_rain':
      conditionModifier = -3;
      break;
    case 'thunderstorm':
      conditionModifier = -4;
      break;
    case 'fog':
      conditionModifier = -2;
      break;
    case 'snow':
      conditionModifier = -6;
      break;
    case 'clear_night':
      conditionModifier = -5;
      break;
    case 'cloudy_night':
      conditionModifier = -3;
      break;
    case 'sunset':
      conditionModifier = 0;
      break;
  }

  const current = baseTemp + tempVariation + conditionModifier + random.range(-1, 1);
  const feelsLike = current - (condition.includes('rain') ? 2 : 0) - random.range(0, 1);
  const high = baseTemp + 5 + random.range(0, 2);
  const low = baseTemp - 5 - random.range(0, 2);
  const dewPoint = current - (100 - (70 + random.range(0, 20))) / 5;

  return { current, feelsLike, high, low, dewPoint };
}

/**
 * Calculate wind data
 */
function calculateWind(condition: WeatherCondition, random: SeededRandom): WindData {
  let baseSpeed = 5;
  let maxGust = 10;

  switch (condition) {
    case 'thunderstorm':
      baseSpeed = random.range(15, 25);
      maxGust = random.range(35, 50);
      break;
    case 'heavy_rain':
      baseSpeed = random.range(10, 18);
      maxGust = random.range(20, 30);
      break;
    case 'rain':
      baseSpeed = random.range(8, 15);
      maxGust = random.range(15, 25);
      break;
    case 'cloudy':
    case 'overcast':
      baseSpeed = random.range(5, 12);
      maxGust = random.range(10, 18);
      break;
    case 'partly_cloudy':
    case 'sunny':
      baseSpeed = random.range(2, 10);
      maxGust = random.range(8, 15);
      break;
    case 'fog':
      baseSpeed = random.range(1, 5);
      maxGust = random.range(5, 10);
      break;
  }

  const direction = random.integer(0, 359);
  const directionLabel = getWindDirection(direction);
  const gust = baseSpeed + random.range(maxGust * 0.5, maxGust);

  return { speed: baseSpeed, gust, direction, directionLabel };
}

/**
 * Get human-readable wind direction
 */
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Generate current weather
 */
export function generateCurrentWeather(
  location: WeatherLocation,
  profile: CityProfile,
  date: Date = new Date()
): CurrentWeather {
  const seed = generateSeed(location.latitude, location.longitude, date);
  const random = new SeededRandom(seed);

  const hour = date.getHours();
  const month = date.getMonth();

  const condition = determineWeatherCondition(random, profile, hour, month);
  const temperature = calculateTemperature(profile, hour, month, condition, random);
  const windData = calculateWind(condition, random);

  return {
    condition,
    temperature,
    humidity: random.range(30, 95),
    visibility: condition === 'fog' ? random.range(0.1, 1) : random.range(5, 15),
    pressure: random.range(990, 1030),
    uvIndex: Math.max(0, Math.round(Math.sin((hour - 6) * (Math.PI / 12)) * 10)),
    windData,
    precipitation: condition.includes('rain') ? random.range(0, 50) : condition === 'snow' ? random.range(0, 30) : 0,
    cloudCover: condition === 'clear_night' || condition === 'sunny' ? random.range(0, 20) : random.range(40, 100),
    timestamp: date.getTime(),
  };
}

/**
 * Generate hourly forecast
 */
export function generateHourlyForecast(
  location: WeatherLocation,
  profile: CityProfile,
  baseDate: Date = new Date()
): HourlyForecast[] {
  const forecast: HourlyForecast[] = [];
  const startDate = new Date(baseDate);
  startDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 48; i++) {
    const forecastDate = new Date(startDate);
    forecastDate.setHours(forecastDate.getHours() + i);

    const weather = generateCurrentWeather(location, profile, forecastDate);

    forecast.push({
      ...weather,
      hour: forecastDate.getHours(),
      precipitationProbability:
        weather.condition.includes('rain') || weather.condition === 'thunderstorm'
          ? random.integer(40, 90)
          : weather.condition === 'partly_cloudy'
            ? random.integer(10, 30)
            : random.integer(0, 15),
    });
  }

  return forecast;
}

/**
 * Generate 7-day forecast
 */
export function generateDailyForecast(
  location: WeatherLocation,
  profile: CityProfile,
  baseDate: Date = new Date()
): DailyForecast[] {
  const forecast: DailyForecast[] = [];
  const startDate = new Date(baseDate);
  startDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < 7; day++) {
    const forecastDate = new Date(startDate);
    forecastDate.setDate(forecastDate.getDate() + day);

    const seed = generateSeed(location.latitude, location.longitude, forecastDate);
    const random = new SeededRandom(seed);

    const month = forecastDate.getMonth();
    const condition = determineWeatherCondition(random, profile, 12, month);

    const tempHigh = calculateTemperature(profile, 14, month, condition, random);
    const tempLow = calculateTemperature(profile, 2, month, condition, random);

    const { sunrise, sunset } = calculateSunriseSunset(location.latitude, forecastDate);
    const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);

    forecast.push({
      date: forecastDate,
      condition,
      high: tempHigh.high,
      low: tempLow.low,
      humidity: random.range(40, 85),
      windSpeed: calculateWind(condition, random).speed,
      uvIndex: Math.max(0, Math.round(Math.sin(Math.PI * 0.5) * 10)),
      precipitationProbability:
        condition.includes('rain') || condition === 'thunderstorm'
          ? random.integer(50, 95)
          : condition === 'partly_cloudy'
            ? random.integer(15, 40)
            : random.integer(0, 20),
      sunrise,
      sunset,
      dayLength,
    });
  }

  return forecast;
}

/**
 * Generate astronomy data
 */
export function generateAstronomyData(
  location: WeatherLocation,
  date: Date = new Date()
): AstronomyData {
  const { sunrise, sunset } = calculateSunriseSunset(location.latitude, date);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);

  const solarNoon = new Date(date);
  solarNoon.setHours(12, 0, 0, 0);

  const moonData = calculateMoonData(date);

  return {
    sunrise,
    sunset,
    dayLength,
    solarNoon,
    moonData,
  };
}

/**
 * Generate AQI data
 */
export function generateAQIData(condition: WeatherCondition, random: SeededRandom): AQIData {
  let baseAQI = 50;

  switch (condition) {
    case 'thunderstorm':
    case 'heavy_rain':
    case 'rain':
      baseAQI = random.integer(20, 50);
      break;
    case 'partly_cloudy':
    case 'sunny':
      baseAQI = random.integer(30, 80);
      break;
    case 'cloudy':
    case 'overcast':
      baseAQI = random.integer(40, 100);
      break;
    case 'fog':
      baseAQI = random.integer(80, 150);
      break;
  }

  const aqi = Math.min(500, baseAQI);
  const category =
    aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 150 ? 'Unhealthy for Sensitive Groups' : aqi <= 200 ? 'Unhealthy' : 'Very Unhealthy';

  return {
    aqi,
    category,
    pm25: random.range(0, 100),
    pm10: random.range(0, 150),
    o3: random.range(0, 200),
    no2: random.range(0, 100),
    co: random.range(0, 500),
  };
}

/**
 * Generate weather alerts
 */
export function generateWeatherAlerts(condition: WeatherCondition, date: Date = new Date()): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (condition === 'thunderstorm') {
    alerts.push({
      id: 'storm-warning',
      type: 'thunderstorm',
      severity: 'warning',
      title: 'Thunderstorm Warning',
      description: 'Severe thunderstorms expected in the next few hours.',
      startTime: date,
      endTime: new Date(date.getTime() + 3 * 60 * 60 * 1000),
    });
  }

  if (condition === 'heavy_rain') {
    alerts.push({
      id: 'rain-advisory',
      type: 'rain',
      severity: 'advisory',
      title: 'Heavy Rain Advisory',
      description: 'Heavy rain expected. Use caution when driving.',
      startTime: date,
      endTime: new Date(date.getTime() + 2 * 60 * 60 * 1000),
    });
  }

  if (condition === 'fog') {
    alerts.push({
      id: 'fog-advisory',
      type: 'fog',
      severity: 'advisory',
      title: 'Dense Fog Advisory',
      description: 'Dense fog will significantly reduce visibility.',
      startTime: date,
      endTime: new Date(date.getTime() + 4 * 60 * 60 * 1000),
    });
  }

  return alerts;
}

// Helper random for fallback
const random = {
  integer: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
};
