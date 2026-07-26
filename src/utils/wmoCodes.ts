import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

export interface WmoCodeInfo {
  description: string;
  icon: LucideIcon;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  isRainy: boolean;
  isSnowy: boolean;
  isStormy: boolean;
  isSunny: boolean;
}

export function getWmoCodeInfo(code: number, isDay: number = 1): WmoCodeInfo {
  switch (code) {
    case 0:
      return {
        description: isDay ? 'Clear Sky' : 'Clear Night',
        icon: Sun,
        bgGradient: isDay
          ? 'from-amber-400 via-sky-400 to-blue-600'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        cardBg: isDay ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-950/40 border-indigo-500/20',
        accentColor: isDay ? 'text-amber-500' : 'text-indigo-400',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
      };
    case 1:
      return {
        description: isDay ? 'Mainly Clear' : 'Mostly Clear',
        icon: CloudSun,
        bgGradient: isDay
          ? 'from-sky-400 via-blue-500 to-indigo-600'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        cardBg: 'bg-sky-500/10 border-sky-500/20',
        accentColor: 'text-sky-500',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
      };
    case 2:
      return {
        description: 'Partly Cloudy',
        icon: CloudSun,
        bgGradient: isDay
          ? 'from-blue-400 via-slate-500 to-blue-700'
          : 'from-slate-900 via-slate-800 to-slate-950',
        cardBg: 'bg-slate-500/10 border-slate-500/20',
        accentColor: 'text-sky-400',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 3:
      return {
        description: 'Overcast',
        icon: Cloud,
        bgGradient: 'from-slate-500 via-gray-600 to-slate-800',
        cardBg: 'bg-slate-600/10 border-slate-600/20',
        accentColor: 'text-slate-400',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 45:
    case 48:
      return {
        description: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        icon: CloudFog,
        bgGradient: 'from-slate-400 via-zinc-500 to-slate-700',
        cardBg: 'bg-zinc-500/10 border-zinc-500/20',
        accentColor: 'text-zinc-400',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        description:
          code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        icon: CloudDrizzle,
        bgGradient: 'from-cyan-600 via-blue-600 to-slate-800',
        cardBg: 'bg-cyan-500/10 border-cyan-500/20',
        accentColor: 'text-cyan-400',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 56:
    case 57:
      return {
        description: 'Freezing Drizzle',
        icon: CloudDrizzle,
        bgGradient: 'from-blue-400 via-cyan-600 to-slate-800',
        cardBg: 'bg-cyan-500/10 border-cyan-500/20',
        accentColor: 'text-cyan-300',
        isRainy: true,
        isSnowy: true,
        isStormy: false,
        isSunny: false,
      };
    case 61:
    case 63:
    case 65:
      return {
        description:
          code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        icon: CloudRain,
        bgGradient: 'from-blue-600 via-indigo-700 to-slate-900',
        cardBg: 'bg-blue-500/10 border-blue-500/20',
        accentColor: 'text-blue-400',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 66:
    case 67:
      return {
        description: 'Freezing Rain',
        icon: CloudRain,
        bgGradient: 'from-sky-500 via-indigo-700 to-slate-900',
        cardBg: 'bg-sky-500/10 border-sky-500/20',
        accentColor: 'text-sky-300',
        isRainy: true,
        isSnowy: true,
        isStormy: false,
        isSunny: false,
      };
    case 71:
    case 73:
    case 75:
      return {
        description:
          code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        icon: CloudSnow,
        bgGradient: 'from-indigo-300 via-sky-500 to-slate-800',
        cardBg: 'bg-sky-400/10 border-sky-400/20',
        accentColor: 'text-sky-200',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        isSunny: false,
      };
    case 77:
      return {
        description: 'Snow Grains',
        icon: CloudSnow,
        bgGradient: 'from-slate-300 via-blue-500 to-slate-800',
        cardBg: 'bg-sky-400/10 border-sky-400/20',
        accentColor: 'text-sky-200',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        isSunny: false,
      };
    case 80:
    case 81:
    case 82:
      return {
        description:
          code === 80
            ? 'Slight Rain Showers'
            : code === 81
            ? 'Moderate Rain Showers'
            : 'Violent Rain Showers',
        icon: CloudRain,
        bgGradient: 'from-blue-500 via-sky-600 to-slate-900',
        cardBg: 'bg-blue-500/10 border-blue-500/20',
        accentColor: 'text-blue-400',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        isSunny: false,
      };
    case 85:
    case 86:
      return {
        description: code === 85 ? 'Slight Snow Showers' : 'Heavy Snow Showers',
        icon: CloudSnow,
        bgGradient: 'from-slate-400 via-blue-600 to-slate-900',
        cardBg: 'bg-sky-400/10 border-sky-400/20',
        accentColor: 'text-sky-200',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        isSunny: false,
      };
    case 95:
      return {
        description: 'Thunderstorm',
        icon: CloudLightning,
        bgGradient: 'from-purple-800 via-slate-900 to-black',
        cardBg: 'bg-purple-500/10 border-purple-500/20',
        accentColor: 'text-purple-400',
        isRainy: true,
        isSnowy: false,
        isStormy: true,
        isSunny: false,
      };
    case 96:
    case 99:
      return {
        description: 'Thunderstorm with Hail',
        icon: CloudHail,
        bgGradient: 'from-purple-900 via-indigo-950 to-black',
        cardBg: 'bg-purple-500/10 border-purple-500/20',
        accentColor: 'text-purple-300',
        isRainy: true,
        isSnowy: false,
        isStormy: true,
        isSunny: false,
      };
    default:
      return {
        description: 'Fair Weather',
        icon: Sparkles,
        bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
        cardBg: 'bg-sky-500/10 border-sky-500/20',
        accentColor: 'text-sky-400',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        isSunny: true,
      };
  }
}
