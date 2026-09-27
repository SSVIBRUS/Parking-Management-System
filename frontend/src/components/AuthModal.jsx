import React, { useState } from 'react';
import { Mail, Lock, User, Car, Bike, UserCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('two_wheeler');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, vehicleNo, vehicleType, role })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError('Could not connect to server. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegister ? 'Create Account' : 'Login to Campus Park'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister 
              ? 'Register your vehicle & get a parking QR code' 
              : 'Enter your details & vehicle number to login'
            }
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name — always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Username — always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <div className="relative">
              <UserCircle className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Choose a username (e.g. john_doe)"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          {/* Email — always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Vehicle Number — always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration Number *</label>
            <input
              type="text"
              required
              placeholder="MH-12-AB-1234"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono tracking-wider"
            />
          </div>

          {/* Vehicle Type — always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVehicleType('two_wheeler')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition ${
                  vehicleType === 'two_wheeler'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Bike className="w-5 h-5" />
                Two Wheeler
              </button>
              <button
                type="button"
                onClick={() => setVehicleType('four_wheeler')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition ${
                  vehicleType === 'four_wheeler'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Car className="w-5 h-5" />
                Four Wheeler
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty / Staff</option>
                <option value="watchman">Security Watchman</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition disabled:opacity-60"
          >
            {loading 
              ? 'Please wait...' 
              : (isRegister 
                  ? 'Register Vehicle & Get QR Code' 
                  : 'Login & Register Vehicle'
                )
            }
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-5 text-center text-sm text-gray-500">
          {isRegister ? (
            <p>Already registered?{' '}
              <button onClick={() => { setIsRegister(false); setError(''); }} className="text-emerald-600 font-semibold hover:underline">
                Login here
              </button>
            </p>
          ) : (
            <p>New user?{' '}
              <button onClick={() => { setIsRegister(true); setError(''); }} className="text-emerald-600 font-semibold hover:underline">
                Register now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
