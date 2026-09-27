import React, { useState } from 'react';
import { MapPin, LogOut, CheckCircle, Car, Bike, Users, Footprints } from 'lucide-react';

export default function InteractiveMap({ 
  mapData, 
  selectedSlot, 
  setSelectedSlot, 
  onVacateSlot, 
  onOccupySlot,
  user
}) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [filterType, setFilterType] = useState('all');

  if (!mapData || !mapData.slots) {
    return <div className="p-8 text-center text-gray-400">Loading parking map...</div>;
  }

  const { slots } = mapData;

  const twSlots = slots.filter(s => s.type === 'two_wheeler');
  const guestSlots = slots.filter(s => s.type === 'guest');
  const fwSlots = slots.filter(s => s.type === 'four_wheeler');

  const twFree = twSlots.filter(s => s.status === 'available').length;
  const gsFree = guestSlots.filter(s => s.status === 'available').length;
  const fwFree = fwSlots.filter(s => s.status === 'available').length;

  const activeSlot = selectedSlot ? slots.find(s => s.id === selectedSlot.id) || selectedSlot : null;
  const hovered = hoveredSlot ? slots.find(s => s.id === hoveredSlot.id) || hoveredSlot : null;

  // Decide which slots to render based on filter
  const getFilteredSlots = (type) => {
    if (filterType === 'all') return true;
    return filterType === type;
  };

  return (
    <div className="space-y-5">

      {/* Simple Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Show All', icon: MapPin, count: slots.length },
          { key: 'two_wheeler', label: 'Two Wheeler', icon: Bike, count: twSlots.length, free: twFree },
          { key: 'guest', label: 'Guest Parking', icon: Users, count: guestSlots.length, free: gsFree },
          { key: 'four_wheeler', label: 'Four Wheeler', icon: Car, count: fwSlots.length, free: fwFree },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              filterType === tab.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.free !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                filterType === tab.key ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {tab.free} free
              </span>
            )}
          </button>
        ))}
      </div>

      {/* THE MAIN MAP */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-5 overflow-hidden">

        {/* Hover Tooltip (Absolute overlay so it never shifts map layout or causes shaking) */}
        {hovered && !activeSlot && (
          <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-3 text-sm pointer-events-none transition-opacity">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900">{hovered.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                hovered.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {hovered.status === 'occupied' ? '🔴 Taken' : '🟢 Free'}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">{hovered.zone} • {hovered.distanceToGate2}m walk to Gate 2</p>
          </div>
        )}

        <svg 
          viewBox="0 0 1100 620" 
          className="w-full min-w-[800px] h-auto select-none"
          style={{ background: '#f8fafc' }}
        >
          {/* Light grid background */}
          <defs>
            <pattern id="simpleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1100" height="620" fill="url(#simpleGrid)" />

          {/* ===== COLLEGE BUILDING (Left Block) ===== */}
          <rect x="20" y="20" width="200" height="580" rx="16" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="35" y="35" width="170" height="550" rx="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="120" y="75" textAnchor="middle" fill="#475569" fontSize="18" fontWeight="800">COLLEGE</text>
          <text x="120" y="98" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="600">BUILDING</text>
          
          {/* Building windows */}
          {[130, 180, 230, 280, 330, 380, 430, 480, 530].map((y, i) => (
            <g key={i}>
              <rect x="50" y={y} width="35" height="25" rx="4" fill="#e2e8f0" />
              <rect x="102" y={y} width="35" height="25" rx="4" fill="#e2e8f0" />
              <rect x="154" y={y} width="35" height="25" rx="4" fill="#e2e8f0" />
            </g>
          ))}

          {/* ===== GATE 2 (College Entry - Left Side) ===== */}
          <rect x="195" y="115" width="70" height="36" rx="8" fill="#059669" />
          <text x="230" y="131" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800">GATE 2</text>
          <text x="230" y="144" textAnchor="middle" fill="#d1fae5" fontSize="8" fontWeight="600">Walk In</text>

          {/* ===== MAIN GATE 1 (Vehicle Entry/Exit - Right Side) ===== */}
          <rect x="1005" y="50" width="80" height="40" rx="8" fill="#d97706" />
          <text x="1045" y="68" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800">MAIN GATE</text>
          <text x="1045" y="82" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="700">Entry & Exit</text>

          {/* ===== INTERNAL ROAD PATH ===== */}
          <path 
            d="M 1045 95 L 1045 570 L 280 570 L 280 155" 
            fill="none" stroke="#e2e8f0" strokeWidth="35" strokeLinecap="round" strokeLinejoin="round"
          />
          <path 
            d="M 1045 95 L 1045 570 L 280 570 L 280 155" 
            fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="8 6"
          />
          <text x="1045" y="570" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">ROAD</text>

          {/* ===== SECTION LABELS ===== */}

          {/* Two-Wheeler Header */}
          {getFilteredSlots('two_wheeler') && (
            <g>
              <rect x="280" y="22" width="710" height="28" rx="8" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
              <text x="635" y="41" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="700">
                🏍️  TWO WHEELER PARKING  —  {twFree} Free out of {twSlots.length} Slots
              </text>
            </g>
          )}

          {/* Guest Header */}
          {getFilteredSlots('guest') && (
            <g>
              <rect x="280" y="192" width="400" height="26" rx="8" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
              <text x="480" y="210" textAnchor="middle" fill="#6b21a8" fontSize="11" fontWeight="700">
                ⭐  GUEST VIP PARKING  —  {gsFree} Free out of {guestSlots.length} Slots
              </text>
            </g>
          )}

          {/* Four-Wheeler Header */}
          {getFilteredSlots('four_wheeler') && (
            <g>
              <rect x="280" y="320" width="710" height="26" rx="8" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" />
              <text x="635" y="338" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="700">
                🚗  FOUR WHEELER PARKING  —  {fwFree} Free out of {fwSlots.length} Slots
              </text>
            </g>
          )}

          {/* ===== TWO-WHEELER DOTS (175 Slots in neat rows) ===== */}
          {getFilteredSlots('two_wheeler') && twSlots.map((slot, idx) => {
            const cols = 35;
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const cx = 300 + col * 19.5;
            const cy = 68 + row * 22;
            const isFree = slot.status === 'available';
            const isSel = selectedSlot && selectedSlot.id === slot.id;

            return (
              <circle
                key={slot.id}
                cx={cx} cy={cy}
                r={isSel ? 8 : 6}
                fill={isFree ? '#22c55e' : '#ef4444'}
                stroke={isSel ? '#1d4ed8' : isFree ? '#16a34a' : '#dc2626'}
                strokeWidth={isSel ? 3 : 1}
                className={`cursor-pointer ${isFree ? 'dot-free' : 'dot-taken'}`}
                onClick={() => setSelectedSlot(slot)}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
              />
            );
          })}

          {/* ===== GUEST PARKING SLOTS (15 Slots as small rectangles) ===== */}
          {getFilteredSlots('guest') && guestSlots.map((slot, idx) => {
            const col = idx % 5;
            const row = Math.floor(idx / 5);
            const x = 300 + col * 75;
            const y = 228 + row * 28;
            const isFree = slot.status === 'available';
            const isSel = selectedSlot && selectedSlot.id === slot.id;

            return (
              <g key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
                className="cursor-pointer"
              >
                <rect x={x} y={y} width="60" height="20" rx="10" 
                  fill={isFree ? '#22c55e' : '#a855f7'} 
                  stroke={isSel ? '#1d4ed8' : isFree ? '#16a34a' : '#9333ea'}
                  strokeWidth={isSel ? 2.5 : 1}
                />
                <text x={x + 30} y={y + 14} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
                  {slot.id}
                </text>
              </g>
            );
          })}

          {/* ===== FOUR-WHEELER PARKING (30 Slots as car bays) ===== */}
          {getFilteredSlots('four_wheeler') && fwSlots.map((slot, idx) => {
            const col = idx % 10;
            const row = Math.floor(idx / 10);
            const x = 295 + col * 68;
            const y = 360 + row * 58;
            const isFree = slot.status === 'available';
            const isSel = selectedSlot && selectedSlot.id === slot.id;

            return (
              <g key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
                className="cursor-pointer"
              >
                <rect x={x} y={y} width="58" height="42" rx="8" 
                  fill={isFree ? '#dcfce7' : '#fee2e2'} 
                  stroke={isSel ? '#1d4ed8' : isFree ? '#22c55e' : '#ef4444'}
                  strokeWidth={isSel ? 3 : 1.5}
                />
                {/* Status dot inside bay */}
                <circle cx={x + 14} cy={y + 14} r="5" 
                  fill={isFree ? '#22c55e' : '#ef4444'} 
                />
                <text x={x + 29} y={y + 30} textAnchor="middle" fill={isFree ? '#166534' : '#991b1b'} fontSize="9" fontWeight="700">
                  {slot.id}
                </text>
              </g>
            );
          })}

          {/* ===== SIMPLE LEGEND (Bottom Right) ===== */}
          <g>
            <rect x="880" y="545" width="200" height="55" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="900" cy="563" r="6" fill="#22c55e" />
            <text x="912" y="567" fill="#166534" fontSize="10" fontWeight="600">= Free / Empty Slot</text>
            <circle cx="900" cy="583" r="6" fill="#ef4444" />
            <text x="912" y="587" fill="#991b1b" fontSize="10" fontWeight="600">= Occupied / Taken</text>
          </g>
        </svg>
      </div>

      {/* SELECTED SLOT DETAIL CARD */}
      {activeSlot && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                {activeSlot.name}
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  activeSlot.status === 'occupied' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {activeSlot.status === 'occupied' ? '🔴 Occupied' : '🟢 Free'}
                </span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeSlot.zone} • {activeSlot.distanceToGate2}m walk to Gate 2
              </p>
            </div>
            <button 
              onClick={() => setSelectedSlot(null)}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Slot Information</h4>
              {activeSlot.status === 'occupied' && activeSlot.occupiedBy ? (
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p>👤 <strong>Driver:</strong> {activeSlot.occupiedBy.driverName}</p>
                  <p>🚗 <strong>Vehicle:</strong> <span className="font-mono font-bold text-gray-900">{activeSlot.occupiedBy.vehicleNo}</span></p>
                  <p>🕐 <strong>Parked since:</strong> {new Date(activeSlot.occupiedBy.entryTime).toLocaleTimeString()}</p>
                </div>
              ) : (
                <p className="text-sm text-green-700 font-medium">
                  ✅ This slot is empty and available for parking.
                </p>
              )}
            </div>

            {/* Action */}
            <div className="flex flex-col justify-center">
              {activeSlot.status === 'occupied' ? (
                <button
                  onClick={() => onVacateSlot(activeSlot.id)}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  Vehicle Exit — Mark Slot as Free
                </button>
              ) : (
                <button
                  onClick={() => onOccupySlot(activeSlot.id)}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  Park My Vehicle Here
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
