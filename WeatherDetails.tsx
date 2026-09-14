'use client';

import { useWeatherStore } from '@/lib/weather/weather-store';
import { formatPressure, convertPressure, formatDistance, convertDistance, getUVIntensity, getUVColor } from '@/lib/weather/weather-utils';
import { Cloud, Droplets, Eye, Gauge, Sun, Wind } from 'lucide-react';

export default function WeatherDetails() {
  const { weatherData, units } = useWeatherStore();

  if (!weatherData) return null;

  const { currentWeather, aqi } = weatherData;
  const pressure = convertPressure(currentWeather.pressure, 'hpa', units.pressure);
  const visibility = convertDistance(currentWeather.visibility, 'km', units.distance);

  const details = [
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(pressure, units.pressure),
      color: 'text-purple-500',
    },
    {
      icon: Wind,
      label: 'Wind Direction',
      value: currentWeather.windData.directionLabel,
      color: 'text-blue-500',
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: `${Math.round(currentWeather.cloudCover)}%`,
      color: 'text-gray-500',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatDistance(visibility, units.distance),
      color: 'text-cyan-500',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${Math.round(currentWeather.humidity)}%`,
      color: 'text-blue-400',
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: `${currentWeather.uvIndex} ${getUVIntensity(currentWeather.uvIndex)}`,
      color: getUVColor(currentWeather.uvIndex),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Weather Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {details.map((detail, idx) => {
            const Icon = detail.icon;
            return (
              <div key={idx} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${detail.color}`} />
                  <p className="text-xs text-atmosphere-500 font-medium">{detail.label}</p>
                </div>
                <p className="text-lg font-bold">{detail.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Air Quality */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-orange-500" />
          Air Quality Index
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">{aqi.aqi}</span>
              <span className="text-sm text-atmosphere-500">{aqi.category}</span>
            </div>
            <div className="w-full bg-atmosphere-200 dark:bg-atmosphere-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((aqi.aqi / 500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-atmosphere-500">PM2.5</span>
              <span className="font-medium">{aqi.pm25.toFixed(1)} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-atmosphere-500">PM10</span>
              <span className="font-medium">{aqi.pm10.toFixed(1)} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-atmosphere-500">O₃</span>
              <span className="font-medium">{aqi.o3.toFixed(1)} ppb</span>
            </div>
            <div className="flex justify-between">
              <span className="text-atmosphere-500">NO₂</span>
              <span className="font-medium">{aqi.no2.toFixed(1)} ppb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
