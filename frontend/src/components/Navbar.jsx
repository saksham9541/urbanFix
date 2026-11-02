import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, MapPin, AlertCircle, BarChart3, Building2, User } from 'lucide-react';

export default function Navbar({ backendHealth }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
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
                Phase 1 MVP
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/" className="text-sky-600 hover:text-sky-700 transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              Features
            </a>
            <a href="#map-preview" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              Live Map
            </a>
            <a href="#departments" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              Departments
            </a>
            <a href="#analytics" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Analytics
            </a>
          </nav>

          {/* Backend Status & Auth CTA */}
          <div className="flex items-center space-x-4">
            {/* Status indicator badge */}
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
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
                Backend: {backendHealth.status === 'UP' ? 'Online' : backendHealth.status === 'CHECKING' ? 'Checking...' : 'Offline'}
              </span>
            </div>

            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              onClick={() => alert('Phase 2 Feature: JWT Authentication & User Login')}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Citizen Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
