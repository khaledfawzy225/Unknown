import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, differenceInDays } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  Flag,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreVertical,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { Milestone, MilestoneType, MilestoneStatus } from '../../types'

const demoMilestones: Milestone[] = [
  {
    id: 'm1', projectId: '1', code: 'MS-001', name: 'Project Kickoff',
    description: 'Official project kickoff meeting with all stakeholders',
    type: 'internal', status: 'achieved', owner: 'John Smith', ownerId: '2',
    plannedDate: new Date('2024-01-15'), baselineDate: new Date('2024-01-15'),
    actualDate: new Date('2024-01-15'),
    acceptanceCriteria: ['Kickoff meeting completed', 'All stakeholders aligned', 'Project charter signed'],
    linkedDeliverables: ['d1'], linkedPOs: [], linkedPayments: [],
    isPaymentMilestone: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'm2', projectId: '1', code: 'MS-002', name: 'Requirements Sign-off',
    description: 'Customer approval of all business requirements',
    type: 'contractual', status: 'achieved', owner: 'Lisa Park', ownerId: '5',
    plannedDate: new Date('2024-02-28'), baselineDate: new Date('2024-02-28'),
    actualDate: new Date('2024-03-02'),
    acceptanceCriteria: ['All requirements documented', 'Customer sign-off obtained', 'Baseline established'],
    linkedDeliverables: ['d2', 'd3'], linkedPOs: [], linkedPayments: ['pay-1'],
    isPaymentMilestone: true, paymentAmount: 75000, paymentTerms: 'Net 30',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'm3', projectId: '1', code: 'MS-003', name: 'Design Complete',
    description: 'All system design documents approved',
    type: 'internal', status: 'achieved', owner: 'Sarah Lee', ownerId: '6',
    plannedDate: new Date('2024-04-30'), baselineDate: new Date('2024-04-30'),
    actualDate: new Date('2024-04-28'),
    acceptanceCriteria: ['Architecture design approved', 'UI/UX designs finalized', 'Data model complete'],
    linkedDeliverables: ['d4', 'd5'], linkedPOs: [], linkedPayments: [],
    isPaymentMilestone: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'm4', projectId: '1', code: 'MS-004', name: 'Development Phase 1 Complete',
    description: 'Core modules developed and unit tested',
    type: 'contractual', status: 'at_risk', owner: 'Mike Chen', ownerId: '7',
    plannedDate: new Date('2024-06-30'), baselineDate: new Date('2024-06-15'),
    forecastDate: new Date('2024-07-10'),
    acceptanceCriteria: ['All core modules complete', 'Unit tests passing', 'Code review completed'],
    linkedDeliverables: ['d6', 'd7'], linkedPOs: ['po-1'], linkedPayments: ['pay-2'],
    isPaymentMilestone: true, paymentAmount: 150000, paymentTerms: 'Net 30',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'm5', projectId: '1', code: 'MS-005', name: 'UAT Sign-off',
    description: 'User Acceptance Testing completed and approved',
    type: 'customer_acceptance', status: 'upcoming', owner: 'Tom Wilson', ownerId: '8',
    plannedDate: new Date('2024-10-15'), baselineDate: new Date('2024-10-01'),
    acceptanceCriteria: ['All test cases passed', 'No critical defects', 'Customer sign-off'],
    linkedDeliverables: ['d8'], linkedPOs: [], linkedPayments: ['pay-3'],
    isPaymentMilestone: true, paymentAmount: 100000, paymentTerms: 'Net 30',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'm6', projectId: '1', code: 'MS-006', name: 'Go-Live',
    description: 'Production deployment and launch',
    type: 'contractual', status: 'upcoming', owner: 'John Smith', ownerId: '2',
    plannedDate: new Date('2024-11-30'), baselineDate: new Date('2024-11-15'),
    acceptanceCriteria: ['Production deployment successful', 'All systems operational', 'Training completed'],
    linkedDeliverables: ['d9', 'd10'], linkedPOs: [], linkedPayments: ['pay-4'],
    isPaymentMilestone: true, paymentAmount: 100000, paymentTerms: 'Net 30',
    createdAt: new Date(), updatedAt: new Date(),
  },
]

const typeConfig: Record<MilestoneType, { label: string; color: string }> = {
  contractual: { label: 'Contractual', color: 'bg-primary-50 text-primary-600' },
  internal: { label: 'Internal', color: 'bg-gray-100 text-gray-600' },
  payment: { label: 'Payment', color: 'bg-success-50 text-success-600' },
  customer_acceptance: { label: 'Customer Acceptance', color: 'bg-warning-50 text-warning-600' },
}

const statusConfig: Record<MilestoneStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  upcoming: { label: 'Upcoming', type: 'info' },
  at_risk: { label: 'At Risk', type: 'warning' },
  achieved: { label: 'Achieved', type: 'success' },
  missed: { label: 'Missed', type: 'danger' },
  deferred: { label: 'Deferred', type: 'default' },
}

