import { TempUnit, WindSpeedUnit } from '../types/weather';

export function convertTemp(tempC: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function formatTemp(tempC: number, unit: TempUnit): string {
  const converted = convertTemp(tempC, unit);
  return `${converted}°${unit}`;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((kmh / 3.6) * 10) / 10;
  }
  return Math.round(kmh);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const val = convertWindSpeed(kmh, unit);
  const unitLabel = unit === 'mph' ? 'mph' : unit === 'ms' ? 'm/s' : 'km/h';
  return `${val} ${unitLabel}`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): { label: string; color: string; bg: string } {
  if (uvIndex < 3) {
    return { label: 'Low', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' };
  }
  if (uvIndex < 6) {
    return { label: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
  }
  if (uvIndex < 8) {
    return { label: 'High', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' };
  }
  if (uvIndex < 11) {
    return { label: 'Very High', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500' };
  }
  return { label: 'Extreme', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-600' };
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, options || { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(timeStr: string, timezone?: string): string {
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) {
    // If it's a string like "2026-07-26T06:00"
    const parts = timeStr.split('T');
    if (parts.length > 1) return parts[1].substring(0, 5);
    return timeStr;
  }
  try {
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    });
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}

export function formatDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}
