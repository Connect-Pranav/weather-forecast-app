'use client';

import { useWeatherStore } from '@/lib/weather/weather-store';
import { formatTemperature, getWeatherDescription, getWeatherIcon } from '@/lib/weather/weather-utils';
import { Cloud, CloudRain, Sun, Moon, Wind, Droplets } from 'lucide-react';
import { format } from 'date-fns';

const iconMap: Record<string, any> = {
  Sun,
  Cloud,
  CloudRain,
  Moon,
  Wind,
};

export default function DailyForecast() {
  const { weatherData, units } = useWeatherStore();

  if (!weatherData) return null;

  const { dailyForecast } = weatherData;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">7-Day Forecast</h2>

      <div className="space-y-2">
        {dailyForecast.map((day, idx) => {
          const IconComponent = iconMap[getWeatherIcon(day.condition)];
          const highTemp = formatTemperature(
            units.temperature === 'fahrenheit' ? (day.high * 9) / 5 + 32 : day.high,
            units.temperature,
            0
          );
          const lowTemp = formatTemperature(
            units.temperature === 'fahrenheit' ? (day.low * 9) / 5 + 32 : day.low,
            units.temperature,
            0
          );

          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : format(day.date, 'EEEE');

          return (
            <div key={idx} className="card p-4 hover:border-blue-300 dark:hover:border-blue-600 transition">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Day */}
                <div className="col-span-3 sm:col-span-2">
                  <p className="font-semibold">{dayName}</p>
                  <p className="text-xs text-atmosphere-500">{format(day.date, 'MMM d')}</p>
                </div>

                {/* Icon & Condition */}
                <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                  {IconComponent && <IconComponent className="w-6 h-6 text-blue-500" />}
                  <span className="text-sm hidden sm:inline">{getWeatherDescription(day.condition)}</span>
                </div>

                {/* Temperature Range */}
                <div className="col-span-3 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{highTemp}</span>
                    <span className="text-sm text-atmosphere-500">{lowTemp}</span>
                  </div>
                </div>

                {/* Precipitation */}
                <div className="col-span-2 sm:col-span-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">{day.precipitationProbability}%</span>
                  </div>
                </div>

                {/* Wind */}
                <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1">
                    <Wind className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm">{day.windSpeed.toFixed(1)}</span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">
                  <span className="text-sm">{Math.round(day.humidity)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
