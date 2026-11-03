import React, { useState, useEffect } from 'react';
import {
  Shield, User, Briefcase, CheckCircle2, Lock, AlertTriangle, Key, LogOut,
  Clock, MapPin, Building2, UserCheck, ArrowRight, Check, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getCitizenDashboard, getOfficerDashboard, getAdminDashboard,
  getOfficerTickets, getAllComplaints, updateComplaintStatus, assignComplaint, getSlaAnalytics
} from '../services/api';

export default function RoleDashboard() {
  const { user, roles, isCitizen, isOfficer, isAdmin, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [officerTickets, setOfficerTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [slaSummary, setSlaSummary] = useState(null);
  const [securityTestResult, setSecurityTestResult] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [selectedTicketToResolve, setSelectedTicketToResolve] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleData();
  }, [user]);

  const fetchRoleData = async () => {
    setLoading(true);
    setSecurityTestResult(null);
    try {
      if (isAdmin) {
        const [adminData, tickets, sla] = await Promise.all([
          getAdminDashboard(),
          getAllComplaints(),
          getSlaAnalytics(),
        ]);
        setDashboardData(adminData);
        setAllTickets(tickets || []);
        setSlaSummary(sla);
      } else if (isOfficer) {
        const [officerData, tickets] = await Promise.all([
          getOfficerDashboard(),
          getOfficerTickets(),
        ]);
        setDashboardData(officerData);
        setOfficerTickets(tickets || []);
      } else {
        const citizenData = await getCitizenDashboard();
        setDashboardData(citizenData);
      }
    } catch (err) {
      console.error('Failed to load role dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, nextStatus) => {
    try {
      const notes = resolutionNotes[complaintId] || 'Status updated via Officer console';
      await updateComplaintStatus(complaintId, {
        status: nextStatus,
        resolutionNotes: notes,
      });
      // refresh tickets
      if (isOfficer) {
        const tickets = await getOfficerTickets();
        setOfficerTickets(tickets || []);
      } else if (isAdmin) {
        const tickets = await getAllComplaints();
        setAllTickets(tickets || []);
      }
      setSelectedTicketToResolve(null);
      setDispatchSuccess(`Ticket #${complaintId} updated to ${nextStatus}!`);
      setTimeout(() => setDispatchSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleAssignToDemoOfficer = async (complaintId) => {
    try {
      // Demo Officer ID is 2
      await assignComplaint(complaintId, 2, null);
      const tickets = await getAllComplaints();
      setAllTickets(tickets || []);
      setDispatchSuccess(`Complaint #${complaintId} dispatched to Officer Sarah (ID: 2)!`);
      setTimeout(() => setDispatchSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleTestForbiddenEndpoint = async () => {
    setSecurityTestResult({ testing: true });
    try {
      await getAdminDashboard();
      setSecurityTestResult({
        success: true,
        message: 'Admin endpoint accessed! (You have ROLE_ADMIN permissions)',
        status: 200,
      });
    } catch (err) {
      setSecurityTestResult({
        success: false,
        message: 'RBAC Access Denied: Spring Security blocked this request with 403 Forbidden!',
        status: err.response?.status || 403,
      });
    }
  };

  const formatRemainingMinutes = (minutes, isBreached) => {
    if (isBreached) {
      return { text: 'SLA Overdue', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    }
    if (minutes === null || minutes === undefined) {
      return { text: 'No SLA', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
    if (minutes <= 0) {
      return { text: 'SLA Breached', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return { text: `${mins}m remaining`, color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { text: `${hours}h ${mins}m left`, color: 'bg-sky-100 text-sky-800 border-sky-200' };
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
      {/* Top Bar with User Info and Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isAdmin
              ? 'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-amber-500/20'
              : isOfficer
              ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20'
              : 'bg-gradient-to-tr from-sky-500 to-blue-600 shadow-sky-500/20'
          }`}>
            {isAdmin ? <Shield className="w-7 h-7" /> : isOfficer ? <Briefcase className="w-7 h-7" /> : <User className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">
                {user.firstName || user.username} {user.lastName || ''}
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isAdmin
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : isOfficer
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}>
                {roles.join(', ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Email: <span className="font-mono text-slate-700">{user.email}</span> • JWT Authenticated Session
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {dispatchSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {dispatchSuccess}
        </div>
      )}

      {/* OFFICER INCIDENT QUEUE (Phase 3) */}
      {isOfficer && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Assigned Incident Queue & SLA Dispatch
              </h4>
              <p className="text-xs text-slate-500">
                Tickets assigned to you for field inspection and resolution under municipal SLAs.
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold">
              {officerTickets.length} Assigned
            </span>
          </div>

          {officerTickets.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-sm">
              No tickets currently assigned to your queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officerTickets.map((ticket) => {
                const sla = formatRemainingMinutes(ticket.slaRemainingMinutes, ticket.isSlaBreached);
                return (
                  <div key={ticket.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {ticket.trackingNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">{ticket.title}</h5>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sla.color} flex items-center gap-1`}>
                        <Clock className="w-3 h-3" />
                        {sla.text}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{ticket.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                        Dept: {ticket.departmentCode || 'ROADS'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                        Status: <strong className="text-indigo-600">{ticket.status}</strong>
                      </span>
                      {ticket.address && (
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ticket.address}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      {ticket.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" /> Start Work
                        </button>
                      )}

                      {ticket.status === 'IN_PROGRESS' && selectedTicketToResolve !== ticket.id && (
                        <button
                          onClick={() => setSelectedTicketToResolve(ticket.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      )}

                      {ticket.status === 'RESOLVED' && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolved on Record
                        </span>
                      )}
                    </div>

                    {selectedTicketToResolve === ticket.id && (
                      <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-2 mt-2">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          Resolution Field Notes:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Repaired by highway maintenance crew..."
                          value={resolutionNotes[ticket.id] || ''}
                          onChange={(e) =>
                            setResolutionNotes({ ...resolutionNotes, [ticket.id]: e.target.value })
                          }
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setSelectedTicketToResolve(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Submit Resolution
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADMIN DISPATCH & SLA COMMAND CENTER (Phase 3) */}
      {isAdmin && (
        <div className="space-y-5 pt-2">
          {slaSummary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Total Tickets</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{slaSummary.totalTickets}</div>
              </div>
              <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="text-[11px] text-amber-700 font-medium">Active In-Flight</div>
                <div className="text-xl font-bold text-amber-800 mt-0.5">{slaSummary.activeTickets}</div>
              </div>
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="text-[11px] text-emerald-700 font-medium">Resolved on SLA</div>
                <div className="text-xl font-bold text-emerald-800 mt-0.5">{slaSummary.resolvedTickets}</div>
              </div>
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                <div className="text-[11px] text-indigo-700 font-medium">SLA Compliance</div>
                <div className="text-xl font-bold text-indigo-800 mt-0.5">{slaSummary.slaCompliancePercentage}%</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              Officer Dispatch & Routing Control
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              Assign complaints to departmental officers
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Tracking</th>
                    <th className="p-3">Title & Category</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">SLA Status</th>
                    <th className="p-3">Assigned Officer</th>
                    <th className="p-3 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTickets.map((t) => {
                    const sla = formatRemainingMinutes(t.slaRemainingMinutes, t.isSlaBreached);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-indigo-600">{t.trackingNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{t.title}</div>
                          <div className="text-[11px] text-slate-500">{t.category}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-700">
                            {t.departmentCode || 'ROADS'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sla.color}`}>
                            {sla.text}
                          </span>
                        </td>
                        <td className="p-3">
                          {t.assignedOfficerUsername ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t.assignedOfficerUsername}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Unassigned</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!t.assignedOfficerUsername ? (
                            <button
                              onClick={() => handleAssignToDemoOfficer(t.id)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center gap-1 ml-auto"
                            >
                              <Send className="w-3 h-3" /> Dispatch to Officer
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Dispatched</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role Authorities & RBAC Security Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-600" />
              Role Authorization & Spring Security Permissions
            </h4>
            <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
              Live Verified via REST
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-sm font-semibold text-slate-900">
              {dashboardData?.message || 'Loading authenticated dashboard payload...'}
            </div>

            {dashboardData?.permissions && (
              <div>
                <div className="text-xs text-slate-500 mb-2 font-medium">Assigned Spring Security Authorities:</div>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RBAC Verification Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Test RBAC Security Barrier
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click below to verify that Spring Security enforces Role-Based Access Control and blocks unauthorized role escalation.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleTestForbiddenEndpoint}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all"
            >
              Test Access to `/api/admin/dashboard`
            </button>

            {securityTestResult && (
              <div className={`p-3 rounded-xl text-xs border ${
                securityTestResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  {securityTestResult.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  HTTP Status {securityTestResult.status}
                </div>
                <div className="text-[11px] leading-tight">{securityTestResult.message}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
