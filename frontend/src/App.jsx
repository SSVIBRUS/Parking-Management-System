import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, User, Mail, ShieldCheck, Car, Bike, 
  LogOut, CheckCircle, Lock, Wrench, Users, Navigation, QrCode,
  Camera, FileText
} from 'lucide-react';

import InteractiveMap from './components/InteractiveMap';
import FreeSlotLocator from './components/FreeSlotLocator';
import WatchmanPanel from './components/WatchmanPanel';
import GuestAllotmentModal from './components/GuestAllotmentModal';
import AuthModal from './components/AuthModal';
import OutboxModal from './components/OutboxModal';
import QRCodeModal from './components/QRCodeModal';
import GateScannerModal from './components/GateScannerModal';
import DailyLogModal from './components/DailyLogModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [mapData, setMapData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campus_park_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    try {
      return !localStorage.getItem('campus_park_user');
    } catch {
      return true;
    }
  });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isOutboxOpen, setIsOutboxOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);

  const [outboxCount, setOutboxCount] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMapData = async () => {
    try {
      const res = await fetch('/api/slots/map');
      const data = await res.json();
      if (data.success) setMapData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOutboxCount = async () => {
    try {
      const res = await fetch('/api/auth/outbox');
      const data = await res.json();
      if (data.success) setOutboxCount(data.totalEmails);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMapData();
    fetchOutboxCount();
    const interval = setInterval(() => { fetchMapData(); fetchOutboxCount(); }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOccupySlot = async (slotId) => {
    try {
      const res = await fetch('/api/slots/occupy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          driverName: currentUser ? currentUser.name : 'User',
          vehicleNo: currentUser ? currentUser.vehicleNo : `MH-12-P-${Math.floor(1000 + Math.random() * 9000)}`,
          userEmail: currentUser ? currentUser.email : null
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Parked at ${data.slot.name} successfully!`);
        fetchMapData();
        fetchOutboxCount();
        setSelectedSlot(data.slot);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Server error', 'error');
    }
  };

  const handleVacateSlot = async (slotId) => {
    try {
      const res = await fetch('/api/slots/vacate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🚗 Vehicle exited! ${data.slotName} is now FREE.`);
        fetchMapData();
        fetchOutboxCount();
        if (selectedSlot && selectedSlot.id === slotId) setSelectedSlot(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Server error', 'error');
    }
  };

  const handleLoginSuccess = (user) => {
    try {
      localStorage.setItem('campus_park_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save device session', e);
    }
    setCurrentUser(user);
    setIsAuthOpen(false);
    showToast(`Welcome back ${user.name}! Device session active.`);
    fetchOutboxCount();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('campus_park_user');
    } catch (e) {
      console.error('Logout error', e);
    }
    setCurrentUser(null);
    setIsAuthOpen(true);
    showToast('Logged out from device');
  };

  const stats = mapData ? mapData.stats : {
    total: 220, available: 220,
    twoWheelerTotal: 175, twoWheelerAvailable: 175,
    guestTotal: 15, guestAvailable: 15,
    fourWheelerTotal: 30, fourWheelerAvailable: 30
  };

  // Navigation tabs definition
  const tabs = [
    { key: 'map', label: 'Parking Map', icon: MapPin },
    { key: 'locator', label: 'Find Free Slot', icon: Search },
    { key: 'watchman', label: 'Watchman Panel', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      
      {/* ===== TOP HEADER BAR ===== */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Car className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Campus Park</h1>
          </div>

          {/* Navigation Tabs (only visible when logged in) */}
          {currentUser && (
            <nav className="flex items-center bg-gray-100 p-1 rounded-xl">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Features 2 & 7 Header Quick Triggers */}
            <button onClick={() => setIsGateScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition">
              <Camera className="w-4 h-4 text-emerald-400" />
              Gate 1 Scanner
            </button>

            <button onClick={() => setIsDailyLogOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition">
              <FileText className="w-4 h-4" />
              Daily Logs & CSV
            </button>

            {currentUser && (
              <>
                <button onClick={() => setIsQROpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition">
                  <QrCode className="w-4 h-4" />
                  My QR Code
                </button>

                <button onClick={() => setIsGuestOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition">
                  <Users className="w-4 h-4" />
                  Guest Pass
                </button>

                <button onClick={() => setIsOutboxOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition relative">
                  <Mail className="w-4 h-4" />
                  Emails
                  {outboxCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {outboxCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl text-sm">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-gray-700">{currentUser.name}</span>
                <button onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 ml-1 transition" title="Logout from device">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition">
                <Lock className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===== TOAST NOTIFICATION ===== */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 toast-enter ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* LOGIN REQUIRED SCREEN */}
        {!currentUser ? (
          <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Please login or register to access the Campus Park Smart Parking System. 
              Your login details will be automatically sent to your email.
            </p>
            <button onClick={() => setIsAuthOpen(true)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Login / Register
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Quick Stats Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Total Slots</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm">
                <p className="text-xs text-emerald-600 font-medium">🟢 Available</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.available}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">🏍️ Two-Wheeler Free</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.twoWheelerAvailable}<span className="text-sm text-gray-400 font-normal">/{stats.twoWheelerTotal}</span></p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">🚗 Four-Wheeler Free</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.fourWheelerAvailable}<span className="text-sm text-gray-400 font-normal">/{stats.fourWheelerTotal}</span></p>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeTab === 'map' && (
              <InteractiveMap 
                mapData={mapData} 
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                onOccupySlot={handleOccupySlot}
                onVacateSlot={handleVacateSlot}
                user={currentUser}
              />
            )}

            {activeTab === 'locator' && mapData && (
              <FreeSlotLocator 
                slots={mapData.slots} 
                onSelectSlot={(slot) => { setSelectedSlot(slot); setActiveTab('map'); }}
                onOccupySlot={handleOccupySlot}
                onGoBack={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'watchman' && mapData && (
              <WatchmanPanel 
                slots={mapData.slots} 
                onRefreshMap={fetchMapData}
                onGoBack={() => setActiveTab('map')}
                onOpenGateScanner={() => setIsGateScannerOpen(true)}
                onOpenDailyLogs={() => setIsDailyLogOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* ===== MODALS ===== */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => { if (currentUser) setIsAuthOpen(false); }} 
        onLoginSuccess={handleLoginSuccess}
      />
      <GuestAllotmentModal 
        isOpen={isGuestOpen} 
        onClose={() => setIsGuestOpen(false)}
        onRefreshMap={fetchMapData}
      />
      <OutboxModal 
        isOpen={isOutboxOpen} 
        onClose={() => setIsOutboxOpen(false)}
      />
      <QRCodeModal 
        isOpen={isQROpen} 
        onClose={() => setIsQROpen(false)}
        user={currentUser}
      />

      {/* Feature 2: ALPR Gate 1 Scanner */}
      <GateScannerModal
        isOpen={isGateScannerOpen}
        onClose={() => setIsGateScannerOpen(false)}
        onRefreshMap={fetchMapData}
        user={currentUser}
      />

      {/* Feature 7: Daily Logs & CSV Export */}
      <DailyLogModal
        isOpen={isDailyLogOpen}
        onClose={() => setIsDailyLogOpen(false)}
      />

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-xs text-gray-400">
        © Campus Park
      </footer>
    </div>
  );
}
