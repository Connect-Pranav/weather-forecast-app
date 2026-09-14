/**
 * Weather Cities Database
 * Predefined city profiles and metadata
 */

import { WeatherLocation, CityProfile } from './weather-types';

export const WEATHER_CITIES: Record<string, { location: WeatherLocation; profile: CityProfile }> = {
  bengaluru: {
    location: {
      id: 'bengaluru',
      name: 'Bengaluru',
      region: 'Karnataka',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
      elevation: 920,
      timezone: 'Asia/Kolkata',
    },
    profile: {
      latitude: 12.9716,
      longitude: 77.5946,
      elevation: 920,
      climate: 'subtropical',
      winterTemp: 20,
      summerTemp: 28,
    },
  },
  mumbai: {
    location: {
      id: 'mumbai',
      name: 'Mumbai',
      region: 'Maharashtra',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8479,
      elevation: 14,
      timezone: 'Asia/Kolkata',
    },
    profile: {
      latitude: 19.076,
      longitude: 72.8479,
      elevation: 14,
      climate: 'tropical',
      winterTemp: 22,
      summerTemp: 32,
    },
  },
  delhi: {
    location: {
      id: 'delhi',
      name: 'Delhi',
      region: 'Delhi',
      country: 'India',
      latitude: 28.7041,
      longitude: 77.1025,
      elevation: 216,
      timezone: 'Asia/Kolkata',
    },
    profile: {
      latitude: 28.7041,
      longitude: 77.1025,
      elevation: 216,
      climate: 'subtropical',
      winterTemp: 15,
      summerTemp: 35,
    },
  },
  hyderabad: {
    location: {
      id: 'hyderabad',
      name: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      latitude: 17.3645,
      longitude: 78.4711,
      elevation: 505,
      timezone: 'Asia/Kolkata',
    },
    profile: {
      latitude: 17.3645,
      longitude: 78.4711,
      elevation: 505,
      climate: 'subtropical',
      winterTemp: 18,
      summerTemp: 32,
    },
  },
  new_york: {
    location: {
      id: 'new_york',
      name: 'New York',
      region: 'New York',
      country: 'United States',
      latitude: 40.7128,
      longitude: -74.006,
      elevation: 10,
      timezone: 'America/New_York',
    },
    profile: {
      latitude: 40.7128,
      longitude: -74.006,
      elevation: 10,
      climate: 'temperate',
      winterTemp: 0,
      summerTemp: 25,
    },
  },
  london: {
    location: {
      id: 'london',
      name: 'London',
      region: 'England',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      elevation: 11,
      timezone: 'Europe/London',
    },
    profile: {
      latitude: 51.5074,
      longitude: -0.1278,
      elevation: 11,
      climate: 'temperate',
      winterTemp: 4,
      summerTemp: 15,
    },
  },
  tokyo: {
    location: {
      id: 'tokyo',
      name: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      elevation: 40,
      timezone: 'Asia/Tokyo',
    },
    profile: {
      latitude: 35.6762,
      longitude: 139.6503,
      elevation: 40,
      climate: 'temperate',
      winterTemp: 5,
      summerTemp: 27,
    },
  },
  dubai: {
    location: {
      id: 'dubai',
      name: 'Dubai',
      region: 'Dubai',
      country: 'United Arab Emirates',
      latitude: 25.2048,
      longitude: 55.2708,
      elevation: 5,
      timezone: 'Asia/Dubai',
    },
    profile: {
      latitude: 25.2048,
      longitude: 55.2708,
      elevation: 5,
      climate: 'tropical',
      winterTemp: 20,
      summerTemp: 40,
    },
  },
  singapore: {
    location: {
      id: 'singapore',
      name: 'Singapore',
      region: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
      elevation: 15,
      timezone: 'Asia/Singapore',
    },
    profile: {
      latitude: 1.3521,
      longitude: 103.8198,
      elevation: 15,
      climate: 'tropical',
      winterTemp: 24,
      summerTemp: 31,
    },
  },
  sydney: {
    location: {
      id: 'sydney',
      name: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      elevation: 58,
      timezone: 'Australia/Sydney',
    },
    profile: {
      latitude: -33.8688,
      longitude: 151.2093,
      elevation: 58,
      climate: 'temperate',
      winterTemp: 8,
      summerTemp: 26,
    },
  },
  paris: {
    location: {
      id: 'paris',
      name: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
      elevation: 35,
      timezone: 'Europe/Paris',
    },
    profile: {
      latitude: 48.8566,
      longitude: 2.3522,
      elevation: 35,
      climate: 'temperate',
      winterTemp: 3,
      summerTemp: 16,
    },
  },
  vancouver: {
    location: {
      id: 'vancouver',
      name: 'Vancouver',
      region: 'British Columbia',
      country: 'Canada',
      latitude: 49.2827,
      longitude: -123.1207,
      elevation: 0,
      timezone: 'America/Vancouver',
    },
    profile: {
      latitude: 49.2827,
      longitude: -123.1207,
      elevation: 0,
      climate: 'temperate',
      winterTemp: 5,
      summerTemp: 20,
    },
  },
  toronto: {
    location: {
      id: 'toronto',
      name: 'Toronto',
      region: 'Ontario',
      country: 'Canada',
      latitude: 43.6532,
      longitude: -79.3832,
      elevation: 76,
      timezone: 'America/Toronto',
    },
    profile: {
      latitude: 43.6532,
      longitude: -79.3832,
      elevation: 76,
      climate: 'continental',
      winterTemp: -5,
      summerTemp: 24,
    },
  },
};

export function getCityById(cityId: string) {
  return WEATHER_CITIES[cityId.toLowerCase()];
}

export function searchCities(query: string): Array<{ location: WeatherLocation; profile: CityProfile }> {
  const lowerQuery = query.toLowerCase();
  return Object.values(WEATHER_CITIES).filter(
    (city) =>
      city.location.name.toLowerCase().includes(lowerQuery) ||
      city.location.region.toLowerCase().includes(lowerQuery) ||
      city.location.country.toLowerCase().includes(lowerQuery)
  );
}

export function getAllCities() {
  return Object.values(WEATHER_CITIES);
}
