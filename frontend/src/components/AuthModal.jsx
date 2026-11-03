import React, { useState } from 'react';
import { X, User, Shield, Briefcase, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, loading } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CITIZEN', // CITIZEN, OFFICER, ADMIN
  });

  if (!isOpen) return null;

  const handleQuickLogin = async (roleType) => {
    setError('');
    setSuccessMsg('');
    let u = '';
    let p = '';

    if (roleType === 'CITIZEN') {
      u = 'citizen@urbanfix.com';
      p = 'Citizen@123';
    } else if (roleType === 'OFFICER') {
      u = 'officer@urbanfix.com';
      p = 'Officer@123';
    } else if (roleType === 'ADMIN') {
      u = 'admin@urbanfix.com';
      p = 'Admin@123';
    }

    const res = await login(u, p);
    if (res.success) {
      setSuccessMsg(`Logged in successfully as ${roleType}!`);
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setError(res.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(usernameOrEmail, password);
    if (res.success) {
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setError(res.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(regData);
    if (res.success) {
      setSuccessMsg('Registered & logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium mb-2">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            JWT Authentication & RBAC
          </div>
          <h2 className="text-2xl font-bold">UrbanFix AI Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Role-Based Access for Citizens, Field Officers, and Municipal Administrators.
          </p>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 p-1 bg-white/10 rounded-xl">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            ⚡ Quick 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('CITIZEN')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Citizen</span>
              <span className="text-[10px] text-slate-400">citizen@urbanfix</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('OFFICER')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Officer</span>
              <span className="text-[10px] text-slate-400">officer@urbanfix</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Admin</span>
              <span className="text-[10px] text-slate-400">admin@urbanfix</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. citizen or citizen@urbanfix.com"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with JWT'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={regData.firstName}
                    onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={regData.lastName}
                    onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  value={regData.username}
                  onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Type</label>
                <select
                  value={regData.role}
                  onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="CITIZEN">Citizen (Report Issues & Track Status)</option>
                  <option value="OFFICER">Field Officer (Inspect & Resolve Tickets)</option>
                  <option value="ADMIN">Administrator (Full Municipal Control)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Register & Auto-Login'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

