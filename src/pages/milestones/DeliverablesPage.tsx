import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, differenceInDays } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  Package,
  FileText,
  CheckCircle,
  Clock,
  Upload,
  MoreVertical,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { Deliverable, DeliverableStatus } from '../../types'

const demoDeliverables: Deliverable[] = [
  {
    id: 'd1', projectId: '1', milestoneId: 'm1', code: 'DEL-001', name: 'Project Charter',
    description: 'Formal project charter document with objectives and scope',
    status: 'accepted', dueDate: new Date('2024-01-15'),
    submittedDate: new Date('2024-01-14'), acceptedDate: new Date('2024-01-15'),
    owner: 'John Smith', ownerId: '2', reviewer: 'Client', reviewerId: 'client-1',
    acceptanceCriteria: ['All sections complete', 'Stakeholder signatures obtained'],
    attachments: [{ id: 'a1', name: 'Project_Charter_v1.0.pdf', url: '/files/charter.pdf', size: 245000, type: 'application/pdf', uploadedBy: 'John Smith', uploadedAt: new Date() }],
    comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd2', projectId: '1', milestoneId: 'm2', code: 'DEL-002', name: 'Business Requirements Document',
    description: 'Comprehensive BRD covering all functional requirements',
    status: 'accepted', dueDate: new Date('2024-02-20'),
    submittedDate: new Date('2024-02-18'), acceptedDate: new Date('2024-02-25'),
    owner: 'Lisa Park', ownerId: '5', reviewer: 'Client', reviewerId: 'client-1',
    acceptanceCriteria: ['All user stories documented', 'Acceptance criteria defined', 'Client approval'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd3', projectId: '1', milestoneId: 'm2', code: 'DEL-003', name: 'System Requirements Specification',
    description: 'Technical system requirements and specifications',
    status: 'accepted', dueDate: new Date('2024-02-25'),
    submittedDate: new Date('2024-02-24'), acceptedDate: new Date('2024-02-28'),
    owner: 'Sarah Lee', ownerId: '6', reviewer: 'Tech Lead', reviewerId: '6',
    acceptanceCriteria: ['All system requirements documented', 'NFRs defined'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd4', projectId: '1', milestoneId: 'm3', code: 'DEL-004', name: 'Architecture Design Document',
    description: 'System architecture and design patterns',
    status: 'accepted', dueDate: new Date('2024-04-15'),
    submittedDate: new Date('2024-04-12'), acceptedDate: new Date('2024-04-18'),
    owner: 'Sarah Lee', ownerId: '6',
    acceptanceCriteria: ['Architecture diagrams complete', 'Technology stack defined'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd5', projectId: '1', milestoneId: 'm3', code: 'DEL-005', name: 'UI/UX Design Mockups',
    description: 'Complete set of UI mockups and design system',
    status: 'accepted', dueDate: new Date('2024-04-20'),
    submittedDate: new Date('2024-04-19'), acceptedDate: new Date('2024-04-22'),
    owner: 'Lisa Park', ownerId: '5', reviewer: 'Client', reviewerId: 'client-1',
    acceptanceCriteria: ['All screens designed', 'Design system documented', 'Client approval'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd6', projectId: '1', milestoneId: 'm4', code: 'DEL-006', name: 'Core Modules Source Code',
    description: 'Source code for core application modules',
    status: 'in_progress', dueDate: new Date('2024-06-25'),
    owner: 'Mike Chen', ownerId: '7',
    acceptanceCriteria: ['All unit tests passing', 'Code review completed', 'Documentation updated'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd7', projectId: '1', milestoneId: 'm4', code: 'DEL-007', name: 'API Documentation',
    description: 'Complete API documentation with examples',
    status: 'in_progress', dueDate: new Date('2024-06-30'),
    owner: 'Mike Chen', ownerId: '7',
    acceptanceCriteria: ['All endpoints documented', 'Examples provided', 'Swagger/OpenAPI spec'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'd8', projectId: '1', milestoneId: 'm5', code: 'DEL-008', name: 'UAT Test Results',
    description: 'Complete UAT test execution results and sign-off',
    status: 'not_started', dueDate: new Date('2024-10-10'),
    owner: 'Tom Wilson', ownerId: '8',
    acceptanceCriteria: ['All test cases executed', 'Defects resolved', 'Sign-off obtained'],
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
]

const statusConfig: Record<DeliverableStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  not_started: { label: 'Not Started', type: 'default' },
  in_progress: { label: 'In Progress', type: 'warning' },
  submitted: { label: 'Submitted', type: 'info' },
  accepted: { label: 'Accepted', type: 'success' },
  rejected: { label: 'Rejected', type: 'danger' },
}

export default function DeliverablesPage() {
  const { projectId } = useParams()
  const [deliverables] = useState<Deliverable[]>(demoDeliverables)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null)

  const filteredDeliverables = deliverables.filter((del) => {
    const matchesSearch = del.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || del.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'code',
      header: 'ID',
      render: (del: Deliverable) => (
        <span className="font-mono text-sm text-gray-500">{del.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Deliverable',
      render: (del: Deliverable) => (
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {del.status === 'accepted' ? (
              <CheckCircle className="w-5 h-5 text-success-500" />
            ) : del.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-warning-500" />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{del.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{del.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (del: Deliverable) => {
        const config = statusConfig[del.status]
        return (
          <StatusBadge status={config.type} size="sm">
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (del: Deliverable) => {
        const daysUntil = differenceInDays(new Date(del.dueDate), new Date())
        const isOverdue = daysUntil < 0 && del.status !== 'accepted'
        return (
          <div>
            <p className={`font-medium ${isOverdue ? 'text-danger-600' : ''}`}>
              {format(new Date(del.dueDate), 'MMM d, yyyy')}
            </p>
            {del.status !== 'accepted' && (
              <p className={`text-xs ${isOverdue ? 'text-danger-600' : daysUntil < 7 ? 'text-warning-600' : 'text-gray-500'}`}>
                {isOverdue ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d remaining`}
              </p>
            )}
          </div>
        )
      },
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (del: Deliverable) => del.owner,
    },
    {
      key: 'attachments',
      header: 'Files',
      render: (del: Deliverable) => (
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{del.attachments.length}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (del: Deliverable) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedDeliverable(del)
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
          <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
          <p className="text-gray-600 mt-1">
            Track and manage project deliverables
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Deliverable
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: deliverables.length, color: 'text-gray-900' },
          { label: 'In Progress', value: deliverables.filter(d => d.status === 'in_progress').length, color: 'text-warning-600' },
          { label: 'Submitted', value: deliverables.filter(d => d.status === 'submitted').length, color: 'text-primary-600' },
          { label: 'Accepted', value: deliverables.filter(d => d.status === 'accepted').length, color: 'text-success-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
              placeholder="Search deliverables..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-36"
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
        data={filteredDeliverables}
        columns={columns}
        keyExtractor={(del) => del.id}
        onRowClick={(del) => setSelectedDeliverable(del)}
        emptyMessage="No deliverables found"
      />

      {/* Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedDeliverable}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedDeliverable(null)
        }}
        title={selectedDeliverable ? 'Deliverable Details' : 'Add Deliverable'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedDeliverable(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            {selectedDeliverable?.status === 'in_progress' && (
              <button className="btn btn-primary">
                <Upload className="w-4 h-4" />
                Submit for Review
              </button>
            )}
            {selectedDeliverable?.status === 'submitted' && (
              <>
                <button className="btn btn-danger">Reject</button>
                <button className="btn btn-success">Accept</button>
              </>
            )}
            {!selectedDeliverable && (
              <button className="btn btn-primary">Add Deliverable</button>
            )}
          </>
        }
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Deliverable ID</label>
              <input type="text" className="input" defaultValue={selectedDeliverable?.code} placeholder="DEL-XXX" />
            </div>
            <div>
              <label className="label">Linked Milestone</label>
              <select className="input" defaultValue={selectedDeliverable?.milestoneId || ''}>
                <option value="">Select milestone</option>
                <option value="m1">MS-001: Project Kickoff</option>
                <option value="m2">MS-002: Requirements Sign-off</option>
                <option value="m3">MS-003: Design Complete</option>
                <option value="m4">MS-004: Dev Phase 1</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Name</label>
            <input type="text" className="input" defaultValue={selectedDeliverable?.name} placeholder="Deliverable name" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} defaultValue={selectedDeliverable?.description} placeholder="Deliverable description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" defaultValue={selectedDeliverable ? format(new Date(selectedDeliverable.dueDate), 'yyyy-MM-dd') : ''} />
            </div>
            <div>
              <label className="label">Owner</label>
              <select className="input" defaultValue={selectedDeliverable?.ownerId || ''}>
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
              defaultValue={selectedDeliverable?.acceptanceCriteria.join('\n')}
              placeholder="Enter each criterion on a new line"
            />
          </div>

          {selectedDeliverable?.attachments && selectedDeliverable.attachments.length > 0 && (
            <div>
              <label className="label">Attachments</label>
              <div className="border border-gray-200 rounded-lg divide-y">
                {selectedDeliverable.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm">Download</button>
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
