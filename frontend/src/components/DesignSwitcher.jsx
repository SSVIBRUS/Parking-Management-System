import React from 'react';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DesignSwitcher({ activeDesign, setActiveDesign }) {
  const designs = [
    { id: 1, name: 'Cyber-Glass Neon', badge: 'Theme 1', color: 'from-sky-500 to-emerald-500' },
    { id: 2, name: 'Emerald Academic', badge: 'Theme 2', color: 'from-emerald-500 to-teal-600' },
    { id: 3, name: 'Neo-Brutalist Tech', badge: 'Theme 3', color: 'from-amber-400 to-yellow-500' },
    { id: 4, name: 'CAD Blueprint', badge: 'Theme 4', color: 'from-blue-600 to-indigo-600' },
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Select Frontpage Design Theme
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <p className="text-[11px] text-slate-400">
              User Request: Preview & pick from 4 frontpage design variants
            </p>
          </div>
        </div>

        {/* 4 Theme Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {designs.map((d) => {
            const isActive = activeDesign === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDesign(d.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition transform active:scale-95 ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 shadow-md shadow-slate-100/20 ring-2 ring-sky-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <span>{d.badge}: {d.name}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
