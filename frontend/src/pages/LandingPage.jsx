import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Camera, Sparkles, MapPin, Clock, Star, 
  ArrowRight, CheckCircle2, ChevronRight, Activity, Building2, 
  Zap, Wrench, Droplets, Trash2, Trees, Search, Users, ShieldAlert,
  BarChart3, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onOpenReport, onOpenTrack }) {
  const { isAuthenticated, user, roles } = useAuth();
  const navigate = useNavigate();
  const [quickTrackNumber, setQuickTrackNumber] = useState('');

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackNumber.trim()) {
      onOpenTrack(quickTrackNumber.trim());
    }
  };

  const departments = [
    { name: 'Roads & Infrastructure', icon: Wrench, sla: '24 hrs', color: 'from-amber-500 to-orange-600', desc: 'Potholes, broken curbs & asphalt damage' },
    { name: 'Sanitation & Waste', icon: Trash2, sla: '12 hrs', color: 'from-emerald-500 to-teal-600', desc: 'Garbage dumps, overflowing bins & litter' },
    { name: 'Electricity & Lighting', icon: Zap, sla: '24 hrs', color: 'from-yellow-400 to-amber-500', desc: 'Dark streetlights & hazardous dangling cables' },
    { name: 'Water & Sewerage', icon: Droplets, sla: '18 hrs', color: 'from-blue-500 to-cyan-600', desc: 'Burst mains, pipeline leaks & sewage overflow' },
    { name: 'Parks & Public Amenities', icon: Trees, sla: '48 hrs', color: 'from-green-500 to-emerald-700', desc: 'Fallen trees, damaged benches & playgrounds' },
  ];

  return (
    <div className="space-y-20 py-6">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-16 shadow-2xl border border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.18),transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            Next-Gen Municipal Engineering & AI Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Fix your city's problems with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              AI Vision & Real-Time SLAs
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
            Report civic hazards with instant computer vision defect analysis, track GPS repair progress on interactive geospatial heatmaps, and hold municipal crews accountable with guaranteed SLA response times.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-sky-500/25 text-base"
              >
                Go to Operations Portal
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-sky-500/25 text-base"
              >
                Sign In / Enter Portal
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all text-base backdrop-blur-md"
            >
              <Camera className="w-5 h-5 text-sky-400" />
              Report Issue Now
            </button>

            <button
              type="button"
              onClick={() => onOpenTrack('UF-2026-10001')}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl font-semibold text-slate-300 hover:text-white transition-all text-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Track Sample Issue
            </button>
          </div>

          {/* Quick Ticket Tracker Bar */}
          <div className="pt-6 border-t border-slate-800/80 max-w-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Have a Tracking Number?
            </p>
            <form onSubmit={handleQuickTrack} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. UF-2026-10001"
                value={quickTrackNumber}
                onChange={(e) => setQuickTrackNumber(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
              >
                Track Status
              </button>
            </form>
          </div>
        </div>

        {/* Live Key Stats Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400">94.2%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">AI Classification Accuracy</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 18 hrs</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Average Resolution Time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">5 Depts</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Dynamic SLA Enforcement</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">4.8 / 5.0</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Citizen Satisfaction Score</div>
          </div>
        </div>
      </section>

      {/* 2. Three-Step Process ("How It Works") */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Frictionless Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How UrbanFix AI Resolves City Hazards
          </h2>
          <p className="text-sm text-slate-500">
            From the moment you snap a photograph to verified municipal resolution in 3 automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 group-hover:text-sky-100 transition-colors">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Snap & Instant AI Scan</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload a photo from your phone or browser. Our neural computer vision engine detects potholes, garbage, or outages, estimating severity and autofilling the report in milliseconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">SLA Department Dispatch</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tickets route automatically to the correct municipal department with a legally binding SLA timer based on severity. Field officers receive GPS turn-by-turn navigation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7" />
            </div>
            <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Citizen Sign-Off & Ratings</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Citizens receive instant real-time alerts upon repair completion. Rate resolution quality with 1–5 stars or challenge poor repairs via our Dispute & Reopen workflow.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities Grid */}
      <section className="p-10 rounded-3xl bg-slate-900 text-white space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Engineered for Transparency and Municipal Speed
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Neural Vision Classification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FastAPI vision microservice accurately categorizes 5 hazard classes with confidence metrics and bounding boxes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Geospatial Hotspot Heatmaps</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time spatial density algorithms render concentric heat rings across city neighborhoods to guide proactive repairs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Automated SLA Breaches</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Department baseline SLAs scale dynamically with incident severity: critical road and electrical hazards are cut by 50%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Tri-Role Access Control</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Granular JWT RBAC with dedicated interfaces for Citizens, Dispatched Officers, and City Administrators.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Municipal Departments Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Municipal Departments & SLA Targets</h2>
            <p className="text-sm text-slate-500">Configured with automated dispatch and resolution deadlines</p>
          </div>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View Live SLA Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {departments.map((dept, i) => {
            const Icon = dept.icon;
            return (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-sky-300 transition-all space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${dept.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{dept.name}</h4>
                  <div className="text-xs font-semibold text-sky-600 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> SLA: {dept.sla}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{dept.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Call-To-Action Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-10 sm:p-14 text-center space-y-6 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the Future of Civic Action?
          </h2>
          <p className="text-sky-100 text-base">
            Join citizens and city engineers solving civic problems faster with AI computer vision and SLA accountability.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-all text-base"
            >
              Open Operations Portal
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl shadow-lg transition-all text-base"
            >
              Sign In with 1-Click Demo Roles
            </button>
          )}

          <button
            onClick={onOpenReport}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all text-base"
          >
            Report an Issue (Instant AI Scan)
          </button>
        </div>
      </section>
    </div>
  );
}

