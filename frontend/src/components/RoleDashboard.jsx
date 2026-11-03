import React, { useState, useEffect } from 'react';
import { Shield, User, Briefcase, CheckCircle2, Lock, AlertTriangle, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCitizenDashboard, getOfficerDashboard, getAdminDashboard } from '../services/api';

export default function RoleDashboard() {
  const { user, roles, isCitizen, isOfficer, isAdmin, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [securityTestResult, setSecurityTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleData();
  }, [user]);

  const fetchRoleData = async () => {
    setLoading(true);
    setSecurityTestResult(null);
    try {
      let data = null;
      if (isAdmin) {
        data = await getAdminDashboard();
      } else if (isOfficer) {
        data = await getOfficerDashboard();
      } else {
        data = await getCitizenDashboard();
      }
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestForbiddenEndpoint = async () => {
    setSecurityTestResult({ testing: true });
    try {
      // Intentionally try to call Admin endpoint
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

      {/* Role Console Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

