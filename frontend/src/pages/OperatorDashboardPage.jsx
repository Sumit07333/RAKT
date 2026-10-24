import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  AlertTriangle,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  LogOut,
  Search
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import BloodGroupBadge from '../components/common/BloodGroupBadge';
import AvailabilityBadge from '../components/common/AvailabilityBadge';
import FreshnessBadge from '../components/common/FreshnessBadge';
import RequestStatusBadge from '../components/requests/RequestStatusBadge';
import LoadingState from '../components/common/LoadingState';
import InventoryModal from '../components/dashboard/InventoryModal';
import RequestStatusModal from '../components/dashboard/RequestStatusModal';
import AuditActivityPanel from '../components/dashboard/AuditActivityPanel';
import { useToast } from '../hooks/useToast';
import {
  searchInventory,
  upsertInventoryRecord
} from '../services/inventoryService';
import {
  getAllRequests,
  updateRequestStatus
} from '../services/requestService';
import { getCurrentOperator, logoutOperator } from '../services/authService';
import { evaluateFreshness } from '../utils/freshness';
import { formatDateTime } from '../utils/formatDate';

export default function OperatorDashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const operator = getCurrentOperator() || {
    name: 'Demonstration Operator',
    facilityName: 'Regional Blood Network'
  };

  // Tabs: 'inventory' | 'requests'
  const [activeTab, setActiveTab] = useState('inventory');

  // Inventory state
  const [inventoryList, setInventoryList] = useState([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryLoading, setInventoryLoading] = useState(true);

  // Requests state
  const [requestsList, setRequestsList] = useState([]);
  const [requestFilterStatus, setRequestFilterStatus] = useState('All');
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Modals state
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRequestForStatus, setSelectedRequestForStatus] = useState(null);

  // Live Audit log state
  const [auditLogs, setAuditLogs] = useState([
    {
      action: 'Session Initialized',
      details: 'Operator session authenticated.',
      timestamp: new Date().toISOString()
    }
  ]);

  const addAuditLog = (action, details) => {
    setAuditLogs((prev) => [
      { action, details, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };

  const loadData = () => {
    setInventoryLoading(true);
    setRequestsLoading(true);

    searchInventory()
      .then((res) => {
        setInventoryList(res.records || []);
        setInventoryLoading(false);
      })
      .catch(() => setInventoryLoading(false));

    getAllRequests()
      .then((res) => {
        setRequestsList(res.records || []);
        setRequestsLoading(false);
      })
      .catch(() => setRequestsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logoutOperator();
    addToast({ title: 'Logged Out', message: 'Operator session ended.', type: 'info' });
    navigate('/operator/login');
  };

  // Inventory Modal Save
  const handleSaveInventory = async (formData) => {
    await upsertInventoryRecord(formData);
    addToast({
      title: 'Inventory Saved',
      message: `${formData.bloodGroup} stock updated to ${formData.unitsAvailable} units.`,
      type: 'success'
    });
    addAuditLog(
      'Blood Stock Updated',
      `Updated ${formData.bloodGroup} to ${formData.unitsAvailable} units (${formData.availabilityStatus})`
    );
    loadData();
  };

  // Request Status Modal Update
  const handleUpdateRequestStatus = async (requestId, newStatus, note) => {
    await updateRequestStatus(requestId, newStatus, note);
    addToast({
      title: 'Status Updated',
      message: `Request status transitioned to "${newStatus}".`,
      type: 'success'
    });
    addAuditLog(
      'Emergency Request Updated',
      `Request ID ${requestId} transitioned to ${newStatus}. Note: "${note || 'None'}"`
    );
    loadData();
  };

  // Calculate Metrics
  const totalStockRecords = inventoryList.length;
  const lowStockCount = inventoryList.filter(
    (item) => item.unitsAvailable > 0 && item.unitsAvailable <= 3
  ).length;
  const staleCount = inventoryList.filter((item) => {
    const f = evaluateFreshness(item.lastUpdated);
    return f.category === 'needs_reconfirmation' || f.category === 'stale';
  }).length;
  const pendingRequestsCount = requestsList.filter((r) => r.status === 'Pending').length;

  // Filtered Inventory
  const filteredInventory = inventoryList.filter((item) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return (
      item.facilityName.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.bloodGroup.toLowerCase().includes(q)
    );
  });

  // Filtered Requests
  const filteredRequests = requestsList.filter((r) => {
    if (requestFilterStatus === 'All') return true;
    return r.status === requestFilterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8EC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Operations Console • Active Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273741] tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Logged in as <strong className="text-[#273741]">{operator.name}</strong> •{' '}
            <span className="text-slate-500">{operator.facilityName || 'Central Network'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadData}>
            Refresh Data
          </Button>
          <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Listed Stock"
          value={totalStockRecords}
          subtitle="Cataloged blood group records"
          icon={Layers}
          variant="default"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Stock ≤ 3 units listed"
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Stale Stock Records"
          value={staleCount}
          subtitle="Unconfirmed in > 24 hours"
          icon={Clock}
          variant={staleCount > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          subtitle="Awaiting facility outreach"
          icon={FileText}
          variant={pendingRequestsCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Tabs & Controls */}
      <div className="flex items-center justify-between border-b border-[#E2E8EC] pb-2 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[#273741] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#273741] hover:bg-slate-100'
            }`}
          >
            Blood Inventory ({inventoryList.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'requests'
                ? 'bg-[#273741] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#273741] hover:bg-slate-100'
            }`}
          >
            Emergency Requests ({requestsList.length})
          </button>
        </div>

        {activeTab === 'inventory' ? (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingInventoryItem(null);
              setIsInventoryModalOpen(true);
            }}
          >
            Add / Update Stock Record
          </Button>
        ) : null}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Inventory Search Filter */}
          <div className="max-w-md">
            <Input
              id="dash-inv-search"
              placeholder="Search by facility, city, or blood group..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Table */}
          {inventoryLoading ? (
            <LoadingState message="Loading inventory table..." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8EC] bg-white shadow-xs">
              <table className="w-full text-left text-sm text-[#273741]">
                <thead className="bg-[#EEF2F4] text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-[#E2E8EC]">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Blood Group</th>
                    <th scope="col" className="px-4 py-3.5">Facility</th>
                    <th scope="col" className="px-4 py-3.5">City</th>
                    <th scope="col" className="px-4 py-3.5">Units</th>
                    <th scope="col" className="px-4 py-3.5">Availability Status</th>
                    <th scope="col" className="px-4 py-3.5">Freshness Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#273741]">
                        {item.facilityName}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        {item.city}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {item.unitsAvailable}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <AvailabilityBadge status={item.availabilityStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <FreshnessBadge timestamp={item.lastUpdated} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingInventoryItem(item);
                            setIsInventoryModalOpen(true);
                          }}
                        >
                          Modify
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Requests Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filter by Status:</span>
            {['All', 'Pending', 'Contacted', 'Fulfilled', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setRequestFilterStatus(st)}
                className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
                  requestFilterStatus === st
                    ? 'bg-[#273741] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Requests Table */}
          {requestsLoading ? (
            <LoadingState message="Loading requests..." />
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 bg-white rounded-xl border border-[#E2E8EC]">
              No emergency requests found for selected filter "{requestFilterStatus}".
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8EC] bg-white shadow-xs">
              <table className="w-full text-left text-sm text-[#273741]">
                <thead className="bg-[#EEF2F4] text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-[#E2E8EC]">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Code</th>
                    <th scope="col" className="px-4 py-3.5">Requester & Phone</th>
                    <th scope="col" className="px-4 py-3.5">Group & Units</th>
                    <th scope="col" className="px-4 py-3.5">Location</th>
                    <th scope="col" className="px-4 py-3.5">Urgency</th>
                    <th scope="col" className="px-4 py-3.5">Current Status</th>
                    <th scope="col" className="px-4 py-3.5">Created At</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-[#C41315] whitespace-nowrap">
                        {req.requestCode}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold block">{req.requesterName}</span>
                        <span className="text-xs text-slate-500">{req.contactPhone}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                          <span className="font-bold">{req.unitsRequired} unit(s)</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        {req.city}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs font-semibold text-[#C41315]">
                        {req.urgencyLevel}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <RequestStatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {formatDateTime(req.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequestForStatus(req);
                            setIsStatusModalOpen(true);
                          }}
                        >
                          Change Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Live Audit Trail */}
      <AuditActivityPanel logs={auditLogs} />

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSave={handleSaveInventory}
        editingItem={editingInventoryItem}
      />

      {/* Status Modal */}
      <RequestStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdate={handleUpdateRequestStatus}
        request={selectedRequestForStatus}
      />
    </div>
  );
}
