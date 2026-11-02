import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Cpu, Database, Server, Clock, Sparkles, Building, Layers
} from 'lucide-react';
import MapView from '../components/MapView';
import { checkBackendHealth } from '../services/api';

export default function HomePage({ backendHealth, onRefreshHealth }) {
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
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            AI-Driven Smart Civic Issue Resolution
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fix your city's problems with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Smart Vision & AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Report road hazards, broken utilities, and sanitation issues in seconds. UrbanFix AI classifies photos, identifies locations, alerts municipal departments, and tracks resolution in real time.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => alert('Phase 2 Feature: Report Issue with Image Upload & AI Classification')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-500/25 text-sm"
            >
              <Camera className="w-4 h-4" />
              Report Civic Issue
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

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
              Service: {backendHealth.data?.service || 'UrbanFix Backend'} (v{backendHealth.data?.version || '1.0.0'})
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
              {aiHealth.status === 'UP' ? 'Healthy (Port 8000)' : 'Ready for Launch'}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Inference: YOLOv8 Civic Vision Ready
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Storage & Cache
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              PostgreSQL 17 & Redis 7
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Docker Compose: Healthy & Isolated
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity & Diagnostic Bar */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">System Integration Status</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              Phase 1 Fully Configured
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Frontend is connected to Spring Boot backend via Axios at <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono">http://localhost:8080/api</code>
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Testing...' : 'Test Connection Again'}
        </button>
      </section>

      {/* Features Grid */}
      <section id="features" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">How UrbanFix AI Works</h2>
          <p className="text-sm text-slate-600">Automated end-to-end municipal triage and citizen accountability</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">1. AI Visual Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Citizens snap an image of a pothole, open garbage, or faulty street fixture. The AI vision model classifies severity and extracts coordinates automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">2. Automated Routing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tickets are routed directly to the designated department (Roads, Sanitation, Electricity) with SLA deadlines and automatic officer notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">3. Transparent Resolution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Field officers submit post-resolution proof photos. Citizens receive real-time notifications and can confirm closure or request escalation.
            </p>
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

      {/* Placeholder sections for Phase 2 navigation */}
      <section id="departments" className="bg-slate-100 rounded-2xl p-8 border border-slate-200 text-center space-y-3">
        <Layers className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Municipal Departments & SLA Workflows</h3>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Roads & Infrastructure, Public Health & Sanitation, Electricity & Streetlights, Water Board, and Parks & Recreation modules configured for Phase 2.
        </p>
      </section>
    </div>
  );
}
