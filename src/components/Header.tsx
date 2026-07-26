import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Star,
  StarOff,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { GeocodingResult, LocationItem, TempUnit, WindSpeedUnit } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface HeaderProps {
  currentLocation: LocationItem;
  onSelectLocation: (location: LocationItem) => void;
  onUseGeolocation: () => void;
  isGeoLoading: boolean;
  tempUnit: TempUnit;
  onToggleTempUnit: (unit: TempUnit) => void;
  windUnit: WindSpeedUnit;
  onChangeWindUnit: (unit: WindSpeedUnit) => void;
  favorites: LocationItem[];
  onToggleFavorite: (location: LocationItem) => void;
}

const PRESET_CITIES: LocationItem[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, countryCode: 'JP' },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006, countryCode: 'US' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, countryCode: 'GB' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, countryCode: 'FR' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, countryCode: 'AU' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, countryCode: 'AE' },
  { name: 'San Francisco', country: 'United States', admin1: 'California', latitude: 37.7749, longitude: -122.4194, countryCode: 'US' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, countryCode: 'SG' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseGeolocation,
  isGeoLoading,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onChangeWindUnit,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setIsDropdownOpen(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const searchRes = await searchCities(searchQuery);
        setResults(searchRes);
        setIsDropdownOpen(true);
        if (searchRes.length === 0) {
          setSearchError(`No cities found matching "${searchQuery}".`);
        }
      } catch (err) {
        console.error('Search failed:', err);
        setSearchError('Failed to search locations. Please check network connection.');
        setIsDropdownOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (item: GeocodingResult) => {
    onSelectLocation({
      name: item.name,
      country: item.country,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      countryCode: item.country_code,
    });
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const isCurrentFavorite = favorites.some(
    (f) =>
      f.name.toLowerCase() === currentLocation.name.toLowerCase() &&
      Math.abs(f.latitude - currentLocation.latitude) < 0.05
  );

  return (
    <header className="relative z-30 mb-6 space-y-4">
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-slate-100 shadow-xl">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20 text-white">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                Weather Intelligence
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full">
                Open-Meteo AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-Time Forecasts & Smart Planning</p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="relative flex-1 max-w-xl" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0 || searchError) setIsDropdownOpen(true);
              }}
              placeholder="Search city name (e.g. Paris, Tokyo, Chicago)..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
            {isSearching && (
              <Loader2 className="absolute right-10 w-4 h-4 text-sky-400 animate-spin" />
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200 transition p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-800">
              {searchError ? (
                <div className="p-4 text-sm text-slate-400 text-center">{searchError}</div>
              ) : (
                results.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => handleSelectResult(res)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between transition group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-400 transition">
                        {res.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[res.admin1, res.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500 font-mono">
                      {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* GPS Location Button */}
          <button
            type="button"
            onClick={onUseGeolocation}
            disabled={isGeoLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition disabled:opacity-50"
            title="Detect My Location"
          >
            {isGeoLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Bookmark Favorite */}
          <button
            type="button"
            onClick={() => onToggleFavorite(currentLocation)}
            className={`p-2 rounded-xl border text-xs transition flex items-center justify-center ${
              isCurrentFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
            title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            {isCurrentFavorite ? <Star className="w-4 h-4 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
          </button>

          {/* Unit Selectors */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => onToggleTempUnit('C')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                tempUnit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleTempUnit('F')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                tempUnit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          <select
            value={windUnit}
            onChange={(e) => onChangeWindUnit(e.target.value as WindSpeedUnit)}
            className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>
        </div>
      </div>

      {/* Quick City Chips & Saved Favorites */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-sky-400" /> Quick Cities:
        </span>

        {/* Favorite Locations First */}
        {favorites.map((fav) => (
          <button
            key={`fav-${fav.name}-${fav.latitude}`}
            type="button"
            onClick={() => onSelectLocation(fav)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              currentLocation.name.toLowerCase() === fav.name.toLowerCase()
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {fav.name}
          </button>
        ))}

        {/* Standard Presets */}
        {PRESET_CITIES.map((city) => {
          const isSelected = currentLocation.name.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={`preset-${city.name}`}
              type="button"
              onClick={() => onSelectLocation(city)}
              className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                isSelected
                  ? 'bg-sky-500 border-sky-400 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </header>
  );
};
