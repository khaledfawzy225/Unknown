import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  GitPullRequest,
  Clock,
  DollarSign,
  Calendar,
  Check,
  X,
  MoreVertical,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { ChangeRequest, ChangeRequestStatus } from '../../types'

const demoChangeRequests: ChangeRequest[] = [
  {
    id: 'cr1', projectId: '1', code: 'CR-001', title: 'Add mobile responsive dashboard',
    description: 'Make the main dashboard fully responsive for mobile devices',
    scopeDescription: 'Redesign dashboard layout to use responsive grid, optimize charts for mobile',
    justification: 'Client stakeholders frequently access dashboard from mobile devices',
    timeImpactDays: 7, costImpact: 15000, qualityImpact: 'Improved user experience', riskImpact: 'Low - no core functionality changes',
    status: 'approved', requestedBy: 'Lisa Park', requestedById: '5', requestedDate: new Date('2024-01-10'),
    approvals: [
      { id: 'a1', approverId: '2', approverName: 'John Smith', role: 'PM', status: 'approved', comments: 'Approved - client priority', date: new Date('2024-01-11') },
      { id: 'a2', approverId: '3', approverName: 'Sarah Johnson', role: 'Finance', status: 'approved', comments: 'Budget approved', date: new Date('2024-01-12') },
    ],
    baselineUpdated: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'cr2', projectId: '1', code: 'CR-002', title: 'Integrate with CRM system',
    description: 'Add integration with Salesforce CRM for customer data sync',
    scopeDescription: 'Build API connector, data mapping, and sync scheduler',
    justification: 'Eliminate manual data entry and improve data accuracy',
    timeImpactDays: 14, costImpact: 35000, qualityImpact: 'Enhanced data accuracy', riskImpact: 'Medium - new external dependency',
    status: 'under_review', requestedBy: 'John Smith', requestedById: '2', requestedDate: new Date('2024-01-15'),
    approvals: [
      { id: 'a3', approverId: '2', approverName: 'John Smith', role: 'PM', status: 'approved', comments: 'Technical feasibility confirmed', date: new Date('2024-01-15') },
      { id: 'a4', approverId: '3', approverName: 'Sarah Johnson', role: 'Finance', status: 'pending' },
    ],
    baselineUpdated: false, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'cr3', projectId: '1', code: 'CR-003', title: 'Additional security audit requirements',
    description: 'Implement SOC2 compliance requirements',
    scopeDescription: 'Add audit logging, encryption enhancements, access controls',
    justification: 'Required for enterprise customer contracts',
    timeImpactDays: 21, costImpact: 45000, qualityImpact: 'Enhanced security posture', riskImpact: 'Low - security improvement',
    status: 'submitted', requestedBy: 'Mike Chen', requestedById: '7', requestedDate: new Date('2024-01-18'),
    approvals: [
      { id: 'a5', approverId: '2', approverName: 'John Smith', role: 'PM', status: 'pending' },
    ],
    baselineUpdated: false, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'cr4', projectId: '1', code: 'CR-004', title: 'Remove legacy report module',
    description: 'Deprecate old reporting system in favor of new BI tool',
    scopeDescription: 'Remove legacy code, migrate existing reports, update documentation',
    justification: 'Reduce maintenance overhead and simplify codebase',
    timeImpactDays: -5, costImpact: -8000, qualityImpact: 'Simplified maintenance', riskImpact: 'Low - reducing complexity',
    status: 'draft', requestedBy: 'Sarah Lee', requestedById: '6', requestedDate: new Date('2024-01-20'),
    approvals: [],
    baselineUpdated: false, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'cr5', projectId: '1', code: 'CR-005', title: 'Add multi-language support',
    description: 'Internationalize the application for European markets',
    scopeDescription: 'Extract strings, implement i18n framework, translate to 5 languages',
    justification: 'Required for European market expansion',
    timeImpactDays: 28, costImpact: 60000, qualityImpact: 'Expanded market reach', riskImpact: 'Medium - significant scope addition',
    status: 'rejected', requestedBy: 'Lisa Park', requestedById: '5', requestedDate: new Date('2024-01-05'),
    approvals: [
      { id: 'a6', approverId: '2', approverName: 'John Smith', role: 'PM', status: 'approved', date: new Date('2024-01-06') },
      { id: 'a7', approverId: '3', approverName: 'Sarah Johnson', role: 'Finance', status: 'rejected', comments: 'Defer to Phase 2 due to budget constraints', date: new Date('2024-01-08') },
    ],
    baselineUpdated: false, createdAt: new Date(), updatedAt: new Date(),
  },
]

const statusConfig: Record<ChangeRequestStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  draft: { label: 'Draft', type: 'default' },
  submitted: { label: 'Submitted', type: 'info' },
  under_review: { label: 'Under Review', type: 'warning' },
  approved: { label: 'Approved', type: 'success' },
  rejected: { label: 'Rejected', type: 'danger' },
  implemented: { label: 'Implemented', type: 'success' },
}

