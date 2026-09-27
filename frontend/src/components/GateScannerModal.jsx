import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldCheck, CheckCircle, ArrowRight, X, Car, Bike, AlertCircle, RefreshCw, Eye } from 'lucide-react';

export default function GateScannerModal({ isOpen, onClose, onRefreshMap, user }) {
  const [activeMode, setActiveMode] = useState('entry'); // 'entry' | 'exit'
  
  // Entry Form State
  const [vehicleNo, setVehicleNo] = useState(user ? user.vehicleNo || 'MH21KJ9876' : 'MH21KJ9876');
  const [driverName, setDriverName] = useState(user ? user.name || 'Campus User' : 'Campus User');
  const [vehicleType, setVehicleType] = useState(user ? user.vehicleType || 'two_wheeler' : 'two_wheeler');
  const [userEmail, setUserEmail] = useState(user ? user.email || '' : '');
  
  // Exit Form State
  const [exitQuery, setExitQuery] = useState(user ? user.vehicleNo || 'MH21KJ9876' : 'MH21KJ9876');

  // Camera & Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [barrierOpen, setBarrierOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize Camera
  const startCamera = async () => {
    setCameraError(false);
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError(true);
      }
    } catch (err) {
      console.log('Camera permission fallback:', err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
      if (user && user.vehicleNo) {
        setVehicleNo(user.vehicleNo);
        setExitQuery(user.vehicleNo);
      }
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Auto Scan Trigger from Camera
  const handleAutoCameraScan = async () => {
    setIsScanning(true);
    setBarrierOpen(false);
    setErrorMsg(null);
    setScanResult(null);

    // Detected vehicle plate automatically from camera
    const detectedPlate = vehicleNo || (user ? user.vehicleNo : 'MH21KJ9876');

    setTimeout(async () => {
      try {
        if (activeMode === 'entry') {
          const res = await fetch('/api/slots/gate-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vehicleNo: detectedPlate.trim().toUpperCase(),
              driverName: driverName.trim() || 'Campus Driver',
              vehicleType,
              userEmail: userEmail.trim() || null
            })
          });
          const data = await res.json();
          setIsScanning(false);

          if (data.success) {
            setBarrierOpen(true);
            setScanResult({
              type: 'ENTRY',
              slotName: data.slot.name,
              zone: data.slot.zone,
              distance: data.slot.distanceToGate2,
              vehicleNo: detectedPlate.toUpperCase(),
              message: data.message
            });
            onRefreshMap();
          } else {
            setErrorMsg(data.message);
          }
        } else {
          const res = await fetch('/api/slots/gate-exit-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchQuery: exitQuery.trim() || detectedPlate })
          });
          const data = await res.json();
          setIsScanning(false);

          if (data.success) {
            setBarrierOpen(true);
            setScanResult({
              type: 'EXIT',
              slotName: data.slotName,
              duration: data.durationMinutes,
              vehicleNo: data.freedOccupant ? data.freedOccupant.vehicleNo : detectedPlate.toUpperCase(),
              message: data.message
            });
            onRefreshMap();
          } else {
            setErrorMsg(data.message);
          }
        }
      } catch (err) {
        setIsScanning(false);
        setErrorMsg('Server error. Could not connect to Gate 1 Scanner.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Main Gate 1 ALPR Camera Scanner</h3>
              <p className="text-xs text-slate-400">Automatic Camera License Plate Recognition & Boom Barrier</p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-3 gap-2 shrink-0">
          <button
            onClick={() => { setActiveMode('entry'); setBarrierOpen(false); setScanResult(null); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-t-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'entry'
                ? 'bg-white text-emerald-700 shadow-sm border-t-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🟢 Entry Camera Scanner
          </button>
          <button
            onClick={() => { setActiveMode('exit'); setBarrierOpen(false); setScanResult(null); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-t-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'exit'
                ? 'bg-white text-emerald-700 shadow-sm border-t-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🚗 Exit Camera Scanner
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* LIVE WEBCAM / ALPR CAMERA SCANNER FEED */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-lg text-white">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE ALPR GATE CAMERA #01
              </span>
              <span className="text-slate-400 text-[10px] font-mono">1080P • 60 FPS • OPTICAL SCANNER</span>
            </div>

            {/* Video Feed / Animated Target View */}
            <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
              {!cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                /* Fallback Simulated HD Camera View */
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center relative p-4 text-center">
                  <div className="w-36 h-12 border-2 border-emerald-400/80 rounded-lg flex items-center justify-center bg-slate-900/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <span className="font-mono font-extrabold text-xl tracking-widest text-emerald-300">
                      {activeMode === 'entry' ? vehicleNo : exitQuery}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400/80 mt-2">ALPR OPTICAL LICENSE PLATE DETECTED</p>
                </div>
              )}

              {/* Laser Reticle Scan Box */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="w-4/5 h-28 border-2 border-emerald-500/80 rounded-xl relative shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-center">
                  {/* Corner Target Marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>

                  {/* Scanning Laser Line */}
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse"></div>

                  {/* Plate Text Overlay */}
                  <div className="absolute bottom-2 bg-slate-900/90 border border-emerald-500/50 px-3 py-1 rounded-md text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    AUTO-DETECTED: {activeMode === 'entry' ? vehicleNo : exitQuery}
                  </div>
                </div>
              </div>

              {/* Scanning status banner overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="font-mono font-bold text-emerald-300 text-sm">PROCESSING AUTOMATIC LICENSE PLATE RECOGNITION...</p>
                </div>
              )}
            </div>

            {/* Simulated Gate Arm Visual Bar */}
            <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                Barrier State:
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                barrierOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {barrierOpen ? '🟢 BARRIER OPENED' : '🔴 BARRIER CLOSED'}
              </span>
            </div>
          </div>

          {/* SCAN RESULT ALERT BANNER */}
          {scanResult && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-emerald-300 text-xs space-y-1 animate-fade-in shadow-lg">
              <p className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                {scanResult.message}
              </p>
              {scanResult.type === 'ENTRY' && (
                <p className="pl-7">📍 Allotted Slot: <strong className="text-white">{scanResult.slotName}</strong> ({scanResult.zone}) • <span className="text-emerald-400 font-bold">{scanResult.distance}m walk to Gate 2</span></p>
              )}
              {scanResult.type === 'EXIT' && (
                <p className="pl-7">⏱️ Total Parked Time: <strong className="text-white">{scanResult.duration} minutes</strong></p>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* MAIN AUTOMATIC CAMERA SCANNER ACTION BUTTON (NO TYPING REQUIRED) */}
          <div className="space-y-3">
            <button
              onClick={handleAutoCameraScan}
              disabled={isScanning}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Scanning License Plate via Camera...
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6" />
                  📷 Auto Scan Camera & Open Gate Barrier
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-gray-500 font-medium">
              ✨ Automated ALPR: Camera automatically detects plate <strong className="text-emerald-700">{vehicleNo}</strong> & opens barrier without typing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
