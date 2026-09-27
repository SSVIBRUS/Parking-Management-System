import React, { useState } from 'react';
import { Search, Bike, Car, Users, Footprints, CheckCircle, ArrowLeft } from 'lucide-react';

export default function FreeSlotLocator({ slots, onSelectSlot, onOccupySlot, onGoBack }) {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  let freeSlots = slots.filter(s => s.status === 'available');

  if (category !== 'all') {
    freeSlots = freeSlots.filter(s => s.type === category);
  }

  if (searchQuery) {
    freeSlots = freeSlots.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort by closest to Gate 2
  freeSlots.sort((a, b) => a.distanceToGate2 - b.distanceToGate2);

  const bestSlot = freeSlots[0] || null;

  return (
    <div className="space-y-5">

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {onGoBack && (
              <button 
                onClick={onGoBack}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 text-xs font-semibold border border-gray-200 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              Find Free Parking Slot
            </h2>
          </div>
          <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
            {freeSlots.length} slots available
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by slot name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {[
            { key: 'all', label: 'All Types' },
            { key: 'two_wheeler', label: '🏍️ Two Wheeler' },
            { key: 'guest', label: '⭐ Guest' },
            { key: 'four_wheeler', label: '🚗 Four Wheeler' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                category === tab.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Best Recommendation */}
      {bestSlot && (
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              ⭐ Best Recommendation (Closest to Gate 2)
            </p>
            <h3 className="text-xl font-bold text-gray-900">{bestSlot.name}</h3>
            <p className="text-sm text-gray-600">{bestSlot.zone} • Only {bestSlot.distanceToGate2}m walk to college entrance</p>
          </div>
          <button
            onClick={() => onOccupySlot(bestSlot.id)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Park Here
          </button>
        </div>
      )}

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {freeSlots.slice(0, 30).map(slot => (
          <div
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 group-hover:text-emerald-700 transition">{slot.name}</span>
              <span className="w-3 h-3 rounded-full bg-green-500 dot-free"></span>
            </div>
            <p className="text-xs text-gray-500">{slot.zone}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                {slot.distanceToGate2}m to Gate 2
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOccupySlot(slot.id);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold transition"
              >
                Park Here
              </button>
            </div>
          </div>
        ))}
      </div>

      {freeSlots.length > 30 && (
        <p className="text-center text-sm text-gray-500 py-2">
          Showing first 30 of {freeSlots.length} available slots. Use the search bar to find specific slots.
        </p>
      )}
    </div>
  );
}
