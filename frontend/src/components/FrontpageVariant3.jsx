import React from 'react';
import { Zap, Navigation, ArrowRight, ShieldCheck, Mail, CheckCircle } from 'lucide-react';

export default function FrontpageVariant3({ onOpenAuth, stats, onNavigateMap }) {
  return (
    <div className="w-full space-y-10 py-4">
      {/* High-Contrast Neo-Brutalist Banner */}
      <div className="rounded-3xl bg-amber-400 text-slate-950 p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.9)] border-4 border-slate-950 space-y-6">
        <div className="inline-block px-4 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-widest">
          Theme 3: High-Contrast Neo-Brutalist Edition
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
          COLLEGE PARKING <br />
          <span className="bg-slate-950 text-white px-3 py-1 inline-block mt-2">LIVE MAP & VACANCY</span>
        </h1>

        <p className="text-slate-950 font-bold text-base md:text-lg max-w-2xl border-l-4 border-slate-950 pl-4">
          Main Gate 1 Vehicle Entry & Exit • Gate-2 College Building Direct Path • Automated Slot Liberation on Exit • Instant Email Credentials Dispatch.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={onNavigateMap}
            className="px-8 py-4 rounded-xl bg-slate-950 text-amber-400 hover:bg-slate-900 font-black text-sm uppercase tracking-wider flex items-center gap-3 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition"
          >
            <Navigation className="w-5 h-5" />
            OPEN LIVE MAP ({stats.available} SLOTS FREE)
          </button>
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm uppercase tracking-wider flex items-center gap-3 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition"
          >
            <Mail className="w-5 h-5" />
            USER LOGIN / MAIL CREDENTIALS
          </button>
        </div>
      </div>
    </div>
  );
}