export default function MilestonesPage() {
  const { projectId } = useParams()
  const [milestones] = useState<Milestone[]>(demoMilestones)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  const filteredMilestones = milestones.filter((ms) => {
    const matchesSearch = ms.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || ms.status === statusFilter
    const matchesType = !typeFilter || ms.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const columns = [
    {
      key: 'code',
      header: 'ID',
      render: (ms: Milestone) => (
        <span className="font-mono text-sm text-gray-500">{ms.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Milestone',
      render: (ms: Milestone) => (
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {ms.status === 'achieved' ? (
              <CheckCircle className="w-5 h-5 text-success-500" />
            ) : ms.status === 'at_risk' ? (
              <AlertTriangle className="w-5 h-5 text-warning-500" />
            ) : ms.status === 'missed' ? (
              <AlertTriangle className="w-5 h-5 text-danger-500" />
            ) : (
              <Flag className="w-5 h-5 text-primary-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{ms.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{ms.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (ms: Milestone) => {
        const config = typeConfig[ms.type]
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (ms: Milestone) => {
        const config = statusConfig[ms.status]
        return (
          <StatusBadge status={config.type} size="sm">
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (ms: Milestone) => {
        const daysUntil = differenceInDays(new Date(ms.plannedDate), new Date())
        return (
          <div>
            <p className="font-medium">{format(new Date(ms.plannedDate), 'MMM d, yyyy')}</p>
            {ms.actualDate ? (
              <p className="text-xs text-success-600">
                Completed {format(new Date(ms.actualDate), 'MMM d')}
              </p>
            ) : ms.forecastDate ? (
              <p className="text-xs text-warning-600">
                Forecast: {format(new Date(ms.forecastDate), 'MMM d')}
              </p>
            ) : (
              <p className={`text-xs ${daysUntil < 0 ? 'text-danger-600' : daysUntil < 7 ? 'text-warning-600' : 'text-gray-500'}`}>
                {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d remaining`}
              </p>
            )}
          </div>
        )
      },
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (ms: Milestone) => (
        ms.isPaymentMilestone ? (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-success-500" />
            <span className="font-medium text-success-600">
              ${(ms.paymentAmount || 0).toLocaleString()}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (ms: Milestone) => ms.owner,
    },
    {
      key: 'actions',
      header: '',
      render: (ms: Milestone) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedMilestone(ms)
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
          <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-600 mt-1">
            Track project milestones and payment triggers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Milestone
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: milestones.length, icon: Flag, color: 'text-gray-900' },
          { label: 'Achieved', value: milestones.filter(m => m.status === 'achieved').length, icon: CheckCircle, color: 'text-success-600' },
          { label: 'At Risk', value: milestones.filter(m => m.status === 'at_risk').length, icon: AlertTriangle, color: 'text-warning-600' },
          { label: 'Payment Value', value: `$${(milestones.filter(m => m.isPaymentMilestone).reduce((sum, m) => sum + (m.paymentAmount || 0), 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-success-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
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
              placeholder="Search milestones..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Status</option>
              {Object.entries(statusConfig).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Types</option>
              {Object.entries(typeConfig).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredMilestones}
        columns={columns}
        keyExtractor={(ms) => ms.id}
        onRowClick={(ms) => setSelectedMilestone(ms)}
        emptyMessage="No milestones found"
      />

      {/* Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedMilestone}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedMilestone(null)
        }}
        title={selectedMilestone ? 'Edit Milestone' : 'Add Milestone'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedMilestone(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedMilestone ? 'Save Changes' : 'Add Milestone'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Milestone ID</label>
              <input type="text" className="input" defaultValue={selectedMilestone?.code} placeholder="MS-XXX" />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" defaultValue={selectedMilestone?.type || 'internal'}>
                {Object.entries(typeConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Name</label>
            <input type="text" className="input" defaultValue={selectedMilestone?.name} placeholder="Milestone name" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} defaultValue={selectedMilestone?.description} placeholder="Milestone description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Planned Date</label>
              <input type="date" className="input" defaultValue={selectedMilestone ? format(new Date(selectedMilestone.plannedDate), 'yyyy-MM-dd') : ''} />
            </div>
            <div>
              <label className="label">Owner</label>
              <select className="input" defaultValue={selectedMilestone?.ownerId || ''}>
                <option value="">Select owner</option>
                <option value="2">John Smith</option>
                <option value="5">Lisa Park</option>
                <option value="6">Sarah Lee</option>
                <option value="7">Mike Chen</option>
                <option value="8">Tom Wilson</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Acceptance Criteria</label>
            <textarea
              className="input"
              rows={3}
              defaultValue={selectedMilestone?.acceptanceCriteria.join('\n')}
              placeholder="Enter each criterion on a new line"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedMilestone?.isPaymentMilestone}
              />
              <span className="font-medium">Payment Milestone</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Payment Amount ($)</label>
                <input type="number" className="input" defaultValue={selectedMilestone?.paymentAmount} />
              </div>
              <div>
                <label className="label">Payment Terms</label>
                <select className="input" defaultValue={selectedMilestone?.paymentTerms || 'Net 30'}>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
