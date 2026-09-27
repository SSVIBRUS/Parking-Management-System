import React from 'react';
import { ShieldCheck, MapPin, Car, Bike, Sparkles, Navigation, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function FrontpageVariant1({ onSelectDesign, onOpenAuth, stats, onNavigateMap }) {
  return (
    <div className="w-full space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-sky-500/20 p-8 md:p-14 bg-gradient-to-br from-slate-950 via-[#0f172a] to-slate-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full filter blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Theme 1: Cyber-Glass Neon Edition</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">College Smart Parking</span> Management System
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Real-time interactive college parking navigator with automated email login notifications, 
            Main Gate 1 vehicle entry/exit routing, Gate 2 walking proximity optimization, and live empty slot locators.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onNavigateMap}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/30 transition transform hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4" />
              Explore Live 2D Campus Map
            </button>

            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-sky-500/50 text-slate-200 font-bold text-sm flex items-center gap-2 transition"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Login & Receive Email Credentials
            </button>
          </div>
        </div>

        {/* Live Metrics Quick Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Parking Slots</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{stats.total}</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-xs text-emerald-400 font-medium">Available Empty Slots</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.available}</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-amber-500/30 bg-amber-950/10">
            <span className="text-xs text-amber-400 font-medium">Two-Wheeler Slots Free</span>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">{stats.twoWheelerAvailable}</p>
          </div>
          <div className="p-4 rounded-xl glass-card border border-indigo-500/30 bg-indigo-950/10">
            <span className="text-xs text-indigo-400 font-medium">Four-Wheeler Slots Free</span>
            <p className="text-3xl font-extrabold text-indigo-400 mt-1">{stats.fourWheelerAvailable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
