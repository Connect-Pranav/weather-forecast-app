'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Heart, Settings, MapPin } from 'lucide-react';
import { useWeatherStore } from '@/lib/weather/weather-store';
import LocationSearch from '@/components/search/LocationSearch';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { selectedLocation } = useWeatherStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-atmosphere-200 dark:border-atmosphere-700">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">Atmos</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-blue-500 transition">
            Today
          </Link>
          <Link href="/forecast" className="text-sm font-medium hover:text-blue-500 transition">
            Forecast
          </Link>
          <Link href="/map" className="text-sm font-medium hover:text-blue-500 transition">
            Map
          </Link>
          <Link href="/air" className="text-sm font-medium hover:text-blue-500 transition">
            Air
          </Link>
          <Link href="/astronomy" className="text-sm font-medium hover:text-blue-500 transition">
            Astronomy
          </Link>
        </div>

        {/* Current Location Display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-atmosphere-100 dark:bg-atmosphere-800">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{selectedLocation?.name || 'Loading...'}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 rounded-lg transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/favorites"
            className="p-2 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 rounded-lg transition"
            aria-label="Favorites"
          >
            <Heart className="w-5 h-5" />
          </Link>

          <Link
            href="/settings"
            className="p-2 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 rounded-lg transition"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 rounded-lg transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="border-t border-atmosphere-200 dark:border-atmosphere-700 p-4 bg-atmosphere-50 dark:bg-atmosphere-900">
          <LocationSearch onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-atmosphere-200 dark:border-atmosphere-700 p-4 space-y-2">
          <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition">
            Today
          </Link>
          <Link href="/forecast" className="block px-4 py-2 rounded-lg hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition">
            Forecast
          </Link>
          <Link href="/map" className="block px-4 py-2 rounded-lg hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition">
            Map
          </Link>
          <Link href="/air" className="block px-4 py-2 rounded-lg hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition">
            Air
          </Link>
          <Link href="/astronomy" className="block px-4 py-2 rounded-lg hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition">
            Astronomy
          </Link>
        </div>
      )}
    </nav>
  );
}
