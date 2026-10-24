import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, AlertTriangle, LayoutGrid, Table, PlusCircle } from 'lucide-react';
import InventoryCard from '../components/inventory/InventoryCard';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryTable from '../components/inventory/InventoryTable';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';
import { searchInventory } from '../services/inventoryService';

export default function BloodSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL params
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state to URL and fetch results
  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (bloodGroup) params.set('bloodGroup', bloodGroup);
    if (status) params.set('status', status);
    setSearchParams(params, { replace: true });

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    searchInventory({ city, bloodGroup, status })
      .then((res) => {
        if (isMounted) {
          setRecords(res.records || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to search blood inventory records.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [city, bloodGroup, status]);

  const handleResetFilters = () => {
    setCity('');
    setBloodGroup('');
    setStatus('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8EC] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C41315]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#C41315]">
              Availability Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273741] tracking-tight">
            Search Blood Availability
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explore cataloged blood inventory across regional facilities and hospital reserves. Always verify by phone.
          </p>
        </div>

        {/* View Toggle & Emergency Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#273741] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#273741] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
              aria-label="Table view"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <Link to="/emergency-request">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Submit Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <InventoryFilters
        city={city}
        setCity={setCity}
        bloodGroup={bloodGroup}
        setBloodGroup={setBloodGroup}
        status={status}
        setStatus={setStatus}
        onReset={handleResetFilters}
        resultsCount={records.length}
        isLoading={isLoading}
      />

      {/* Main Results Display */}
      {isLoading ? (
        <LoadingState message="Loading availability records..." />
      ) : error ? (
        <ErrorState
          title="Search Failed"
          message={error}
          onRetry={() => {
            setIsLoading(true);
            searchInventory({ city, bloodGroup, status })
              .then((res) => {
                setRecords(res.records || []);
                setIsLoading(false);
              })
              .catch((err) => {
                setError(err.message);
                setIsLoading(false);
              });
          }}
        />
      ) : records.length === 0 ? (
        <EmptyState
          title="No Available Records Found"
          description={`No listed blood facilities matched your criteria: "${[
            city && `City: ${city}`,
            bloodGroup && `Group: ${bloodGroup}`,
            status && `Status: ${status}`
          ]
            .filter(Boolean)
            .join(', ')}".`}
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <InventoryTable records={records} showFacility={true} />
      )}
    </div>
  );
}
