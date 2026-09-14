'use client';

import { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useWeatherStore } from '@/lib/weather/weather-store';
import { formatTemperature, getWeatherDescription, getWeatherIcon } from '@/lib/weather/weather-utils';
import { Cloud, CloudRain, Sun } from 'lucide-react';

// Lazy load 3D scene
const WeatherScene3D = dynamic(() => import('@/components/three/WeatherScene'), {
  loading: () => <WeatherSceneLoader />,
  ssr: false,
});

function WeatherSceneLoader() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-atmosphere-800 dark:to-atmosphere-700 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-atmosphere-500">Loading weather environment...</p>
      </div>
    </div>
  );
}

export default function WeatherHero() {
  const { weatherData, units } = useWeatherStore();

  if (!weatherData) {
    return <WeatherSceneLoader />;
  }

  const { currentWeather, location, astronomy } = weatherData;
  const temp = currentWeather.temperature.current;
  const displayTemp = formatTemperature(
    units.temperature === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp,
    units.temperature
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* 3D Weather Scene */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-atmosphere-200 dark:border-atmosphere-700">
        <Suspense fallback={<WeatherSceneLoader />}>
          <WeatherScene3D condition={currentWeather.condition} />
        </Suspense>
      </div>

      {/* Weather Info */}
      <div className="flex flex-col justify-center space-y-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">{displayTemp}</h1>
          <p className="text-2xl text-atmosphere-600 dark:text-atmosphere-300 mb-6">{getWeatherDescription(currentWeather.condition)}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-atmosphere-500">Feels Like</span>
              <span className="text-lg font-semibold">
                {formatTemperature(
                  units.temperature === 'fahrenheit' ? (currentWeather.temperature.feelsLike * 9) / 5 + 32 : currentWeather.temperature.feelsLike,
                  units.temperature
                )}
              </span>
            </div>

            <div className="flex items-center gap-8">
              <div>
                <span className="text-sm text-atmosphere-500">High</span>
                <p className="text-lg font-semibold">
                  {formatTemperature(
                    units.temperature === 'fahrenheit' ? (currentWeather.temperature.high * 9) / 5 + 32 : currentWeather.temperature.high,
                    units.temperature
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm text-atmosphere-500">Low</span>
                <p className="text-lg font-semibold">
                  {formatTemperature(
                    units.temperature === 'fahrenheit' ? (currentWeather.temperature.low * 9) / 5 + 32 : currentWeather.temperature.low,
                    units.temperature
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-atmosphere-500 mb-2">Humidity</p>
            <p className="text-xl font-bold">{Math.round(currentWeather.humidity)}%</p>
          </div>

          <div className="card p-4">
            <p className="text-xs text-atmosphere-500 mb-2">Wind</p>
            <p className="text-xl font-bold">
              {currentWeather.windData.speed.toFixed(1)}
              <span className="text-sm ml-1">{units.speed === 'kmh' ? 'km/h' : units.speed === 'mph' ? 'mph' : 'm/s'}</span>
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs text-atmosphere-500 mb-2">Visibility</p>
            <p className="text-xl font-bold">
              {currentWeather.visibility.toFixed(1)}
              <span className="text-sm ml-1">{units.distance === 'km' ? 'km' : 'mi'}</span>
            </p>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs text-atmosphere-500 mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Sunrise
            </p>
            <p className="text-lg font-semibold">{astronomy.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <div className="card p-4">
            <p className="text-xs text-atmosphere-500 mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Sunset
            </p>
            <p className="text-lg font-semibold">{astronomy.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
