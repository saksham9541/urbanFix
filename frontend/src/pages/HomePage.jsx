import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, CheckCircle2, ArrowRight, RefreshCw, 
  Cpu, Database, Server, Sparkles, Building, Layers, Shield, User, Briefcase, Lock, Search, Clock, AlertCircle
} from 'lucide-react';
import MapView from '../components/MapView';
import RoleDashboard from '../components/RoleDashboard';
import DepartmentsSection from '../components/DepartmentsSection';
import { useAuth } from '../context/AuthContext';
import { getAllComplaints, updateComplaintStatus } from '../services/api';

export default function HomePage({ backendHealth, onRefreshHealth, onOpenAuth, onOpenReport, onOpenTrack }) {
  const { isAuthenticated, user, isOfficer, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [quickTrackInput, setQuickTrackInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch complaints list', err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      onOpenTrack(quickTrackInput.trim());
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      await updateComplaintStatus(complaintId, {
        status: newStatus,
        resolutionNotes: newStatus === 'RESOLVED' ? 'Issue verified and resolved by department officer.' : 'Officer assigned and dispatched to location.'
      });
      await fetchComplaints();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Role Dashboard for Authenticated Session */}
      {isAuthenticated && <RoleDashboard />}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Phase 4: AI Computer Vision & Hazard Detection Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fix your city's problems with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              AI Vision Hazard Detection & SLAs
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Report road hazards, broken utilities, and sanitation issues in seconds. Generate unique tracking numbers, follow real-time department progress, and view live geospatial hazard maps.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-500/25 text-sm"
            >
              <Camera className="w-4 h-4" />
              Report Civic Issue
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => onOpenTrack('UF-2026-10001')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all text-sm backdrop-blur-sm"
            >
              <Search className="w-4 h-4 text-sky-400" />
              Track by Ticket #
            </button>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white transition-all text-sm"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                Sign In (Demo Roles)
              </button>
            )}
          </div>

          {/* Quick Ticket Search Bar */}
          <form onSubmit={handleQuickTrackSubmit} className="pt-2 flex max-w-md gap-2">
            <input
              type="text"
              placeholder="Enter Tracking # (e.g. UF-2026-10001)"
              value={quickTrackInput}
              onChange={(e) => setQuickTrackInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
            >
              Track
            </button>
          </form>
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
              Complaints: Live REST Services Active
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400" /> Python FastAPI AI
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              Healthy (Port 8000)
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Civic Vision Ingestion Ready
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Total Civic Tickets
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-semibold text-slate-100 text-sm">
              {complaints.length} Logged Complaints
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              GPS Geocoded & Cluster Tracked
            </div>
          </div>
        </div>
      </section>

      {/* Geospatial Map Section */}
      <section id="map-preview" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Geospatial Issue Viewer</h2>
            <p className="text-sm text-slate-600">Click any marker to inspect photos and open resolution tracking</p>
          </div>
          <button
            type="button"
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            Pin New Issue
          </button>
        </div>
        <MapView onTrackComplaint={onOpenTrack} refreshTrigger={complaints.length} />
      </section>

      {/* Departments & SLA Engine Overview */}
      <DepartmentsSection />

      {/* Live Civic Issues Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Live Municipal Tickets Feed</h2>
            <p className="text-sm text-slate-600">Real-time status updates across roads, sanitation, and electrical works</p>
          </div>
          <button
            onClick={fetchComplaints}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loadingComplaints ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complaints.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                    {issue.trackingNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {issue.departmentCode && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {issue.departmentCode}
                      </span>
                    )}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      issue.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : issue.status === 'IN_PROGRESS'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </div>

                {issue.imageUrl && (
                  <div className="h-36 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                    <img src={issue.imageUrl} alt="" className="w-full h-full object-cover" />
                    {issue.aiConfidence && issue.aiConfidence >= 0.75 && (
                      <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-400/40 text-indigo-300 text-[10px] font-bold shadow-sm">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        AI Verified ({Math.round(issue.aiConfidence * 100)}%)
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{issue.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{issue.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1 truncate max-w-[60%]">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{issue.address}</span>
                  </div>

                  {issue.slaRemainingMinutes !== null && issue.slaRemainingMinutes !== undefined && issue.status !== 'RESOLVED' && (
                    <div className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {issue.isSlaBreached ? 'Overdue' : `${Math.floor(issue.slaRemainingMinutes / 60)}h left`}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons & Officer resolution controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTrack(issue.trackingNumber)}
                  className="w-full py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1 border border-slate-200"
                >
                  <Search className="w-3.5 h-3.5" />
                  Track Progress
                </button>

                {/* If authenticated as Officer or Admin, allow updating ticket status directly */}
                {(isOfficer || isAdmin) && (
                  <div className="flex gap-1.5 pt-1">
                    {issue.status !== 'IN_PROGRESS' && issue.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        disabled={updatingId === issue.id}
                        onClick={() => handleStatusChange(issue.id, 'IN_PROGRESS')}
                        className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      >
                        Dispatch Crew
                      </button>
                    )}
                    {issue.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        disabled={updatingId === issue.id}
                        onClick={() => handleStatusChange(issue.id, 'RESOLVED')}
                        className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
