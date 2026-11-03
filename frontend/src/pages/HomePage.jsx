import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, CheckCircle2, ArrowRight, RefreshCw, 
  Cpu, Database, Server, Sparkles, Building, Layers, Shield, User, Briefcase, Lock
} from 'lucide-react';
import MapView from '../components/MapView';
import RoleDashboard from '../components/RoleDashboard';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ backendHealth, onRefreshHealth, onOpenAuth }) {
  const { isAuthenticated, user } = useAuth();
  const [aiHealth, setAiHealth] = useState({ status: 'CHECKING', data: null });
  const [refreshing, setRefreshing] = useState(false);

  const checkAiHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/health');
      if (res.ok) {
        const data = await res.json();
        setAiHealth({ status: 'UP', data });
      } else {
        setAiHealth({ status: 'DOWN', data: null });
      }
    } catch {
      setAiHealth({ status: 'DOWN', data: null });
    }
  };

  useEffect(() => {
    checkAiHealth();
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([onRefreshHealth(), checkAiHealth()]);
    setRefreshing(false);
  };

  return (
    <div className="space-y-12 py-8">
      {/* If authenticated, display the interactive Role Dashboard banner at top */}
      {isAuthenticated && <RoleDashboard />}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Phase 2: JWT Security & Role-Based Access Control
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Smart Civic Resolution with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Role-Based JWT Security
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Report road hazards, broken utilities, and sanitation issues. UrbanFix AI features full stateless JWT authentication with distinct workflows for Citizens, Field Officers, and Administrators.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-500/25 text-sm"
              >
                <Lock className="w-4 h-4" />
                Sign In / Switch Roles
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert(`Reporting active under authenticated session: ${user?.username}`)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all text-sm"
              >
                <Camera className="w-4 h-4" />
                Report New Civic Issue
              </button>
            )}

            <a
              href="#map-preview"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all text-sm backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              Explore Issue Map
            </a>
          </div>
        </div>

        {/* Live Service Health Dashboard Card */}
        <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-sky-400" /> Spring Boot API
              </span>
              <span className={`w-2 h-2 rounded-full ${backendHealth.status === 'UP' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              {backendHealth.status === 'UP' ? 'Connected (Port 8080)' : 'Offline / Checking'}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              JWT: Stateless Filters Active
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400" /> Python FastAPI AI
              </span>
              <span className={`w-2 h-2 rounded-full ${aiHealth.status === 'UP' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              {aiHealth.status === 'UP' ? 'Healthy (Port 8000)' : 'Microservice Ready'}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Vision: YOLOv8 Civic Vision Ready
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Database & RBAC
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              PostgreSQL 17 & Redis 7
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Roles: Citizen, Officer, Admin Seeded
            </div>
          </div>
        </div>
      </section>

      {/* 3-Role Showcase Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Supported System Roles</h2>
          <p className="text-sm text-slate-600">Each role has cryptographically signed JWT privileges and distinct workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Citizen Role</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                ROLE_CITIZEN
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snap photo evidence, report road/waste/utility issues, view GPS map, and receive real-time notifications on issue status.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg">
              Demo: <span className="font-semibold text-slate-800">citizen@urbanfix.com</span> / <span className="font-semibold text-slate-800">Citizen@123</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Field Officer Role</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                ROLE_OFFICER
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned department tickets based on municipal jurisdiction. Inspect complaints, upload resolution proof photos, and meet SLA timers.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg">
              Demo: <span className="font-semibold text-slate-800">officer@urbanfix.com</span> / <span className="font-semibold text-slate-800">Officer@123</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Administrator Role</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                ROLE_ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full administrative authority. Manage municipal departments, assign officers, view city-wide geospatial heatmaps, and export resolution metrics.
            </p>
            <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg">
              Demo: <span className="font-semibold text-slate-800">admin@urbanfix.com</span> / <span className="font-semibold text-slate-800">Admin@123</span>
            </div>
          </div>
        </div>
      </section>

      {/* Geospatial Map Section */}
      <section id="map-preview" className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Geospatial Issue Viewer</h2>
          <p className="text-sm text-slate-600">OpenStreetMap powered view of municipal complaints and cluster density</p>
        </div>
        <MapView />
      </section>
    </div>
  );
}
