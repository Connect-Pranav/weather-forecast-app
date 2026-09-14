'use client';

import { useEffect } from 'react';
import { useWeatherStore } from '@/lib/weather/weather-store';
import Navigation from '@/components/navigation/Navigation';
import WeatherHero from '@/components/weather/WeatherHero';
import WeatherDetails from '@/components/weather/WeatherDetails';
import HourlyForecast from '@/components/forecast/HourlyForecast';
import DailyForecast from '@/components/forecast/DailyForecast';

export default function Home() {
  const { loadInitialData } = useWeatherStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-atmosphere-50 via-blue-50 to-atmosphere-100 dark:from-atmosphere-950 dark:via-atmosphere-900 dark:to-atmosphere-800">
      <Navigation />

      <div className="container pt-20 pb-12">
        <WeatherHero />

        <div className="mt-12 grid grid-cols-1 gap-8">
          <WeatherDetails />
          <HourlyForecast />
          <DailyForecast />
        </div>
      </div>
    </main>
  );
}
