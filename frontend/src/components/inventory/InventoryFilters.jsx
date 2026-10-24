import React, { useState } from 'react';
import { Search, RotateCcw, Filter, MapPin, Navigation } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { BLOOD_GROUPS, AVAILABILITY_STATUSES } from '../../data/demoInventory';

const POPULAR_CITIES = ['Patna', 'New Delhi', 'Bengaluru', 'Mumbai', 'Kolkata', 'Lucknow'];

export default function InventoryFilters({
  city,
  setCity,
  bloodGroup,
  setBloodGroup,
  status,
  setStatus,
  onReset,
  resultsCount,
  isLoading
}) {
  const bloodGroupOptions = [
    { value: '', label: 'All Blood Groups' },
    ...BLOOD_GROUPS.map((bg) => ({ value: bg, label: `Group ${bg}` }))
  ];

  const statusOptions = AVAILABILITY_STATUSES.map((st) => ({
    value: st === 'All Statuses' ? '' : st,
    label: st
  }));

  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const citiesCoords = [
          { name: 'Patna', lat: 25.5941, lon: 85.1376 },
          { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
          { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
          { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
          { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
          { name: 'Lucknow', lat: 26.8467, lon: 80.9462 }
        ];
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        let nearestCity = 'Patna';
        let shortestDist = Infinity;
        citiesCoords.forEach((c) => {
          const d = Math.hypot(c.lat - userLat, c.lon - userLon);
          if (d < shortestDist) {
            shortestDist = d;
            nearestCity = c.name;
          }
        });
        setCity(nearestCity);
        setDetectingLocation(false);
      },
      () => {
        setDetectingLocation(false);
        setCity('Patna');
      },
      { timeout: 7000 }
    );
  };

  const hasActiveFilters = Boolean(city || bloodGroup || status);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8EC] p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C41315]" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#273741]">
            Filter Availability Records
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {isLoading ? 'Searching...' : `${resultsCount} record${resultsCount === 1 ? '' : 's'} found`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C41315] hover:text-[#A20D10] transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* City Input */}
        <div>
          <label htmlFor="filter-city" className="block text-xs font-semibold text-[#273741] mb-1.5">
            City Name
          </label>
          <Input
            id="filter-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Patna, New Delhi"
            icon={MapPin}
          />
        </div>

        {/* Blood Group Select */}
        <div>
          <label htmlFor="filter-blood-group" className="block text-xs font-semibold text-[#273741] mb-1.5">
            Blood Group
          </label>
          <Select
            id="filter-blood-group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={bloodGroupOptions}
            placeholder=""
          />
        </div>

        {/* Status Select */}
        <div>
          <label htmlFor="filter-status" className="block text-xs font-semibold text-[#273741] mb-1.5">
            Availability Status
          </label>
          <Select
            id="filter-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            placeholder=""
          />
        </div>
      </div>

      {/* Quick City Pills & Auto-detect */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detectingLocation}
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-red-50 text-[#C41315] hover:bg-red-100 font-bold border border-red-200 transition-colors shadow-xs"
        >
          <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
          <span>{detectingLocation ? 'Detecting...' : 'Use My Location'}</span>
        </button>
        <span className="text-xs font-medium text-slate-400 mx-1">Quick:</span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(city === c ? '' : c)}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              city.toLowerCase() === c.toLowerCase()
                ? 'bg-[#273741] text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
