import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Sun,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Footprints,
  Utensils,
  Bike,
  Mountain,
  Waves,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OpenMeteoForecastData } from '../types/weather';
import { generatePlanningRecommendations } from '../utils/recommendations';

interface PlanningIntelligenceProps {
  data: OpenMeteoForecastData;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Footprints,
  Utensils,
  Bike,
  Mountain,
  Waves,
  Moon,
  Sun,
  Shirt,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
};

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({ data }) => {
  const recommendations = generatePlanningRecommendations(data);
  const [activeTab, setActiveTab] = useState<'overview' | 'outfit' | 'activities'>('overview');

  const { overallScore, overallVerdict, outfitAdvice, bestTimeWindow, healthAdvisories, activities } =
    recommendations;

  // Score badge color
  let scoreColor = 'bg-emerald-500 text-emerald-950 border-emerald-400';
  if (overallScore < 40) {
    scoreColor = 'bg-rose-500 text-rose-950 border-rose-400';
  } else if (overallScore < 70) {
    scoreColor = 'bg-amber-500 text-amber-950 border-amber-400';
  }

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-sky-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Smart Weather Intelligence</h3>
            <p className="text-xs text-slate-400">Planning & activity recommendations</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'overview'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outfit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'outfit'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Outfit & Gear
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'activities'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activities
          </button>
        </div>
      </div>

      {/* Main Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Outdoor Event Feasibility Card */}
          <div className="bg-gradient-to-r from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700/80 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Outdoor Event Feasibility
              </div>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                {overallVerdict}
              </p>

              {bestTimeWindow && (
                <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-semibold">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    Optimal Window: <strong>{bestTimeWindow.timeRange}</strong> ({bestTimeWindow.reason})
                  </span>
                </div>
              )}
            </div>

            {/* Score Radial Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shrink-0 min-w-[120px]">
              <span className={`text-3xl font-black px-3 py-1 rounded-xl border ${scoreColor}`}>
                {overallScore}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">Suitability Score</span>
            </div>
          </div>

          {/* Health & Safety Advisories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Health & Comfort Advisories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {healthAdvisories.map((adv, idx) => {
                const IconComp = ICON_MAP[adv.iconName] || Info;
                let bgStyle = 'bg-slate-800/60 border-slate-700/80 text-slate-200';
                let iconColor = 'text-sky-400';

                if (adv.level === 'alert') {
                  bgStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-200';
                  iconColor = 'text-rose-400';
                } else if (adv.level === 'warning') {
                  bgStyle = 'bg-amber-500/10 border-amber-500/30 text-amber-200';
                  iconColor = 'text-amber-400';
                } else if (adv.level === 'success') {
                  bgStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
                  iconColor = 'text-emerald-400';
                }

                return (
                  <div
                    key={`adv-${idx}`}
                    className={`p-4 rounded-2xl border flex items-start gap-3 transition ${bgStyle}`}
                  >
                    <IconComp className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold">{adv.title}</div>
                      <div className="text-xs opacity-80 leading-relaxed">{adv.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Activity Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Activity Snapshot
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                View all activities →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {activities.map((act) => {
                const IconComp = ICON_MAP[act.iconName] || Footprints;
                return (
                  <div
                    key={`snap-${act.name}`}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 ${act.colorClass}`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-xs font-extrabold">{act.rating}</span>
                    <span className="text-[10px] opacity-80 truncate max-w-full">{act.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Outfit & Gear Tab */}
      {activeTab === 'outfit' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">{outfitAdvice.title}</h4>
                <p className="text-xs text-slate-400">{outfitAdvice.description}</p>
              </div>
            </div>

            <hr className="border-slate-700/60" />

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Apparel & Accessories
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {outfitAdvice.items.map((item, idx) => (
                  <div
                    key={`item-${idx}`}
                    className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities Detailed Tab */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => {
            const IconComp = ICON_MAP[act.iconName] || Footprints;
            return (
              <div
                key={`act-${act.name}`}
                className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-700/60 rounded-xl text-slate-200">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{act.name}</div>
                      <div className="text-[10px] text-slate-400">{act.category}</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${act.colorClass}`}>
                    {act.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {act.reason}
                </p>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
