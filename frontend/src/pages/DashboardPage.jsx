import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, CheckCircle2, ArrowRight, RefreshCw, 
  Cpu, Database, Server, Sparkles, Building, Layers, Shield, User, Briefcase, Lock, Search, Clock, AlertCircle, Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import RoleDashboard from '../components/RoleDashboard';
import DepartmentsSection from '../components/DepartmentsSection';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { getAllComplaints, updateComplaintStatus, getFullImageUrl } from '../services/api';

export default function DashboardPage({ backendHealth, onRefreshHealth, onOpenReport, onOpenTrack }) {
  const { isAuthenticated, user, isOfficer, isAdmin } = useAuth();
  const { lastComplaintEvent, socketStatus } = useWebSocket();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [quickTrackInput, setQuickTrackInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filters for Live Incident Feed
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

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

  // Real-Time WebSocket live complaints synchronization
  useEffect(() => {
    if (!lastComplaintEvent || !lastComplaintEvent.data) return;

    if (lastComplaintEvent.type === 'COMPLAINT_CREATED') {
      setComplaints((prev) => {
        if (prev.some((c) => c.id === lastComplaintEvent.data.id)) return prev;
        return [lastComplaintEvent.data, ...prev];
      });
    } else if (lastComplaintEvent.type === 'COMPLAINT_UPDATED') {
      setComplaints((prev) =>
        prev.map((c) => (c.id === lastComplaintEvent.data.id ? lastComplaintEvent.data : c))
      );
    }
  }, [lastComplaintEvent]);

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
        resolutionNotes: newStatus === 'RESOLVED' 
          ? 'Issue verified and resolved by department officer.' 
          : 'Officer assigned and actively performing repairs.'
      });
      await fetchComplaints();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-12 py-8">
      {/* 1. Unauthenticated Gateway Notice or Role Dashboard */}
      {!isAuthenticated ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white border border-indigo-700/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-400/20">
              <Lock className="w-3.5 h-3.5" /> Public Explorer Mode
            </div>
            <h2 className="text-2xl font-black text-white">Sign In to Unlock Role Actions</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You are viewing the public incident feed. Sign in as a <strong>Citizen</strong>, <strong>Field Officer</strong>, or <strong>Admin</strong> to unlock AI camera reporting, ticket dispatching, and resolution sign-offs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              Sign In with Demo Roles <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenReport}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs border border-white/20 transition-all"
            >
              Report Issue
            </button>
          </div>
        </div>
      ) : (
        <RoleDashboard />
      )}

      {/* 2. Operations Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">City Operations Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time civic defect tracking, AI hazard classifications, and departmental dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            Report Issue (AI Scan)
          </button>

          <form onSubmit={handleQuickTrackSubmit} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Track # (e.g. UF-2026-10001)"
              value={quickTrackInput}
              onChange={(e) => setQuickTrackInput(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Track
            </button>
          </form>

          <button
            onClick={fetchComplaints}
            title="Refresh Feed"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loadingComplaints ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Live Geospatial Incident Map with Hotspot Heatmap */}
      <section id="map-preview">
        <MapView onOpenTrack={onOpenTrack} />
      </section>

      {/* 4. Live Civic Issues Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              Live Civic Incidents Feed
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredComplaints.length} tickets
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by status, department, and inspect AI vision confidence badges
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ROADS">Roads & Potholes</option>
              <option value="SANITATION">Sanitation & Garbage</option>
              <option value="ELECTRICITY">Electricity & Lighting</option>
              <option value="WATER">Water & Sewage</option>
              <option value="PARKS">Parks & Trees</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                    {c.trackingNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'RESOLVED' || c.status === 'CLOSED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>

                {/* Uploaded Photo Evidence Thumbnail */}
                {c.imageUrl && (
                  <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative group">
                    <img 
                      src={getFullImageUrl(c.imageUrl)} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* AI Confidence Badge */}
                {c.aiDetectedCategory && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" /> AI: {c.aiDetectedCategory}
                    </span>
                    <span className="font-mono text-sky-700 font-bold">
                      {Math.round((c.aiConfidenceScore || 0.94) * 100)}% Match
                    </span>
                  </div>
                )}

                {/* Metadata */}
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{c.address || `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Dept: <strong>{c.departmentName || c.category}</strong></span>
                    <span className="font-semibold text-amber-700">Severity: {c.severity}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenTrack(c.trackingNumber)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  Track Lifecycle <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Status Changer for Field Officers and Admins */}
                {(isOfficer || isAdmin) && c.status !== 'CLOSED' && (
                  <div className="flex items-center gap-1.5">
                    {c.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleStatusChange(c.id, 'IN_PROGRESS')}
                        disabled={updatingId === c.id}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] transition-all"
                      >
                        Start Work
                      </button>
                    )}
                    {c.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleStatusChange(c.id, 'RESOLVED')}
                        disabled={updatingId === c.id}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition-all"
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

      {/* 5. Municipal Departments SLA Breakdown */}
      <section>
        <DepartmentsSection />
      </section>
    </div>
  );
}

