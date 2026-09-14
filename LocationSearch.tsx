'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, Trash2 } from 'lucide-react';
import { useWeatherStore } from '@/lib/weather/weather-store';
import { searchCities, getCityById } from '@/lib/weather/weather-cities';

interface LocationSearchProps {
  onClose?: () => void;
}

export default function LocationSearch({ onClose }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSelectedLocation, addRecentSearch, recentSearches, clearRecentSearches, favorites } = useWeatherStore();

  const results = useMemo(() => {
    if (!query) return [];
    return searchCities(query).slice(0, 8);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelectCity = (cityId: string) => {
    const cityData = getCityById(cityId);
    if (cityData) {
      setSelectedLocation(cityData.location);
      addRecentSearch(cityData.location.name);
      setQuery('');
      setIsOpen(false);
      onClose?.();
    }
  };

  const showRecent = !query && recentSearches.length > 0;
  const showFavorites = !query && favorites.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-atmosphere-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cities, regions, or countries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="input pl-10 text-base"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-atmosphere-50 dark:bg-atmosphere-900 border border-atmosphere-200 dark:border-atmosphere-700 rounded-lg shadow-xl z-50">
          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="border-b border-atmosphere-200 dark:border-atmosphere-700">
              <div className="px-4 py-2 text-xs font-semibold text-atmosphere-500 uppercase">Search Results</div>
              {results.map((city) => (
                <button
                  key={city.location.id}
                  onClick={() => handleSelectCity(city.location.id)}
                  className="w-full text-left px-4 py-3 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{city.location.name}</div>
                    <div className="text-sm text-atmosphere-500">{city.location.region}, {city.location.country}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-atmosphere-500">
              <p className="text-sm">No locations found for "{query}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {showRecent && (
            <div className="border-b border-atmosphere-200 dark:border-atmosphere-700">
              <div className="px-4 py-2 text-xs font-semibold text-atmosphere-500 uppercase flex items-center justify-between">
                <span>Recently Viewed</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-atmosphere-400 hover:text-atmosphere-600 dark:hover:text-atmosphere-300"
                  aria-label="Clear recent searches"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {recentSearches.map((search) => {
                const city = searchCities(search)[0];
                return city ? (
                  <button
                    key={city.location.id}
                    onClick={() => handleSelectCity(city.location.id)}
                    className="w-full text-left px-4 py-3 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition flex items-center gap-3"
                  >
                    <Clock className="w-4 h-4 text-atmosphere-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{city.location.name}</div>
                      <div className="text-sm text-atmosphere-500">{city.location.region}</div>
                    </div>
                  </button>
                ) : null;
              })}
            </div>
          )}

          {/* Favorites */}
          {showFavorites && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-atmosphere-500 uppercase">Saved Locations</div>
              {favorites.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectCity(location.id)}
                  className="w-full text-left px-4 py-3 hover:bg-atmosphere-100 dark:hover:bg-atmosphere-800 transition flex items-center gap-3"
                >
                  <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{location.name}</div>
                    <div className="text-sm text-atmosphere-500">{location.region}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { Heart } from 'lucide-react';
