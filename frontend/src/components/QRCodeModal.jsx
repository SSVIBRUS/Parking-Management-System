import React, { useState, useRef } from 'react';
import { QrCode, Download, Printer, X, Car, Bike, User, Mail, Shield, ArrowLeft } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, user }) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  if (!isOpen || !user) return null;

  const qrData = JSON.stringify({
    passId: user.parkingPassId,
    name: user.name,
    username: user.username || '',
    email: user.email,
    vehicleNo: user.vehicleNo,
    vehicleType: user.vehicleType,
    role: user.role
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  // Download QR as PNG
  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CampusPark-QR-${user.parkingPassId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
    setLoading(false);
  };

  // Print QR pass
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Campus Park - Parking Pass</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 30px; text-align: center; }
          .header { background: #059669; color: #fff; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
          .header h2 { font-size: 20px; margin-bottom: 4px; }
          .header p { font-size: 12px; opacity: 0.85; }
          .qr-img { width: 200px; height: 200px; border: 2px solid #e2e8f0; border-radius: 8px; margin: 16px auto; }
          .pass-id { font-size: 11px; color: #6b7280; margin-top: 12px; }
          .pass-code { font-size: 22px; font-weight: bold; color: #059669; font-family: monospace; letter-spacing: 2px; }
          .details { text-align: left; margin: 20px auto; max-width: 280px; background: #f8fafc; padding: 16px; border-radius: 10px; font-size: 13px; }
          .details p { margin: 6px 0; color: #374151; }
          .details strong { color: #111827; }
          .footer { margin-top: 24px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🅿️ Campus Park</h2>
          <p>Parking Pass</p>
        </div>
        <img class="qr-img" src="${qrImageUrl}" alt="QR Code" />
        <p class="pass-id">PARKING PASS ID</p>
        <p class="pass-code">${user.parkingPassId || 'N/A'}</p>
        <div class="details">
          <p><strong>Name:</strong> ${user.name}</p>
          ${user.username ? `<p><strong>Username:</strong> ${user.username}</p>` : ''}
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Vehicle:</strong> ${user.vehicleNo} (${(user.vehicleType || '').replace('_', ' ')})</p>
          <p><strong>Role:</strong> ${user.role || 'Student'}</p>
        </div>
        <div class="footer">
          Show this pass at Main Gate 1 for quick vehicle entry.<br/>
          © Campus Park
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Sticky Back Button (always visible at top) */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-700 font-semibold transition bg-gray-100 hover:bg-emerald-50 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">

        {/* Green Header */}
        <div className="bg-emerald-600 text-white px-6 py-5 text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Your Parking QR Code</h3>
          <p className="text-emerald-100 text-sm mt-1">Show this at Main Gate 1 for quick entry</p>
        </div>

        {/* QR Code Display */}
        <div className="p-6 space-y-5">
          
          {/* QR Image */}
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-xl border-2 border-gray-200 shadow-inner">
              <img 
                src={qrImageUrl} 
                alt="Parking QR Code" 
                className="w-48 h-48 rounded-lg"
              />
            </div>
          </div>

          {/* Pass ID Badge */}
          <div className="text-center">
            <span className="text-xs text-gray-500 font-medium">PARKING PASS ID</span>
            <p className="text-xl font-bold font-mono text-emerald-700 tracking-wider mt-0.5">
              {user.parkingPassId || 'GENERATING...'}
            </p>
          </div>

          {/* User Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5 text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{user.name}</span>
              {user.username && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">@{user.username}</span>
              )}
            </div>
            <div className="flex items-center gap-2.5 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-700">
              {user.vehicleType === 'four_wheeler' 
                ? <Car className="w-4 h-4 text-gray-400" /> 
                : <Bike className="w-4 h-4 text-gray-400" />
              }
              <span className="font-mono font-bold text-gray-900 tracking-wider">{user.vehicleNo}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                {(user.vehicleType || '').replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-700">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="capitalize">{user.role || 'Student'}</span>
            </div>
          </div>

          {/* Action Buttons — Download, Print, Close */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md transition disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {loading ? 'Saving...' : 'Download'}
            </button>
            <button
              onClick={handlePrint}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex flex-col items-center justify-center gap-1 transition"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Big Back to Dashboard button at bottom */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

        </div>
        </div>{/* end scrollable */}
      </div>
    </div>
  );
}