export default function ChangeRequestsPage() {
  const { projectId } = useParams()
  const [changes] = useState<ChangeRequest[]>(demoChangeRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedChange, setSelectedChange] = useState<ChangeRequest | null>(null)

  const filteredChanges = changes.filter((change) => {
    const matchesSearch = change.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || change.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCostImpact = changes
    .filter(c => c.status === 'approved' || c.status === 'implemented')
    .reduce((sum, c) => sum + c.costImpact, 0)

  const totalTimeImpact = changes
    .filter(c => c.status === 'approved' || c.status === 'implemented')
    .reduce((sum, c) => sum + c.timeImpactDays, 0)

  const columns = [
    {
      key: 'code',
      header: 'ID',
      render: (cr: ChangeRequest) => (
        <span className="font-mono text-sm text-gray-500">{cr.code}</span>
      ),
    },
    {
      key: 'title',
      header: 'Change Request',
      render: (cr: ChangeRequest) => (
        <div>
          <p className="font-medium text-gray-900">{cr.title}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{cr.description}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (cr: ChangeRequest) => {
        const config = statusConfig[cr.status]
        return (
          <StatusBadge status={config.type} size="sm">
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'timeImpact',
      header: 'Time Impact',
      render: (cr: ChangeRequest) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={cr.timeImpactDays > 0 ? 'text-danger-600' : 'text-success-600'}>
            {cr.timeImpactDays > 0 ? '+' : ''}{cr.timeImpactDays} days
          </span>
        </div>
      ),
    },
    {
      key: 'costImpact',
      header: 'Cost Impact',
      render: (cr: ChangeRequest) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className={cr.costImpact > 0 ? 'text-danger-600' : 'text-success-600'}>
            {cr.costImpact > 0 ? '+' : ''}{(cr.costImpact / 1000).toFixed(0)}K
          </span>
        </div>
      ),
    },
    {
      key: 'approvals',
      header: 'Approvals',
      render: (cr: ChangeRequest) => (
        <div className="flex items-center gap-1">
          {cr.approvals.map((approval) => (
            <span
              key={approval.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                approval.status === 'approved' ? 'bg-success-100 text-success-600' :
                approval.status === 'rejected' ? 'bg-danger-100 text-danger-600' :
                'bg-gray-100 text-gray-500'
              }`}
              title={`${approval.approverName}: ${approval.status}`}
            >
              {approval.status === 'approved' ? <Check className="w-3 h-3" /> :
               approval.status === 'rejected' ? <X className="w-3 h-3" /> :
               <Clock className="w-3 h-3" />}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'requestedBy',
      header: 'Requested By',
      render: (cr: ChangeRequest) => (
        <div>
          <p className="text-sm">{cr.requestedBy}</p>
          <p className="text-xs text-gray-500">{format(new Date(cr.requestedDate), 'MMM d')}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (cr: ChangeRequest) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedChange(cr)
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <MoreVertical className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Change Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage scope changes with impact assessment and approvals
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{changes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-warning-600">
                {changes.filter(c => c.status === 'submitted' || c.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Calendar className={`w-5 h-5 ${totalTimeImpact > 0 ? 'text-danger-500' : 'text-success-500'}`} />
            <div>
              <p className="text-sm text-gray-500">Schedule Impact</p>
              <p className={`text-2xl font-bold ${totalTimeImpact > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                {totalTimeImpact > 0 ? '+' : ''}{totalTimeImpact} days
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <DollarSign className={`w-5 h-5 ${totalCostImpact > 0 ? 'text-danger-500' : 'text-success-500'}`} />
            <div>
              <p className="text-sm text-gray-500">Cost Impact</p>
              <p className={`text-2xl font-bold ${totalCostImpact > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                {totalCostImpact > 0 ? '+' : ''}${(totalCostImpact / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search change requests..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Status</option>
              {Object.entries(statusConfig).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredChanges}
        columns={columns}
        keyExtractor={(cr) => cr.id}
        onRowClick={(cr) => setSelectedChange(cr)}
        emptyMessage="No change requests found"
      />

      {/* Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedChange}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedChange(null)
        }}
        title={selectedChange ? 'Change Request Details' : 'New Change Request'}
        size="xl"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedChange(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            {selectedChange?.status === 'under_review' && (
              <>
                <button className="btn btn-danger">Reject</button>
                <button className="btn btn-success">Approve</button>
              </>
            )}
            {(!selectedChange || selectedChange.status === 'draft') && (
              <button className="btn btn-primary">
                {selectedChange ? 'Submit for Approval' : 'Create Request'}
              </button>
            )}
          </>
        }
      >
        <form className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input" defaultValue={selectedChange?.title} placeholder="Change request title" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} defaultValue={selectedChange?.description} placeholder="Brief description" />
          </div>

          <div>
            <label className="label">Scope Description</label>
            <textarea className="input" rows={3} defaultValue={selectedChange?.scopeDescription} placeholder="What needs to change?" />
          </div>

          <div>
            <label className="label">Justification</label>
            <textarea className="input" rows={2} defaultValue={selectedChange?.justification} placeholder="Why is this change needed?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Time Impact (days)</label>
              <input type="number" className="input" defaultValue={selectedChange?.timeImpactDays || 0} />
            </div>
            <div>
              <label className="label">Cost Impact ($)</label>
              <input type="number" className="input" defaultValue={selectedChange?.costImpact || 0} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quality Impact</label>
              <input type="text" className="input" defaultValue={selectedChange?.qualityImpact} placeholder="Impact on quality" />
            </div>
            <div>
              <label className="label">Risk Impact</label>
              <input type="text" className="input" defaultValue={selectedChange?.riskImpact} placeholder="Impact on risks" />
            </div>
          </div>

          {selectedChange?.approvals && selectedChange.approvals.length > 0 && (
            <div>
              <label className="label">Approval Status</label>
              <div className="border border-gray-200 rounded-lg divide-y">
                {selectedChange.approvals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-medium">{approval.approverName}</p>
                      <p className="text-sm text-gray-500">{approval.role}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={approval.status === 'approved' ? 'success' : approval.status === 'rejected' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {approval.status}
                      </StatusBadge>
                      {approval.comments && (
                        <p className="text-xs text-gray-500 mt-1">{approval.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}
