import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { OpenMeteoForecastData, TempUnit, WindSpeedUnit } from '../types/weather';
import { getWmoCodeInfo } from '../utils/wmoCodes';
import {
  formatTemp,
  formatWindSpeed,
  formatDayName,
  formatDate,
  formatTime,
} from '../utils/formatters';

interface DailyForecastProps {
  data: OpenMeteoForecastData;
  tempUnit: TempUnit;
  windUnit: WindSpeedUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  data,
  tempUnit,
  windUnit,
}) => {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);

  const daily = data.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate overall min/max temperatures for scaled temp bars across the 7 days
  const allMaxs = daily.temperature_2m_max;
  const allMins = daily.temperature_2m_min;
  const globalMax = Math.max(...allMaxs);
  const globalMin = Math.min(...allMins);
  const tempSpan = Math.max(1, globalMax - globalMin);

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">7-Day Weather Forecast</h3>
            <p className="text-xs text-slate-400">Weekly outlook & daily temperature trends</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
          7 Days
        </span>
      </div>

      {/* 7-Day List */}
      <div className="space-y-2">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const maxC = daily.temperature_2m_max[idx];
          const minC = daily.temperature_2m_min[idx];
          const weatherCode = daily.weather_code[idx];
          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const maxWindKmh = daily.wind_speed_10m_max?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const sunriseTime = daily.sunrise?.[idx] ? formatTime(daily.sunrise[idx], data.timezone) : '--:--';
          const sunsetTime = daily.sunset?.[idx] ? formatTime(daily.sunset[idx], data.timezone) : '--:--';

          const codeInfo = getWmoCodeInfo(weatherCode, 1);
          const IconComponent = codeInfo.icon;
          const isExpanded = expandedDayIndex === idx;

          // Bar positioning percentage
          const leftPercent = Math.max(0, Math.min(100, ((minC - globalMin) / tempSpan) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((globalMax - maxC) / tempSpan) * 100));

          return (
            <div
              key={`daily-${dateStr}`}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-slate-800/90 border-slate-700 shadow-lg'
                  : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/70'
              }`}
            >
              {/* Main Summary Row */}
              <button
                type="button"
                onClick={() => setExpandedDayIndex(isExpanded ? null : idx)}
                className="w-full p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left focus:outline-none"
              >
                {/* Day & Icon */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className={`p-2.5 rounded-xl border ${codeInfo.cardBg}`}>
                    <IconComponent className={`w-5 h-5 ${codeInfo.accentColor}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {formatDayName(dateStr, idx)}
                      {idx === 0 && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-400 font-semibold px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{formatDate(dateStr)}</div>
                  </div>
                </div>

                {/* Condition Description */}
                <div className="hidden md:block w-36 text-xs text-slate-300 font-medium truncate">
                  {codeInfo.description}
                </div>

                {/* Rain Probability Badge */}
                <div className="w-20 text-xs font-semibold flex items-center gap-1">
                  {rainProb > 0 ? (
                    <span className="text-cyan-400 flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
                      <Droplets className="w-3 h-3" />
                      {rainProb}%
                    </span>
                  ) : (
                    <span className="text-slate-500 font-normal">0%</span>
                  )}
                </div>

                {/* Relative Temperature Range Bar */}
                <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-10 text-right">
                    {formatTemp(minC, tempUnit)}
                  </span>

                  <div className="relative flex-1 h-2 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        right: `${rightPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-100 w-10">
                    {formatTemp(maxC, tempUnit)}
                  </span>
                </div>

                <div className="text-slate-400 hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable Daily Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Total Rain
                    </span>
                    <div className="text-sm font-bold text-slate-100">{rainSum.toFixed(1)} mm</div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-teal-400" /> Max Wind
                    </span>
                    <div className="text-sm font-bold text-slate-100">
                      {formatWindSpeed(maxWindKmh, windUnit)}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Max UV Index
                    </span>
                    <div className="text-sm font-bold text-slate-100">{uvMax.toFixed(1)}</div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sunrise className="w-3.5 h-3.5 text-orange-400" /> Sun Schedule
                    </span>
                    <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                      <span>↑ {sunriseTime}</span>
                      <span>↓ {sunsetTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
