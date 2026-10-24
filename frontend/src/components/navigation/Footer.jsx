import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import raktNaviLogo from '../../assets/RaktNavi Logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#273741] text-white border-t border-slate-700">
      {/* Top Advisory Notice */}
      <div className="bg-[#1E2B33] border-b border-slate-700/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200">Operational Advisory:</span>
            <span>Always confirm current unit availability directly with the facility before dispatch.</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Independent Blood Availability & Emergency Request Management
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className=" inline-flex items-center shadow-xs">
                <img
                  src={raktNaviLogo}
                  alt="RaktNavi logo"
                  className="h-20 w-auto object-contain bg-white  p-2 rounded-xl"
                />
                <span className="ml-3 text-xl font-bold tracking-tight">
                  Rakt
                  <span className="text-[#EA2027]">Navi</span>
                </span>
              </div>

            </Link>
            <p className="text-sm text-slate-200 font-semibold">
              Find Blood Availability Faster. Connect When It Matters.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Search listed blood availability, explore facility information, and manage emergency requests through one accessible platform. Engineered with data freshness tracking and responsive emergency intake workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Public Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/find-blood" className="hover:text-white transition-colors">
                  Search Blood Availability
                </Link>
              </li>
              <li>
                <Link to="/emergency-request" className="hover:text-white transition-colors">
                  Submit Emergency Request
                </Link>
              </li>
              <li>
                <Link to="/track-request" className="hover:text-white transition-colors">
                  Track Request Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Platform & Freshness Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Scope */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Operations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/operator/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Operations Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/about#scope" className="hover:text-white transition-colors">
                  Operational Scope
                </Link>
              </li>
              <li>
                <Link to="/about#architecture" className="hover:text-white transition-colors">
                  Platform Architecture
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Operational Scope & Legal Disclaimer */}
        <div className="mt-10 pt-8 border-t border-slate-700 text-xs text-slate-400 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-slate-200">Operational Notice:</strong> RaktNavi organizes listed blood availability records and request tracking. The platform does not collect, supply, transport, process, or guarantee blood stock. During life-critical medical scenarios, always verify availability directly with the listed medical facility. RaktNavi does not offer medical diagnoses, cross-match assessments, or clinical recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
            <p>© 2026 RaktNavi. All rights reserved. Blood Availability & Emergency Request Management Platform.</p>
            <p className="text-slate-400 text-xs">
              Dedicated to rapid healthcare information access
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
