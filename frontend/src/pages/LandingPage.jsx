import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Clock,
  FileText,
  MapPin,
  Building2,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { BLOOD_GROUPS } from '../data/demoInventory';

export default function LandingPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [searchError, setSearchError] = useState('');

  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    ...BLOOD_GROUPS.map((bg) => ({ value: bg, label: `Group ${bg}` }))
  ];

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!city.trim() && !bloodGroup) {
      setSearchError('Please enter a city or select a blood group to search.');
      return;
    }
    setSearchError('');
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    navigate(`/find-blood?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8EC] pt-12 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-slate-100 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Product badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#C41315] text-xs font-bold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C41315] animate-pulse" />
              Emergency Blood Availability Network
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#273741] tracking-tight leading-tight">
              Find Blood Availability Faster.{' '}
              <span className="text-[#C41315]">Connect When It Matters.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Search listed blood availability, explore facility information, and manage emergency requests through one accessible platform.
            </p>

            {/* Quick Action CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/find-blood" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" icon={Search} className="w-full sm:w-auto">
                  Search Blood Availability
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Search Floating Box */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-card">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#C41315]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#273741]">
                    Quick Search Availability
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Directory Index
                </span>
              </div>

              {searchError && (
                <p className="text-xs font-semibold text-[#C41315] mb-3">{searchError}</p>
              )}

              <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
                <div className="sm:col-span-5">
                  <label htmlFor="quick-city" className="block text-xs font-semibold text-[#273741] mb-1">
                    City / Town
                  </label>
                  <Input
                    id="quick-city"
                    placeholder="e.g. Patna, New Delhi, Bengaluru"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (searchError) setSearchError('');
                    }}
                    icon={MapPin}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="quick-blood-group" className="block text-xs font-semibold text-[#273741] mb-1">
                    Blood Group
                  </label>
                  <Select
                    id="quick-blood-group"
                    value={bloodGroup}
                    onChange={(e) => {
                      setBloodGroup(e.target.value);
                      if (searchError) setSearchError('');
                    }}
                    options={bloodGroupOptions}
                    placeholder=""
                  />
                </div>

                <div className="sm:col-span-3">
                  <Button type="submit" variant="primary" size="md" className="w-full" icon={Search}>
                    Search
                  </Button>
                </div>
              </form>

              {/* Popular quick links */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Quick Searches:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCity('Patna');
                    setBloodGroup('O+');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Patna (O+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCity('New Delhi');
                    setBloodGroup('O-');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  New Delhi (O-)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCity('Bengaluru');
                    setBloodGroup('B+');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Bengaluru (B+)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#C41315]">
            Transparent Emergency Workflow
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#273741]">
            How RaktNavi Connects Information
          </p>
          <p className="mt-3 text-sm text-slate-600">
            A straightforward 4-step process designed to minimize communication friction during urgent medical requisitions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-[#E2E8EC] p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-[#C41315] font-black text-base flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-[#273741] mb-2">Search Listed Stock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Query blood group and city to view indexed availability records across regional facilities and hospitals.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-[#E2E8EC] p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2563EB] font-black text-base flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-[#273741] mb-2">Check Freshness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect verified timestamps. Distinct color badges highlight whether a record was updated recently or requires re-confirmation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-[#E2E8EC] p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#16803C] font-black text-base flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-[#273741] mb-2">Contact Directly</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use direct facility telephone links to verify actual stock and reserve units before dispatching an attendant.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl border border-[#E2E8EC] p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-slate-200 text-[#273741] font-black text-base flex items-center justify-center mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-[#273741] mb-2">Track Requests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If local inventory is constrained, log an emergency request with a reference code to monitor operator response in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#EEF2F4] py-16 border-y border-[#E2E8EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#273741]">
              Architectural Capabilities
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#273741]">
              Engineered for Speed, Reliability & Clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-[#C41315] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#273741] mb-2">
                Data Freshness Indicators
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated classification tags records into Recently Updated (&lt;24h), Needs Reconfirmation (24-72h), and Stale (&gt;72h). Prevents false security from outdated records.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#273741] mb-2">
                Emergency Intake & Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized submission generating tracking codes (<code className="font-mono text-[#C41315]">RN-DEMO-XXXXXX</code>) to view status transitions from Pending to Contacted and Fulfilled.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#16803C] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#273741] mb-2">
                Operator Administration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated blood bank operator interface for updating inventory quantities and logging status changes with complete session audit tracing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Transparency Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-amber-950">
                Operational Scope & Verification Protocol
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                RaktNavi is an independent digital health information platform dedicated to organizing blood availability records and emergency requisitions.
              </p>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                <li><strong>No Blood Handling:</strong> RaktNavi does not collect, process, store, transport, or supply blood units.</li>
                <li><strong>Direct Verification Required:</strong> Reported inventory can fluctuate quickly. Always contact the listed medical facility directly before transit.</li>
                <li><strong>Independent Information Interface:</strong> The platform does not perform clinical compatibility testing, medical matching, or clinical diagnosis.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#273741] text-white rounded-2xl p-8 sm:p-12 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Need to Find Blood Availability Right Now?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Browse cataloged blood facilities across Patna, New Delhi, Bengaluru, Mumbai, Kolkata, and Lucknow.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/find-blood">
              <Button size="lg" variant="primary" icon={Search}>
                Open Blood Availability Search
              </Button>
            </Link>
            <Link to="/emergency-request">
              <Button size="lg" variant="outline" className="text-red  hover:text-white border-slate-500 bg-slate-800 hover:bg-slate-700">
                Submit Emergency Request
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
