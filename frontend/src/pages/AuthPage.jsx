import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Mail, User, ArrowRight, CheckCircle2, 
  AlertCircle, Sparkles, Building, Briefcase, KeyRound, Eye, EyeOff, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register, isAuthenticated, user, roles, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regRole, setRegRole] = useState('ROLE_CITIZEN');

  // 1-Click Demo Fillers
  const fillDemoCredentials = (roleType) => {
    setActiveTab('login');
    setErrorMessage('');
    setSuccessMessage('');
    if (roleType === 'citizen') {
      setLoginEmail('citizen@urbanfix.com');
      setLoginPassword('Citizen@123');
    } else if (roleType === 'officer') {
      setLoginEmail('officer@urbanfix.com');
      setLoginPassword('Officer@123');
    } else if (roleType === 'admin') {
      setLoginEmail('admin@urbanfix.com');
      setLoginPassword('Admin@123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Authentication successful! Entering portal...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } else {
      setErrorMessage(result.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const result = await register({
      username: regUsername,
      email: regEmail,
      password: regPassword,
      firstName: regFirstName,
      lastName: regLastName,
      roles: [regRole],
    });

    setLoading(false);

    if (result.success) {
      setSuccessMessage('Account registered successfully! Please sign in.');
      setActiveTab('login');
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
    } else {
      setErrorMessage(result.error || 'Registration failed. Check details and try again.');
    }
  };

  return (
    <div className="py-8 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand Visual & Role Explanations (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                  UrbanFix AI
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  Municipal Authorization Gateway
                </span>
              </div>
            </Link>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white leading-tight">
                Role-Based Access for Modern Civic Action
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Stateless JWT authentication with cryptographically isolated personas. Select or switch between any role instantly below.
              </p>
            </div>

            {/* Persona Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                  <User className="w-4 h-4" /> Citizen Persona
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Submit GPS-tagged defect photos, trigger real-time AI scans, rate repairs (1–5★), and reopen disputed tickets.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Briefcase className="w-4 h-4" /> Field Officer Persona
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Inspect department-filtered queue, follow SLA timers, update status to In-Progress/Resolved with proof.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Building className="w-4 h-4" /> Municipal Admin Persona
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Citywide geospatial map, manual officer dispatch, SLA breach oversight, and citizen satisfaction metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
            <span>Spring Security 6.x</span>
            <span>BCrypt + HMAC-SHA256</span>
          </div>
        </div>

        {/* Right Side: Auth Forms & 1-Click Demo Buttons (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          {/* If already authenticated, show alert with button to dashboard */}
          {isAuthenticated ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base">You are currently signed in!</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Logged in as <strong className="font-semibold">{user?.username}</strong> with role <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">{roles[0]}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  Go to Operations Dashboard <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs rounded-xl transition-all"
                >
                  Sign Out / Switch Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1-Click Quick Demo Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Instant 1-Click Demo Fill:
                  </span>
                  <span className="text-[10px] text-slate-400">Prefills email & password</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('citizen')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-slate-800 text-xs font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
                  >
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('officer')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 text-xs font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>Field Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800 text-xs font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
                  >
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>City Admin</span>
                  </button>
                </div>
              </div>

              {/* Tab Selector: Sign In vs Register */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'login'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'register'
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error & Success Feedback Alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form: Sign In */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@urbanfix.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-sky-500/20 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Sign In to Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Form: Registration */
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">First Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Last Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="johndoe"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Select Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option value="ROLE_CITIZEN">Citizen (Report & Track Issues)</option>
                      <option value="ROLE_OFFICER">Field Officer (Inspect & Resolve)</option>
                      <option value="ROLE_ADMIN">Municipal Admin (Dispatch & SLA Oversight)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="pt-2 text-center text-xs text-slate-500">
            <Link to="/" className="text-sky-600 hover:underline font-semibold">
              ← Return to UrbanFix Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

