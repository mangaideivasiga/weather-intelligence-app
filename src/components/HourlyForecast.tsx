import React, { useState } from 'react';
import {
  Clock,
  LineChart,
  Grid,
  Droplets,
  Wind,
  Sun,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { OpenMeteoForecastData, TempUnit, WindSpeedUnit } from '../types/weather';
import { getWmoCodeInfo } from '../utils/wmoCodes';
import { convertTemp, convertWindSpeed, formatTime } from '../utils/formatters';

interface HourlyForecastProps {
  data: OpenMeteoForecastData;
  tempUnit: TempUnit;
  windUnit: WindSpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  data,
  tempUnit,
  windUnit,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');
  const [activeMetric, setActiveMetric] = useState<'temp' | 'rain' | 'wind'>('temp');

  const hourly = data.hourly;
  if (!hourly || !hourly.time) return null;

  // Extract next 24 hours starting from current time or first index
  const next24Hours = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const tempC = hourly.temperature_2m[idx];
    const tempVal = convertTemp(tempC, tempUnit);
    const rainProb = hourly.precipitation_probability[idx] ?? 0;
    const windSpeedKmh = hourly.wind_speed_10m[idx] ?? 0;
    const windVal = convertWindSpeed(windSpeedKmh, windUnit);
    const weatherCode = hourly.weather_code[idx] ?? 0;
    const uvIndex = hourly.uv_index?.[idx] ?? 0;

    return {
      timeStr,
      displayTime: formatTime(timeStr, data.timezone),
      rawTime: new Date(timeStr).getHours(),
      tempVal,
      tempC,
      rainProb,
      windVal,
      windSpeedKmh,
      weatherCode,
      uvIndex,
    };
  });

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">24-Hour Forecast</h3>
            <p className="text-xs text-slate-400">Hourly breakdown of temperatures & rain chances</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {viewMode === 'chart' && (
            <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveMetric('temp')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeMetric === 'temp'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Temp
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('rain')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeMetric === 'rain'
                    ? 'bg-cyan-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Rain %
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('wind')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeMetric === 'wind'
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Wind
              </button>
            </div>
          )}

          <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'chart'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              Graph
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="relative">
          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {next24Hours.map((item, idx) => {
              const isDayHour = item.rawTime >= 6 && item.rawTime <= 20 ? 1 : 0;
              const codeInfo = getWmoCodeInfo(item.weatherCode, isDayHour);
              const IconComp = codeInfo.icon;

              return (
                <div
                  key={`hourly-${item.timeStr}`}
                  className={`shrink-0 w-28 p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition hover:scale-105 ${
                    idx === 0
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-800/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-400">
                    {idx === 0 ? 'Now' : item.displayTime}
                  </span>

                  <IconComp className={`w-7 h-7 my-1 ${codeInfo.accentColor}`} />

                  <span className="text-lg font-black tracking-tight">
                    {item.tempVal}°
                  </span>

                  {/* Rain badge if > 10% */}
                  {item.rainProb > 0 ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                      <Droplets className="w-3 h-3" />
                      {item.rainProb}%
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-medium">Dry</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Recharts Interactive Area Chart */
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={next24Hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />

              <XAxis
                dataKey="displayTime"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit={
                  activeMetric === 'temp'
                    ? `°${tempUnit}`
                    : activeMetric === 'rain'
                    ? '%'
                    : ` ${windUnit}`
                }
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [
                  activeMetric === 'temp'
                    ? `${val}°${tempUnit}`
                    : activeMetric === 'rain'
                    ? `${val}% chance`
                    : `${val} ${windUnit}`,
                  activeMetric === 'temp'
                    ? 'Temperature'
                    : activeMetric === 'rain'
                    ? 'Precipitation Prob'
                    : 'Wind Speed',
                ]}
              />

              {activeMetric === 'temp' && (
                <Area
                  type="monotone"
                  dataKey="tempVal"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
              )}

              {activeMetric === 'rain' && (
                <Area
                  type="monotone"
                  dataKey="rainProb"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rainGradient)"
                />
              )}

              {activeMetric === 'wind' && (
                <Area
                  type="monotone"
                  dataKey="windVal"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#windGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
