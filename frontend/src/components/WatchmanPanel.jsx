import React, { useState } from 'react';
import { ShieldCheck, Search, Wrench, RefreshCw, Trash2, ArrowLeft, Camera, FileText } from 'lucide-react';

export default function WatchmanPanel({ slots, onRefreshMap, onGoBack, onOpenGateScanner, onOpenDailyLogs }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState('available');
  const [driverName, setDriverName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [notes, setNotes] = useState('Manual correction');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  let filteredSlots = slots;
  if (filterType !== 'all') {
    filteredSlots = filteredSlots.filter(s => s.type === filterType || s.status === filterType);
  }
  if (searchQuery) {
    filteredSlots = filteredSlots.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.occupiedBy && s.occupiedBy.vehicleNo && s.occupiedBy.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const handleApplyOverride = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/slots/watchman-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, newStatus: overrideStatus, driverName, vehicleNo, notes })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        onRefreshMap();
        setTimeout(() => { setSelectedSlot(null); setMessage(null); }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setLoading(false);
      setMessage({ type: 'error', text: 'Server error.' });
    }
  };

  const handleResetAllSlots = async () => {
    setResetLoading(true);
    try {
      const res = await fetch('/api/slots/reset-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setResetLoading(false);
      setShowResetConfirm(false);
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        onRefreshMap();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setResetLoading(false);
      setShowResetConfirm(false);
      setMessage({ type: 'error', text: 'Server error resetting slots.' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
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
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Watchman Control Panel</h2>
              <p className="text-xs text-gray-500">Override slot status, fix glitches, manage vehicles manually</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {onOpenGateScanner && (
              <button onClick={onOpenGateScanner}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition">
                <Camera className="w-4 h-4 text-emerald-400" /> Gate 1 Barrier Scanner
              </button>
            )}

            {onOpenDailyLogs && (
              <button onClick={onOpenDailyLogs}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition">
                <FileText className="w-4 h-4" /> Daily Report & CSV
              </button>
            )}

            <button onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium border border-red-200 transition">
              <Trash2 className="w-4 h-4" /> Mark All Empty
            </button>

            <button onClick={onRefreshMap} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Reset Confirmation Banner */}
        {showResetConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div>
              <p className="text-sm font-bold text-red-800">⚠️ Are you sure?</p>
              <p className="text-xs text-red-600">This will mark ALL {slots.length} parking slots as empty.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleResetAllSlots} disabled={resetLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition disabled:opacity-60">
                {resetLoading ? 'Resetting...' : 'Yes, Reset All Slots'}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search slot or vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {['all', 'two_wheeler', 'guest', 'four_wheeler', 'occupied'].map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition ${filterType === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-50'}`}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filteredSlots.slice(0, 80).map(slot => {
          const isOccupied = slot.status === 'occupied';
          return (
            <button key={slot.id}
              onClick={() => { setSelectedSlot(slot); setOverrideStatus(isOccupied ? 'available' : 'occupied'); }}
              className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                isOccupied ? 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100' : 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="truncate">{slot.name}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </div>
              {isOccupied && slot.occupiedBy && (
                <p className="text-[9px] text-gray-500 truncate font-mono">{slot.occupiedBy.vehicleNo}</p>
              )}
            </button>
          );
        })}
      </div>

      {filteredSlots.length > 80 && (
        <p className="text-center text-sm text-gray-400">Showing first 80 of {filteredSlots.length}. Use search to narrow down.</p>
      )}

      {/* Override Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                Override: {selectedSlot.name}
              </h3>
              <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleApplyOverride} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set Status</label>
                <select value={overrideStatus} onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm">
                  <option value="available">🟢 Mark as FREE (Empty)</option>
                  <option value="occupied">🔴 Mark as OCCUPIED</option>
                  <option value="maintenance">🟡 Under Maintenance</option>
                </select>
              </div>
              {overrideStatus === 'occupied' && (
                <>
                  <input type="text" placeholder="Driver name" value={driverName} onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm" />
                  <input type="text" placeholder="Vehicle number" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-mono" />
                </>
              )}
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm" />
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition">
                {loading ? 'Applying...' : 'Apply Override'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
