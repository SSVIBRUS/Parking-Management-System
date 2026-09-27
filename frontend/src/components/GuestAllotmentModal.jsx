import React, { useState } from 'react';
import { ShieldCheck, User, Car, Mail, CheckCircle, QrCode } from 'lucide-react';

export default function GuestAllotmentModal({ isOpen, onClose, onRefreshMap }) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [hostFaculty, setHostFaculty] = useState('Department of Computer Science');
  const [purpose, setPurpose] = useState('Official Visit');
  const [loading, setLoading] = useState(false);
  const [issuedPass, setIssuedPass] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/guest/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, guestEmail, vehicleNo, hostFaculty, purpose })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setIssuedPass(data.booking);
        onRefreshMap();
      } else {
        alert(data.message || 'Failed.');
      }
    } catch {
      setLoading(false);
      alert('Server error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fade-in space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Guest Parking Pass</h3>
              <p className="text-xs text-gray-500">Assign VIP slot near Gate 2 & send email pass</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
        </div>

        {/* Success State */}
        {issuedPass ? (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Pass Issued Successfully!</h4>
            
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-1.5">
              <p><strong>Pass Code:</strong> <span className="font-mono text-purple-700 font-bold">{issuedPass.passCode}</span></p>
              <p><strong>Guest:</strong> {issuedPass.guestName}</p>
              <p><strong>Slot:</strong> {issuedPass.assignedSlot}</p>
              <p><strong>Vehicle:</strong> {issuedPass.vehicleNo}</p>
            </div>

            <button onClick={() => { setIssuedPass(null); onClose(); }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
              <input type="text" required placeholder="Dr. Sharma" value={guestName} onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Email</label>
              <input type="email" placeholder="guest@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
              <input type="text" required placeholder="MH-12-VIP-01" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Department</label>
              <input type="text" value={hostFaculty} onChange={(e) => setHostFaculty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg transition">
              {loading ? 'Issuing Pass...' : 'Issue Guest Pass & Send Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
