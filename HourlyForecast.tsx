'use client';

import { useRef, useEffect } from 'react';
import { useWeatherStore } from '@/lib/weather/weather-store';
import { formatTemperature, formatHour, getWeatherIcon } from '@/lib/weather/weather-utils';
import { Cloud, CloudRain, Sun, Moon, Wind } from 'lucide-react';

const iconMap: Record<string, any> = {
  Sun,
  Cloud,
  CloudRain,
  Moon,
  Wind,
};

export default function HourlyForecast() {
  const { weatherData, units, selectedForecastHour, setSelectedForecastHour } = useWeatherStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!weatherData) return null;

  const { hourlyForecast } = weatherData;

  useEffect(() => {
    // Auto-scroll to selected hour
    const container = scrollContainerRef.current;
    if (!container) return;

    const selectedElement = container.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedForecastHour]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hourly Forecast</h2>

      <div className="card p-4 overflow-x-auto scrollbar-hide">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 pb-2"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {hourlyForecast.slice(0, 24).map((hour, idx) => {
            const IconComponent = iconMap[getWeatherIcon(hour.condition)];
            const temp = formatTemperature(
              units.temperature === 'fahrenheit' ? (hour.temperature.current * 9) / 5 + 32 : hour.temperature.current,
              units.temperature,
              0
            );

            return (
              <button
                key={idx}
                onClick={() => setSelectedForecastHour(idx)}
                data-selected={selectedForecastHour === idx}
                className="flex-shrink-0 w-24 p-4 rounded-xl border-2 transition-all duration-200"
                style={{
                  borderColor: selectedForecastHour === idx ? 'rgb(59, 130, 246)' : 'rgb(226, 232, 240)',
                  backgroundColor: selectedForecastHour === idx ? 'rgb(59, 130, 246 / 0.1)' : 'transparent',
                }}
              >
                <p className="text-xs text-atmosphere-500 font-medium mb-2">{formatHour(hour.hour, false)}</p>

                {IconComponent && <IconComponent className="w-6 h-6 mx-auto mb-2 text-blue-500" />}

                <p className="text-sm font-bold mb-2">{temp}</p>

                <div className="flex items-center gap-1 justify-center text-xs">
                  <CloudRain className="w-3 h-3 text-blue-400" />
                  <span>{hour.precipitationProbability}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Details */}
      {selectedForecastHour >= 0 && hourlyForecast[selectedForecastHour] && (
        <div className="card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-atmosphere-500 mb-2">Temperature</p>
              <p className="text-2xl font-bold">
                {formatTemperature(
                  units.temperature === 'fahrenheit'
                    ? (hourlyForecast[selectedForecastHour].temperature.current * 9) / 5 + 32
                    : hourlyForecast[selectedForecastHour].temperature.current,
                  units.temperature,
                  0
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-atmosphere-500 mb-2">Feels Like</p>
              <p className="text-2xl font-bold">
                {formatTemperature(
                  units.temperature === 'fahrenheit'
                    ? (hourlyForecast[selectedForecastHour].temperature.feelsLike * 9) / 5 + 32
                    : hourlyForecast[selectedForecastHour].temperature.feelsLike,
                  units.temperature,
                  0
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-atmosphere-500 mb-2">Wind</p>
              <p className="text-2xl font-bold">
                {hourlyForecast[selectedForecastHour].windData.speed.toFixed(1)}
                <span className="text-xs ml-1">{units.speed === 'kmh' ? 'km/h' : units.speed === 'mph' ? 'mph' : 'm/s'}</span>
              </p>
            </div>

            <div>
              <p className="text-xs text-atmosphere-500 mb-2">Humidity</p>
              <p className="text-2xl font-bold">{Math.round(hourlyForecast[selectedForecastHour].humidity)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
