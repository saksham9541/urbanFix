import React, { useEffect, useState } from 'react';
import { Building2, Clock, CheckCircle2, AlertCircle, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { getAllDepartments, getSlaAnalytics } from '../services/api';

export default function DepartmentsSection() {
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deptRes, slaRes] = await Promise.all([
        getAllDepartments(),
        getSlaAnalytics(),
      ]);
      setDepartments(deptRes || []);
      setAnalytics(slaRes || null);
    } catch (err) {
      console.error('Failed to load departments/SLA data', err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentColor = (code) => {
    switch (code) {
      case 'ROADS':
        return 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30';
      case 'SANITATION':
        return 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30';
      case 'ELECTRICITY':
        return 'from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30';
      case 'WATER':
        return 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30';
      case 'PARKS':
        return 'from-green-500/20 to-emerald-500/10 text-green-400 border-green-500/30';
      default:
        return 'from-slate-700/50 to-slate-800/30 text-slate-300 border-slate-700';
    }
  };

  return (
    <section className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" /> Municipal Routing & SLA Engine
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            City Civic Departments & SLAs
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Automated issue classification, direct department routing, and strict Service Level Agreement enforcement.
          </p>
        </div>

        {analytics && (
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">SLA Compliance Rate</div>
              <div className="text-lg font-bold text-emerald-400">
                {analytics.slaCompliancePercentage ?? 100}%
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-800/40 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const total = (dept.activeTicketsCount || 0) + (dept.resolvedTicketsCount || 0);
            const rate = total > 0 ? Math.round(((dept.resolvedTicketsCount || 0) / total) * 100) : 100;
            const colorClass = getDepartmentColor(dept.code);

            return (
              <div
                key={dept.id}
                className={`relative rounded-xl border p-5 bg-gradient-to-b ${colorClass} hover:border-slate-600 transition-all shadow-sm`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                      {dept.code}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{dept.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dept.defaultSlaHours}h SLA</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {dept.description}
                </p>

                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      Active:{' '}
                      <strong className="text-amber-400 font-semibold">{dept.activeTicketsCount || 0}</strong>
                    </span>
                    <span className="text-slate-400">
                      Resolved:{' '}
                      <strong className="text-emerald-400 font-semibold">{dept.resolvedTicketsCount || 0}</strong>
                    </span>
                  </div>

                  {dept.contactEmail && (
                    <a
                      href={`mailto:${dept.contactEmail}`}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title={dept.contactEmail}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

