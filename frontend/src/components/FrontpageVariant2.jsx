import React from 'react';
import { Building2, Navigation, CheckCircle, ShieldCheck, Mail, ArrowRight, Award } from 'lucide-react';

export default function FrontpageVariant2({ onOpenAuth, stats, onNavigateMap }) {
  return (
    <div className="w-full space-y-10 py-4">
      {/* Modern Emerald Academic Banner */}
      <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 p-8 md:p-12 shadow-2xl space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Theme 2: Clean Emerald Academic Portal</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
          Campus Integrated <span className="text-emerald-400">Parking & Gate-2</span> Access Control
        </h1>

        <p className="text-slate-300 text-base max-w-2xl">
          An official institutional portal for students, faculty, and guests. Seamless entry via Main Gate 1, 
          instant vehicle clearance notifications sent directly to email, and Gate-2 pedestrian distance optimization.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onNavigateMap}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Navigation className="w-4 h-4" />
            Open Institutional Parking Layout
          </button>
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            Student / Faculty Login
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Gate 2 Proximity</span>
            <p className="text-xl font-bold text-emerald-400">Optimized Walk</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Free Slots Available</span>
            <p className="text-xl font-bold text-slate-100">{stats.available} / {stats.total}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Auto Email Notification</span>
            <p className="text-xl font-bold text-sky-400">Active SMTP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
