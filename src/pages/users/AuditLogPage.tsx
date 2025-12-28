import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Filter, Download, Eye, User, FileText, DollarSign, Flag } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import type { AuditLog } from '../../types'

const demoAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Admin User',
    action: 'UPDATE',
    module: 'Projects',
    entityType: 'Project',
    entityId: 'P001',
    entityName: 'ERP Implementation',
    changes: {
      status: { old: 'in_progress', new: 'on_hold' },
      budget: { old: 500000, new: 550000 },
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    timestamp: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '2',
    userId: '2',
    userName: 'John Smith',
    action: 'CREATE',
    module: 'Milestones',
    entityType: 'Milestone',
    entityId: 'M015',
    entityName: 'UAT Sign-off',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    timestamp: new Date('2024-01-15T11:20:00'),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Sarah Johnson',
    action: 'APPROVE',
    module: 'Financials',
    entityType: 'PurchaseOrder',
    entityId: 'PO-2024-001',
    entityName: 'Server Hardware PO',
    changes: {
      status: { old: 'pending_approval', new: 'approved' },
    },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
    timestamp: new Date('2024-01-15T09:45:00'),
  },
  {
    id: '4',
    userId: '1',
    userName: 'Admin User',
    action: 'UPDATE',
    module: 'Users',
    entityType: 'User',
    entityId: '5',
    entityName: 'Locked User',
    changes: {
      status: { old: 'active', new: 'locked' },
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    timestamp: new Date('2024-01-14T16:00:00'),
  },
  {
    id: '5',
    userId: '2',
    userName: 'John Smith',
    action: 'UPDATE',
    module: 'Projects',
    entityType: 'ChangeRequest',
    entityId: 'CR-005',
    entityName: 'Scope Extension Request',
    changes: {
      status: { old: 'draft', new: 'submitted' },
      costImpact: { old: 0, new: 25000 },
      timeImpactDays: { old: 0, new: 14 },
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    timestamp: new Date('2024-01-14T14:30:00'),
  },
  {
    id: '6',
    userId: '4',
    userName: 'Mike Vendor',
    action: 'VIEW',
    module: 'Projects',
    entityType: 'Project',
    entityId: 'P001',
    entityName: 'ERP Implementation',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
    timestamp: new Date('2024-01-14T10:00:00'),
  },
  {
    id: '7',
    userId: '1',
    userName: 'Admin User',
    action: 'DELETE',
    module: 'Projects',
    entityType: 'Risk',
    entityId: 'R-012',
    entityName: 'Vendor Delay Risk',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    timestamp: new Date('2024-01-13T11:15:00'),
  },
]

const actionColors: Record<string, string> = {
  CREATE: 'bg-success-50 text-success-600',
  UPDATE: 'bg-primary-50 text-primary-600',
  DELETE: 'bg-danger-50 text-danger-600',
  APPROVE: 'bg-success-50 text-success-600',
  REJECT: 'bg-danger-50 text-danger-600',
  VIEW: 'bg-gray-100 text-gray-600',
}

const moduleIcons: Record<string, React.ReactNode> = {
  Projects: <FileText className="w-4 h-4" />,
  Users: <User className="w-4 h-4" />,
  Financials: <DollarSign className="w-4 h-4" />,
  Milestones: <Flag className="w-4 h-4" />,
}

export default function AuditLogPage() {
  const [logs] = useState<AuditLog[]>(demoAuditLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = !moduleFilter || log.module === moduleFilter
    const matchesAction = !actionFilter || log.action === actionFilter
    return matchesSearch && matchesModule && matchesAction
  })

  const columns = [
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (log: AuditLog) => (
        <div>
          <p className="font-medium text-gray-900">
            {format(new Date(log.timestamp), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-gray-500">
            {format(new Date(log.timestamp), 'h:mm:ss a')}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'user',
      header: 'User',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="font-medium text-gray-900">{log.userName}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
            actionColors[log.action] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {log.action}
        </span>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">
            {moduleIcons[log.module] || <FileText className="w-4 h-4" />}
          </span>
          <span>{log.module}</span>
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (log: AuditLog) => (
        <div>
          <p className="font-medium text-gray-900">{log.entityName}</p>
          <p className="text-xs text-gray-500">
            {log.entityType} #{log.entityId}
          </p>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (log: AuditLog) => (
        <span className="text-gray-500 font-mono text-sm">{log.ipAddress}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (log: AuditLog) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedLog(log)
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
      className: 'w-12',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-1">
            Track all system activities and changes for compliance
          </p>
        </div>
        <button className="btn btn-secondary">
          <Download className="w-5 h-5" />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user or entity..."
              className="input pl-10"
            />
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Modules</option>
              <option value="Projects">Projects</option>
              <option value="Users">Users</option>
              <option value="Financials">Financials</option>
              <option value="Milestones">Milestones</option>
            </select>
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="input w-32"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="APPROVE">Approve</option>
            <option value="VIEW">View</option>
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input type="date" className="input w-36" />
            <span className="text-gray-400">to</span>
            <input type="date" className="input w-36" />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        data={filteredLogs}
        columns={columns}
        keyExtractor={(log) => log.id}
        onRowClick={(log) => setSelectedLog(log)}
        emptyMessage="No audit logs found"
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Date & Time</label>
                <p className="font-medium">
                  {format(new Date(selectedLog.timestamp), 'MMMM d, yyyy h:mm:ss a')}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">User</label>
                <p className="font-medium">{selectedLog.userName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Action</label>
                <p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      actionColors[selectedLog.action]
                    }`}
                  >
                    {selectedLog.action}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Module</label>
                <p className="font-medium">{selectedLog.module}</p>
              </div>
            </div>

            {/* Entity Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Entity Details</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Type</label>
                  <p className="font-medium">{selectedLog.entityType}</p>
                </div>
                <div>
                  <label className="text-gray-500">ID</label>
                  <p className="font-medium font-mono">{selectedLog.entityId}</p>
                </div>
                <div>
                  <label className="text-gray-500">Name</label>
                  <p className="font-medium">{selectedLog.entityName}</p>
                </div>
              </div>
            </div>

            {/* Changes */}
            {selectedLog.changes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Changes Made</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">
                          Field
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">
                          Old Value
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">
                          New Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(selectedLog.changes).map(([field, values]) => (
                        <tr key={field}>
                          <td className="py-2 px-4 font-medium capitalize">{field}</td>
                          <td className="py-2 px-4 text-danger-600">
                            {String(values.old)}
                          </td>
                          <td className="py-2 px-4 text-success-600">
                            {String(values.new)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-gray-500">IP Address</label>
                  <p className="font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-gray-500">User Agent</label>
                  <p className="font-mono text-xs break-all">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
