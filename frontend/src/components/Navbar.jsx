import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Activity, MapPin, AlertCircle, BarChart3, 
  Building2, User, LogIn, LogOut, PlusCircle, LayoutDashboard, Home, Radio, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ backendHealth, onOpenAuth, onOpenReport, onOpenTrack }) {
  const { user, isAuthenticated, roles, logout } = useAuth();
  const { socketStatus } = useWebSocket();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
                UrbanFix AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Municipal Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors flex items-center gap-1.5 ${
                isCurrent('/') ? 'text-sky-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link 
              to="/dashboard" 
              className={`transition-colors flex items-center gap-1.5 ${
                isCurrent('/dashboard') ? 'text-sky-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Portal & Feed
            </Link>

            <button
              onClick={onOpenReport}
              className="text-slate-600 hover:text-sky-600 transition-colors flex items-center gap-1.5 font-medium"
            >
              <PlusCircle className="w-4 h-4 text-sky-500" />
              Report Issue
            </button>
          </nav>

          {/* Backend Status & Auth CTA */}
          <div className="flex items-center space-x-3">
            {/* Backend Status indicator badge */}
            <div className={`hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              backendHealth.status === 'UP'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : backendHealth.status === 'CHECKING'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                backendHealth.status === 'UP'
                  ? 'bg-emerald-500 animate-pulse'
                  : backendHealth.status === 'CHECKING'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`} />
              <Activity className="w-3.5 h-3.5" />
              <span>
                API: {backendHealth.status === 'UP' ? 'Online' : backendHealth.status === 'CHECKING' ? 'Checking...' : 'Offline'}
              </span>
            </div>

            {/* Real-Time WebSocket status indicator */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              socketStatus === 'CONNECTED'
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : socketStatus === 'CONNECTING'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                socketStatus === 'CONNECTED'
                  ? 'bg-sky-500 animate-ping'
                  : socketStatus === 'CONNECTING'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`} />
              <Zap className="w-3 h-3 text-sky-500" />
              <span>
                Socket: {socketStatus === 'CONNECTED' ? 'Live' : socketStatus === 'CONNECTING' ? 'Connecting' : 'Offline'}
              </span>
            </div>

            {/* Auth Button / User Badge */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <NotificationBell onTrackComplaint={onOpenTrack} />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <span className="font-semibold text-slate-800">{user?.username}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                    {roles[0]?.replace('ROLE_', '')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
