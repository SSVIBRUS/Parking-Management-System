import React from 'react';
import { Layers, Navigation, Mail, Compass, Cpu, CheckCircle } from 'lucide-react';

export default function FrontpageVariant4({ onOpenAuth, stats, onNavigateMap }) {
  return (
    <div className="w-full space-y-10 py-4">
      {/* Blueprint Technical Grid Banner */}
      <div className="rounded-3xl bg-[#031329] border-2 border-sky-500/40 p-8 md:p-12 shadow-2xl blueprint-grid relative space-y-6">
        <div className="flex items-center justify-between border-b border-sky-500/30 pb-4">
          <div className="inline-flex items-center space-x-2 text-sky-400 text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>THEME 4: ARCHITECTURAL CAD BLUEPRINT EDITION</span>
          </div>
          <span className="text-xs font-mono text-sky-300">LAYOUT: CAD-CAMPUS-v2.4</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-100 font-mono tracking-tight">
          [CAMPUS_PARKING_BLUEPRINT] <br />
          <span className="text-sky-400">GATE-1 & GATE-2 SPATIAL NAVIGATOR</span>
        </h1>

        <p className="text-slate-300 font-mono text-sm max-w-2xl leading-relaxed">
          Technical grid mapping of college infrastructure. Coordinates: Main Gate 1 [Vehicle Route], Gate 2 [Pedestrian Entry], 
          Two-Wheeler Zone (North Grid), Four-Wheeler Zone (South Grid).
        </p>

        <div className="flex flex-wrap gap-4 pt-2 font-mono">
          <button
            onClick={onNavigateMap}
            className="px-6 py-3.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <Navigation className="w-4 h-4" />
            EXECUTE 2D MAP ROUTER
          </button>
          <button
            onClick={onOpenAuth}
            className="px-6 py-3.5 rounded-lg bg-slate-900 border border-sky-500/50 hover:bg-slate-800 text-sky-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            DISPATCH AUTH MAILER
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-sky-500/20 text-xs font-mono text-slate-400">
          <div><span className="text-sky-400">GRID STATUS:</span> ONLINE</div>
          <div><span className="text-sky-400">GATE 1 METRICS:</span> 100% CLEAR</div>
          <div><span className="text-sky-400">GATE 2 WALK OPT:</span> ACTIVE</div>
          <div><span className="text-sky-400">FREE CAPACITY:</span> {stats.available}/{stats.total}</div>
        </div>
      </div>
    </div>
  );
}
