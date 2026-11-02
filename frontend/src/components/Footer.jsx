import React from 'react';
import { ShieldCheck, Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
              <span className="font-bold text-lg">UrbanFix AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart civic issue reporting & automated resolution tracking powered by AI vision and geospatial intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Issue Reporting</a></li>
              <li><a href="#map-preview" className="hover:text-white transition-colors">Geospatial Triage</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Department SLA</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Civic Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Phase Roadmap</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-sky-400 font-medium">Phase 1: Environment & Health APIs ✓</li>
              <li>Phase 2: JWT Auth & RBAC</li>
              <li>Phase 3: AI Vision Issue Detection</li>
              <li>Phase 4: Escalation & Field Officer App</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">System Stack</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Java 21</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Spring Boot 3.4</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">React + Vite</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">FastAPI</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">PostgreSQL 17</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Redis 7</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UrbanFix AI. Developed as an advanced Smart City civic engineering project.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Built with modern open-source civic technology
          </p>
        </div>
      </div>
    </footer>
  );
}
