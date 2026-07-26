import React, { useState, useEffect, useCallback } from 'react';
import { LocationItem, OpenMeteoForecastData, TempUnit, WindSpeedUnit } from './types/weather';
import { fetchWeatherForecast, reverseGeocodeLocation } from './services/openMeteo';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { CloudSun, Sparkles } from 'lucide-react';

const DEFAULT_LOCATION: LocationItem = {
  name: 'Tokyo',
  country: 'Japan',
  latitude: 35.6895,
  longitude: 139.6917,
  countryCode: 'JP',
};

const FAVORITES_KEY = 'weather_intelligence_favorites';
const TEMP_UNIT_KEY = 'weather_intelligence_temp_unit';
const WIND_UNIT_KEY = 'weather_intelligence_wind_unit';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(() => {
    try {
      const saved = localStorage.getItem('weather_intelligence_last_location');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved location', e);
    }
    return DEFAULT_LOCATION;
  });

  const [forecastData, setForecastData] = useState<OpenMeteoForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem(TEMP_UNIT_KEY) as TempUnit) || 'C';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    return (localStorage.getItem(WIND_UNIT_KEY) as WindSpeedUnit) || 'kmh';
  });

  const [favorites, setFavorites] = useState<LocationItem[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse favorites', e);
    }
    return [];
  });

  // Save location & units to local storage
  useEffect(() => {
    try {
      localStorage.setItem('weather_intelligence_last_location', JSON.stringify(currentLocation));
    } catch (e) {
      console.warn('Failed to save location', e);
    }
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem(TEMP_UNIT_KEY, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(WIND_UNIT_KEY, windUnit);
  }, [windUnit]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Fetch forecast data
  const loadForecast = useCallback(async (loc: LocationItem) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherForecast(loc.latitude, loc.longitude, loc.timezone || 'auto');
      if (!data || !data.current) {
        throw new Error(`Weather data for ${loc.name} could not be retrieved.`);
      }
      setForecastData(data);
    } catch (err: any) {
      console.error('Failed to load forecast:', err);
      setErrorMsg(
        err.message || `Could not fetch weather data for ${loc.name}. Please try again later or select another city.`
      );
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(currentLocation);
  }, [currentLocation, loadForecast]);

  const handleSelectLocation = (loc: LocationItem) => {
    setCurrentLocation(loc);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const rev = await reverseGeocodeLocation(latitude, longitude);
          const newLoc: LocationItem = {
            name: rev.name,
            country: rev.country,
            admin1: rev.admin1,
            latitude,
            longitude,
          };
          setCurrentLocation(newLoc);
        } catch (err) {
          console.error('Reverse geocode error:', err);
          setCurrentLocation({
            name: 'Current Location',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } finally {
          setIsGeoLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation permission denied or error:', err);
        alert('Could not access your location. Please ensure location permissions are granted.');
        setIsGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleToggleFavorite = (loc: LocationItem) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          f.name.toLowerCase() === loc.name.toLowerCase() &&
          Math.abs(f.latitude - loc.latitude) < 0.05
      );
      if (exists) {
        return prev.filter(
          (f) =>
            !(
              f.name.toLowerCase() === loc.name.toLowerCase() &&
              Math.abs(f.latitude - loc.latitude) < 0.05
            )
        );
      }
      return [...prev, loc];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Background Ambient Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-700/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Navigation & Search */}
        <Header
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onUseGeolocation={handleUseGeolocation}
          isGeoLoading={isGeoLoading}
          tempUnit={tempUnit}
          onToggleTempUnit={setTempUnit}
          windUnit={windUnit}
          onChangeWindUnit={setWindUnit}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Content Section */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : errorMsg ? (
          <ErrorMessage
            message={errorMsg}
            onRetry={() => loadForecast(currentLocation)}
            onResetToDefault={() => setCurrentLocation(DEFAULT_LOCATION)}
          />
        ) : forecastData ? (
          <main className="space-y-6">
            {/* Current Weather Card */}
            <CurrentWeather
              location={currentLocation}
              data={forecastData}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* Smart Planning Intelligence */}
            <PlanningIntelligence data={forecastData} />

            {/* Hourly Forecast */}
            <HourlyForecast
              data={forecastData}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 7-Day Daily Forecast */}
            <DailyForecast
              data={forecastData}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          </main>
        ) : null}

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center border-t border-slate-800/80 text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400">Weather Intelligence</span>
            <span>•</span>
            <span>Powered by Open-Meteo Geocoding & Weather API</span>
          </div>
          <p>
            No API key required • Live 7-day weather predictions, hourly metrics, and outdoor planning advice.
          </p>
        </footer>
      </div>
    </div>
  );
}
