import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  Cloud,
  MapPin,
  TrendingUp,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { LocationItem, OpenMeteoForecastData, TempUnit, WindSpeedUnit } from '../types/weather';
import { getWmoCodeInfo } from '../utils/wmoCodes';
import {
  formatTemp,
  formatWindSpeed,
  getWindDirection,
  getUvCategory,
  formatTime,
  formatDate,
} from '../utils/formatters';

interface CurrentWeatherProps {
  location: LocationItem;
  data: OpenMeteoForecastData;
  tempUnit: TempUnit;
  windUnit: WindSpeedUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  location,
  data,
  tempUnit,
  windUnit,
}) => {
  const current = data.current;
  const daily = data.daily;

  if (!current) return null;

  const codeInfo = getWmoCodeInfo(current.weather_code, current.is_day);
  const IconComponent = codeInfo.icon;

  const todayMaxC = daily?.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMinC = daily?.temperature_2m_min?.[0] ?? current.temperature_2m;
  const todayRainProb = daily?.precipitation_probability_max?.[0] ?? 0;
  const todayUv = daily?.uv_index_max?.[0] ?? 0;
  const uvCategory = getUvCategory(todayUv);

  const sunriseStr = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0], data.timezone) : '--:--';
  const sunsetStr = daily?.sunset?.[0] ? formatTime(daily.sunset[0], data.timezone) : '--:--';

  // Solar position calculation (0 to 100%)
  let solarPercent = 0;
  if (daily?.sunrise?.[0] && daily?.sunset?.[0]) {
    const sunriseTime = new Date(daily.sunrise[0]).getTime();
    const sunsetTime = new Date(daily.sunset[0]).getTime();
    const nowTime = new Date().getTime();
    if (nowTime >= sunriseTime && nowTime <= sunsetTime) {
      solarPercent = Math.round(((nowTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100);
    } else if (nowTime > sunsetTime) {
      solarPercent = 100;
    }
  }

  const currentDateFormatted = formatDate(current.time, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="space-y-6">
      {/* Hero Weather Card */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${codeInfo.bgGradient} p-6 sm:p-8 text-white shadow-2xl transition-all duration-500`}
      >
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Column: Location & Main Temp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {location.name}
              </h2>
              {location.country && (
                <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold rounded-full">
                  {location.admin1 ? `${location.admin1}, ` : ''}
                  {location.country}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-white/80 font-medium">{currentDateFormatted}</p>

            {/* Main Temp & Condition Row */}
            <div className="flex items-baseline gap-4 pt-2">
              <div className="text-6xl sm:text-7xl font-black tracking-tight">
                {formatTemp(current.temperature_2m, tempUnit)}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-sm font-semibold">
                  <IconComponent className="w-5 h-5 text-amber-200 animate-bounce" />
                  <span>{codeInfo.description}</span>
                </div>
                <div className="text-xs text-white/90 font-medium">
                  Feels like {formatTemp(current.apparent_temperature, tempUnit)}
                </div>
              </div>
            </div>

            {/* Daily Range & Rain Prob */}
            <div className="flex items-center gap-4 text-xs font-medium text-white/90 pt-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-200" />
                High: <strong className="text-white">{formatTemp(todayMaxC, tempUnit)}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Low: <strong className="text-white">{formatTemp(todayMinC, tempUnit)}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-200" />
                Rain: <strong className="text-white">{todayRainProb}%</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Key Summary Badges */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {/* Solar Progress Card */}
            <div className="flex-1 bg-black/20 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-4 h-4 text-amber-300" /> {sunriseStr}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset className="w-4 h-4 text-orange-300" /> {sunsetStr}
                </span>
              </div>

              {/* Sun Track Gauge */}
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 transition-all duration-1000 rounded-full"
                  style={{ width: `${solarPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-center text-white/70">
                {current.is_day ? `Daylight Progress (${solarPercent}%)` : 'Nighttime'}
              </p>
            </div>

            {/* Quick UV Badge */}
            <div className="bg-black/20 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-white/70 font-medium">Max UV Index</div>
                <div className="text-lg font-bold flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-300" />
                  {todayUv.toFixed(1)}{' '}
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold text-white ${uvCategory.bg}`}>
                    {uvCategory.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Humidity */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold">{current.relative_humidity_2m}%</div>
          <div className="text-[11px] text-slate-400">
            {current.relative_humidity_2m > 70
              ? 'High humidity'
              : current.relative_humidity_2m < 30
              ? 'Dry air'
              : 'Comfortable'}
          </div>
        </div>

        {/* Wind Speed & Gusts */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold">
            {formatWindSpeed(current.wind_speed_10m, windUnit)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span
              className="inline-block transform transition-transform"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            >
              ↑
            </span>
            {getWindDirection(current.wind_direction_10m)} • Gusts{' '}
            {formatWindSpeed(current.wind_gusts_10m, windUnit)}
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold">{Math.round(current.pressure_msl)} hPa</div>
          <div className="text-[11px] text-slate-400">
            {current.pressure_msl > 1013 ? 'High pressure system' : 'Low pressure system'}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold">{current.cloud_cover}%</div>
          <div className="text-[11px] text-slate-400">
            {current.cloud_cover > 80
              ? 'Overcast'
              : current.cloud_cover > 40
              ? 'Partly cloudy'
              : 'Mostly clear'}
          </div>
        </div>

        {/* Dew Point */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Dew Point</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold">
            {data.hourly?.dew_point_2m?.[0] !== undefined
              ? formatTemp(data.hourly.dew_point_2m[0], tempUnit)
              : '--'}
          </div>
          <div className="text-[11px] text-slate-400">Condensation index</div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-slate-100 space-y-1 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>UV Risk</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-bold ${uvCategory.color}`}>
            {todayUv.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{uvCategory.label} level</div>
        </div>
      </div>
    </section>
  );
};
