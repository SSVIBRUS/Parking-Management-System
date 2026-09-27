import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Search, RefreshCw, X, CheckCircle, Clock, Shield } from 'lucide-react';

export default function DailyLogModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalEntries: 0, activeParked: 0, totalExits: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/slots/daily-logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setStats({
          totalEntries: data.totalEntries,
          activeParked: data.activeParked,
          totalExits: data.totalExits
        });
      }
    } catch (err) {
      console.error('Error loading logs:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtering
  let filteredLogs = logs;
  if (statusFilter !== 'all') {
    filteredLogs = filteredLogs.filter(l => l.status === statusFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredLogs = filteredLogs.filter(l =>
      l.vehicleNo.toLowerCase().includes(q) ||
      l.driverName.toLowerCase().includes(q) ||
      l.slotName.toLowerCase().includes(q) ||
      l.logId.toLowerCase().includes(q)
    );
  }

  // Generate and Download CSV File (Feature 7)
  const handleDownloadCSV = () => {
    const headers = ['Log ID', 'Slot Name', 'Vehicle Number', 'Driver Name', 'Vehicle Type', 'Entry Time', 'Exit Time', 'Duration (Mins)', 'Status', 'Gate'];
    
    const rows = filteredLogs.map(l => [
      l.logId,
      l.slotName,
      l.vehicleNo,
      `"${l.driverName}"`,
      l.vehicleType,
      new Date(l.entryTime).toLocaleString(),
      l.exitTime ? new Date(l.exitTime).toLocaleString() : 'N/A (Currently Parked)',
      l.durationMinutes || 'Active',
      l.status,
      l.gate || 'Main Gate 1'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `Campus_Park_Daily_Report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print / Export PDF Report (Feature 7)
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Campus Park - Daily Parking Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; items: center; border-b: 2px solid #059669; padding-bottom: 15px; margin-bottom: 20px; }
          .title h1 { margin: 0; color: #059669; font-size: 22px; }
          .title p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
          .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center; }
          .stat-box h4 { margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; }
          .stat-box p { margin: 6px 0 0; font-size: 20px; font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #059669; color: #ffffff; text-align: left; padding: 10px; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; display: inline-block; }
          .badge-parked { background: #dcfce7; color: #166534; }
          .badge-exited { background: #f1f5f9; color: #475569; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-t: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">
            <h1>Campus Park — Official Daily Parking Log Report</h1>
            <p>Generated on ${todayStr} • Main Gate 1 Security System</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <h4>Total Entries Today</h4>
            <p>${stats.totalEntries}</p>
          </div>
          <div class="stat-box">
            <h4>Currently Parked</h4>
            <p style="color: #059669;">${stats.activeParked}</p>
          </div>
          <div class="stat-box">
            <h4>Exited Vehicles</h4>
            <p>${stats.totalExits}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Slot</th>
              <th>Vehicle No</th>
              <th>Driver Name</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredLogs.map(l => `
              <tr>
                <td><strong>${l.logId}</strong></td>
                <td>${l.slotName}</td>
                <td><strong>${l.vehicleNo}</strong></td>
                <td>${l.driverName}</td>
                <td>${new Date(l.entryTime).toLocaleTimeString()}</td>
                <td>${l.exitTime ? new Date(l.exitTime).toLocaleTimeString() : '-'}</td>
                <td><span class="badge ${l.status === 'PARKED' ? 'badge-parked' : 'badge-exited'}">${l.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Campus Park Security Log • Printed for Official College Security Archive
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Daily Parking Report & Logs</h3>
              <p className="text-xs text-gray-500">Track all entry/exit records & download official CSV reports</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
            >
              <Download className="w-4 h-4" />
              Export CSV Report
            </button>
            
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 transition"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 grid grid-cols-3 gap-4 shrink-0">
          <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              📋
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Entries Today</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-emerald-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              🟢
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-medium">Active Parked</p>
              <p className="text-lg font-bold text-emerald-700">{stats.activeParked}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
              🚗
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Exited Vehicles</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalExits}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by vehicle no, driver, or slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All Records' },
              { key: 'PARKED', label: '🟢 Parked' },
              { key: 'EXITED', label: '🚗 Exited' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === tab.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button onClick={fetchLogs} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No matching parking log records found.
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Slot</th>
                    <th className="p-3">Vehicle No</th>
                    <th className="p-3">Driver Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Entry Time</th>
                    <th className="p-3">Exit Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredLogs.map(l => (
                    <tr key={l.logId} className="hover:bg-gray-50 text-gray-800 transition">
                      <td className="p-3 font-mono font-bold text-gray-500">{l.logId}</td>
                      <td className="p-3 font-bold text-emerald-700">{l.slotName}</td>
                      <td className="p-3 font-mono font-bold text-gray-900">{l.vehicleNo}</td>
                      <td className="p-3">{l.driverName}</td>
                      <td className="p-3 text-gray-500 capitalize">{l.vehicleType.replace('_', ' ')}</td>
                      <td className="p-3 text-gray-500">{new Date(l.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3 text-gray-500">
                        {l.exitTime ? new Date(l.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          l.status === 'PARKED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {l.status === 'PARKED' ? '🟢 Parked' : '🚗 Exited'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
