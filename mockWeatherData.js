// Mock weather data - no API calls needed
export const MOCK_WEATHER_DATA = {
  'London': {
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    country: 'GB',
    current: {
      temp: 15,
      feels_like: 13,
      humidity: 72,
      pressure: 1013,
      visibility: 10000,
      wind: { speed: 4.5 },
      weather: [{ main: 'Cloudy', description: 'overcast clouds', icon: '04d' }],
      sys: {
        sunrise: 1694707200,
        sunset: 1694750400,
      },
    },
    hourly: [
      { dt: 1694707200, main: { temp: 15, humidity: 72 }, wind: { speed: 4.5 }, weather: [{ icon: '04d' }] },
      { dt: 1694710800, main: { temp: 16, humidity: 68 }, wind: { speed: 4.2 }, weather: [{ icon: '04d' }] },
      { dt: 1694714400, main: { temp: 17, humidity: 65 }, wind: { speed: 3.8 }, weather: [{ icon: '03d' }] },
      { dt: 1694718000, main: { temp: 18, humidity: 62 }, wind: { speed: 3.5 }, weather: [{ icon: '02d' }] },
      { dt: 1694721600, main: { temp: 17, humidity: 65 }, wind: { speed: 4.0 }, weather: [{ icon: '03d' }] },
      { dt: 1694725200, main: { temp: 16, humidity: 68 }, wind: { speed: 4.3 }, weather: [{ icon: '04d' }] },
      { dt: 1694728800, main: { temp: 15, humidity: 70 }, wind: { speed: 4.6 }, weather: [{ icon: '04d' }] },
      { dt: 1694732400, main: { temp: 14, humidity: 73 }, wind: { speed: 4.8 }, weather: [{ icon: '04n' }] },
    ],
  },

  'New York': {
    name: 'New York',
    lat: 40.7128,
    lon: -74.006,
    country: 'US',
    current: {
      temp: 22,
      feels_like: 21,
      humidity: 65,
      pressure: 1015,
      visibility: 10000,
      wind: { speed: 5.2 },
      weather: [{ main: 'Sunny', description: 'clear sky', icon: '01d' }],
      sys: {
        sunrise: 1694709600,
        sunset: 1694752800,
      },
    },
    hourly: [
      { dt: 1694709600, main: { temp: 22, humidity: 65 }, wind: { speed: 5.2 }, weather: [{ icon: '01d' }] },
      { dt: 1694713200, main: { temp: 23, humidity: 62 }, wind: { speed: 4.9 }, weather: [{ icon: '01d' }] },
      { dt: 1694716800, main: { temp: 24, humidity: 60 }, wind: { speed: 4.6 }, weather: [{ icon: '01d' }] },
      { dt: 1694720400, main: { temp: 25, humidity: 58 }, wind: { speed: 4.3 }, weather: [{ icon: '01d' }] },
      { dt: 1694724000, main: { temp: 24, humidity: 60 }, wind: { speed: 4.7 }, weather: [{ icon: '02d' }] },
      { dt: 1694727600, main: { temp: 23, humidity: 62 }, wind: { speed: 5.0 }, weather: [{ icon: '02d' }] },
      { dt: 1694731200, main: { temp: 22, humidity: 64 }, wind: { speed: 5.2 }, weather: [{ icon: '02n' }] },
      { dt: 1694734800, main: { temp: 21, humidity: 66 }, wind: { speed: 5.3 }, weather: [{ icon: '01n' }] },
    ],
  },

  'Tokyo': {
    name: 'Tokyo',
    lat: 35.6762,
    lon: 139.6503,
    country: 'JP',
    current: {
      temp: 28,
      feels_like: 30,
      humidity: 78,
      pressure: 1012,
      visibility: 8000,
      wind: { speed: 6.5 },
      weather: [{ main: 'Rainy', description: 'light rain', icon: '10d' }],
      sys: {
        sunrise: 1694673600,
        sunset: 1694715600,
      },
    },
    hourly: [
      { dt: 1694673600, main: { temp: 28, humidity: 78 }, wind: { speed: 6.5 }, weather: [{ icon: '10d' }] },
      { dt: 1694677200, main: { temp: 27, humidity: 80 }, wind: { speed: 6.8 }, weather: [{ icon: '10d' }] },
      { dt: 1694680800, main: { temp: 26, humidity: 82 }, wind: { speed: 7.0 }, weather: [{ icon: '09d' }] },
      { dt: 1694684400, main: { temp: 25, humidity: 80 }, wind: { speed: 6.5 }, weather: [{ icon: '09d' }] },
      { dt: 1694688000, main: { temp: 26, humidity: 79 }, wind: { speed: 6.3 }, weather: [{ icon: '10d' }] },
      { dt: 1694691600, main: { temp: 27, humidity: 77 }, wind: { speed: 6.0 }, weather: [{ icon: '10d' }] },
      { dt: 1694695200, main: { temp: 28, humidity: 75 }, wind: { speed: 5.8 }, weather: [{ icon: '04d' }] },
      { dt: 1694698800, main: { temp: 27, humidity: 77 }, wind: { speed: 6.1 }, weather: [{ icon: '04n' }] },
    ],
  },

  'Paris': {
    name: 'Paris',
    lat: 48.8566,
    lon: 2.3522,
    country: 'FR',
    current: {
      temp: 18,
      feels_like: 16,
      humidity: 68,
      pressure: 1014,
      visibility: 10000,
      wind: { speed: 3.2 },
      weather: [{ main: 'Partly Cloudy', description: 'scattered clouds', icon: '03d' }],
      sys: {
        sunrise: 1694706000,
        sunset: 1694749200,
      },
    },
    hourly: [
      { dt: 1694706000, main: { temp: 18, humidity: 68 }, wind: { speed: 3.2 }, weather: [{ icon: '03d' }] },
      { dt: 1694709600, main: { temp: 19, humidity: 66 }, wind: { speed: 3.0 }, weather: [{ icon: '03d' }] },
      { dt: 1694713200, main: { temp: 20, humidity: 64 }, wind: { speed: 2.8 }, weather: [{ icon: '02d' }] },
      { dt: 1694716800, main: { temp: 21, humidity: 62 }, wind: { speed: 2.6 }, weather: [{ icon: '01d' }] },
      { dt: 1694720400, main: { temp: 20, humidity: 63 }, wind: { speed: 2.8 }, weather: [{ icon: '02d' }] },
      { dt: 1694724000, main: { temp: 19, humidity: 65 }, wind: { speed: 3.0 }, weather: [{ icon: '03d' }] },
      { dt: 1694727600, main: { temp: 18, humidity: 67 }, wind: { speed: 3.1 }, weather: [{ icon: '03n' }] },
      { dt: 1694731200, main: { temp: 17, humidity: 69 }, wind: { speed: 3.2 }, weather: [{ icon: '04n' }] },
    ],
  },

  'Sydney': {
    name: 'Sydney',
    lat: -33.8688,
    lon: 151.2093,
    country: 'AU',
    current: {
      temp: 25,
      feels_like: 24,
      humidity: 55,
      pressure: 1018,
      visibility: 10000,
      wind: { speed: 8.5 },
      weather: [{ main: 'Sunny', description: 'clear sky', icon: '01d' }],
      sys: {
        sunrise: 1694642400,
        sunset: 1694688000,
      },
    },
    hourly: [
      { dt: 1694642400, main: { temp: 25, humidity: 55 }, wind: { speed: 8.5 }, weather: [{ icon: '01d' }] },
      { dt: 1694646000, main: { temp: 26, humidity: 53 }, wind: { speed: 8.2 }, weather: [{ icon: '01d' }] },
      { dt: 1694649600, main: { temp: 27, humidity: 51 }, wind: { speed: 7.8 }, weather: [{ icon: '01d' }] },
      { dt: 1694653200, main: { temp: 28, humidity: 50 }, wind: { speed: 7.5 }, weather: [{ icon: '02d' }] },
      { dt: 1694656800, main: { temp: 27, humidity: 51 }, wind: { speed: 7.8 }, weather: [{ icon: '02d' }] },
      { dt: 1694660400, main: { temp: 26, humidity: 52 }, wind: { speed: 8.0 }, weather: [{ icon: '02d' }] },
      { dt: 1694664000, main: { temp: 25, humidity: 54 }, wind: { speed: 8.3 }, weather: [{ icon: '01n' }] },
      { dt: 1694667600, main: { temp: 24, humidity: 56 }, wind: { speed: 8.5 }, weather: [{ icon: '01n' }] },
    ],
  },

  'Dubai': {
    name: 'Dubai',
    lat: 25.2048,
    lon: 55.2708,
    country: 'AE',
    current: {
      temp: 38,
      feels_like: 42,
      humidity: 35,
      pressure: 1008,
      visibility: 8000,
      wind: { speed: 12.5 },
      weather: [{ main: 'Sunny', description: 'clear sky', icon: '01d' }],
      sys: {
        sunrise: 1694659200,
        sunset: 1694702400,
      },
    },
    hourly: [
      { dt: 1694659200, main: { temp: 38, humidity: 35 }, wind: { speed: 12.5 }, weather: [{ icon: '01d' }] },
      { dt: 1694662800, main: { temp: 39, humidity: 33 }, wind: { speed: 12.2 }, weather: [{ icon: '01d' }] },
      { dt: 1694666400, main: { temp: 40, humidity: 32 }, wind: { speed: 11.8 }, weather: [{ icon: '01d' }] },
      { dt: 1694670000, main: { temp: 41, humidity: 31 }, wind: { speed: 11.5 }, weather: [{ icon: '01d' }] },
      { dt: 1694673600, main: { temp: 40, humidity: 32 }, wind: { speed: 11.8 }, weather: [{ icon: '02d' }] },
      { dt: 1694677200, main: { temp: 39, humidity: 33 }, wind: { speed: 12.0 }, weather: [{ icon: '02d' }] },
      { dt: 1694680800, main: { temp: 37, humidity: 35 }, wind: { speed: 12.3 }, weather: [{ icon: '01n' }] },
      { dt: 1694684400, main: { temp: 36, humidity: 37 }, wind: { speed: 12.5 }, weather: [{ icon: '01n' }] },
    ],
  },
};

export const getCityWeather = (cityName) => {
  const city = Object.keys(MOCK_WEATHER_DATA).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );

  if (city) {
    return MOCK_WEATHER_DATA[city];
  }

  // Return London as default if city not found
  return MOCK_WEATHER_DATA['London'];
};

export const getAllCities = () => {
  return Object.keys(MOCK_WEATHER_DATA);
};
