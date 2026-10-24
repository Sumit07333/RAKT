import React from 'react';
import {
  Server,
  Cloud,
  Clock,
  Layers,
  Database,
  Lock,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C41315] text-xs font-bold uppercase tracking-wider">
          <Cloud className="w-4 h-4" />
          <span>Platform Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#273741] tracking-tight">
          About RaktNavi
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Blood Availability & Emergency Request Management Platform designed to streamline blood component discovery and emergency coordination.
        </p>
      </div>

      {/* Problem Statement & Mission */}
      <section className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#273741]">
          The Critical Problem We Address
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          In high-urgency healthcare emergencies, families and caretakers face immense friction when searching for compatible blood components. The traditional response relies heavily on unindexed bulletin boards, word-of-mouth calls, and social media channels. This results in lost time, false leads, and emotional distress.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>RaktNavi</strong> introduces a centralized, cloud-native indexing architecture that organizes listed availability by city and blood group, embeds automated <strong>information freshness tracking</strong>, and provides a structured emergency intake workflow.
        </p>
      </section>

      {/* Data Freshness Philosophy */}
      <section className="bg-[#FFF1F1] rounded-2xl border border-red-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-[#C41315]">
          <Clock className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            The Imperative of Information Freshness
          </h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Blood inventory is volatile. A record updated 48 hours ago may look like stock is available, but emergency surgeries and routine transfusions deplete reserves within hours. Treating unconfirmed data as live truth causes dangerous delays.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
              Recently Updated (&lt; 24h)
            </span>
            <p className="text-xs text-slate-600">
              Freshly confirmed stock count. Direct telephone verification is still recommended during transit.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">
              Needs Reconfirmation (24-72h)
            </span>
            <p className="text-xs text-slate-600">
              Moderate confidence. Stock levels may have shifted significantly since reporting.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-rose-200">
            <span className="text-xs font-bold text-rose-800 uppercase block mb-1">
              Stale (&gt; 72h)
            </span>
            <p className="text-xs text-slate-600">
              High probability of discrepancy. Do not travel without direct hospital confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Cloud Computing Architecture Concepts */}
      <section id="architecture" className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 text-[#273741]">
          <Server className="w-6 h-6 text-[#C41315]" />
          <h2 className="text-xl font-bold">
            Platform Architecture & Design Principles
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          RaktNavi is engineered with modern distributed systems and cloud engineering principles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#273741]">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <span>Decoupled Multi-Tier Architecture</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete separation of static SPA presentation from the Python FastAPI service layer and PostgreSQL relational store.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#273741]">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>TTL-Driven Freshness & Edge Caching</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Time-to-live cache invalidation rules that decay data confidence score over time, preventing stale CDN caching of urgent health records.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#273741]">
              <Database className="w-4 h-4 text-purple-600" />
              <span>High Availability & Disaster Readiness</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stateless frontend deployable over Edge CDNs with Multi-AZ PostgreSQL replicas planned for cloud deployment.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[#273741]">
              <Lock className="w-4 h-4 text-[#C41315]" />
              <span>Zero-PII Client Footprint</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              No private medical diagnostics or patient identities persisted to client browser storage, following privacy-by-design standards.
            </p>
          </div>
        </div>
      </section>

      {/* Operational Scope & Disclaimer */}
      <section id="scope" className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <span>Platform Disclaimer & Operational Scope</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          RaktNavi operates as an independent digital information routing and request intake service. RaktNavi does not collect, supply, transport, process, or guarantee blood stock.
        </p>
        <p className="text-xs text-amber-900 leading-relaxed">
          Availability data reflects cataloged records and requires direct phone verification with the relevant healthcare facility before making logistical decisions. RaktNavi does not provide clinical diagnosis or medical compatibility determinations.
        </p>
      </section>
    </div>
  );
}
