import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, differenceInHours } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  ArrowUp,
  MoreVertical,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { Issue, IssuePriority, IssueStatus } from '../../types'

const demoIssues: Issue[] = [
  {
    id: 'i1', projectId: '1', code: 'ISS-001', title: 'Database performance degradation',
    description: 'Queries taking longer than expected in production environment',
    category: 'Technical', priority: 'high', status: 'in_progress',
    owner: 'Mike Chen', ownerId: '7', assignee: 'Mike Chen', assigneeId: '7',
    slaHours: 24, slaDeadline: new Date('2024-01-17T10:00:00'),
    escalationPath: ['pm', 'director', 'cto'], currentEscalationLevel: 0,
    linkedTasks: ['t2'], linkedPOs: [], linkedRisks: ['r3'],
    createdAt: new Date('2024-01-16T10:00:00'), updatedAt: new Date(),
  },
  {
    id: 'i2', projectId: '1', code: 'ISS-002', title: 'Integration timeout errors',
    description: 'API calls to third-party service timing out intermittently',
    category: 'Integration', priority: 'medium', status: 'open',
    owner: 'Sarah Lee', ownerId: '6', assignee: 'Sarah Lee', assigneeId: '6',
    slaHours: 48, slaDeadline: new Date('2024-01-18T14:00:00'),
    escalationPath: ['pm', 'director'], currentEscalationLevel: 0,
    linkedTasks: ['t2'], linkedPOs: [], linkedRisks: ['r4'],
    createdAt: new Date('2024-01-16T14:00:00'), updatedAt: new Date(),
  },
  {
    id: 'i3', projectId: '1', code: 'ISS-003', title: 'Report formatting issues',
    description: 'PDF reports not rendering correctly in some browsers',
    category: 'UI/UX', priority: 'low', status: 'resolved',
    owner: 'Lisa Park', ownerId: '5', assignee: 'Tom Wilson', assigneeId: '8',
    slaHours: 72, slaDeadline: new Date('2024-01-19T09:00:00'),
    escalationPath: ['pm'], currentEscalationLevel: 0,
    linkedTasks: [], linkedPOs: [], linkedRisks: [],
    resolution: 'Updated PDF library to latest version',
    resolvedDate: new Date('2024-01-17T15:00:00'),
    createdAt: new Date('2024-01-14T09:00:00'), updatedAt: new Date(),
  },
  {
    id: 'i4', projectId: '1', code: 'ISS-004', title: 'User session expiring too quickly',
    description: 'Users being logged out after 5 minutes of inactivity',
    category: 'Security', priority: 'high', status: 'escalated',
    owner: 'John Smith', ownerId: '2', assignee: 'Mike Chen', assigneeId: '7',
    slaHours: 24, slaDeadline: new Date('2024-01-16T18:00:00'),
    escalationPath: ['pm', 'director', 'cto'], currentEscalationLevel: 1,
    linkedTasks: ['t5'], linkedPOs: [], linkedRisks: [],
    createdAt: new Date('2024-01-15T18:00:00'), updatedAt: new Date(),
  },
  {
    id: 'i5', projectId: '1', code: 'ISS-005', title: 'Missing data in customer export',
    description: 'Export functionality missing some customer fields',
    category: 'Data', priority: 'critical', status: 'in_progress',
    owner: 'Lisa Park', ownerId: '5', assignee: 'Mike Chen', assigneeId: '7',
    slaHours: 8, slaDeadline: new Date('2024-01-16T20:00:00'),
    escalationPath: ['pm', 'director', 'cto'], currentEscalationLevel: 0,
    linkedTasks: [], linkedPOs: [], linkedRisks: [],
    createdAt: new Date('2024-01-16T12:00:00'), updatedAt: new Date(),
  },
]

const priorityConfig: Record<IssuePriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-warning-500' },
  high: { label: 'High', color: 'text-orange-500' },
  critical: { label: 'Critical', color: 'text-danger-500' },
}

const statusConfig: Record<IssueStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  open: { label: 'Open', type: 'info' },
  in_progress: { label: 'In Progress', type: 'warning' },
  escalated: { label: 'Escalated', type: 'danger' },
  resolved: { label: 'Resolved', type: 'success' },
  closed: { label: 'Closed', type: 'default' },
}

export default function IssuesPage() {
  const { projectId } = useParams()
  const [issues] = useState<Issue[]>(demoIssues)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || issue.status === statusFilter
    const matchesPriority = !priorityFilter || issue.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getSLAStatus = (issue: Issue) => {
    if (issue.status === 'resolved' || issue.status === 'closed') return 'met'
    const hoursRemaining = differenceInHours(new Date(issue.slaDeadline), new Date())
    if (hoursRemaining < 0) return 'breached'
    if (hoursRemaining < issue.slaHours * 0.25) return 'at_risk'
    return 'on_track'
  }

  const columns = [
    {
      key: 'code',
      header: 'ID',
      render: (issue: Issue) => (
        <span className="font-mono text-sm text-gray-500">{issue.code}</span>
      ),
    },
    {
      key: 'title',
      header: 'Issue',
      render: (issue: Issue) => (
        <div>
          <p className="font-medium text-gray-900">{issue.title}</p>
          <p className="text-sm text-gray-500">{issue.category}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (issue: Issue) => (
        <span className={`font-medium ${priorityConfig[issue.priority].color}`}>
          {priorityConfig[issue.priority].label}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (issue: Issue) => {
        const config = statusConfig[issue.status]
        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={config.type} size="sm">
              {config.label}
            </StatusBadge>
            {issue.currentEscalationLevel > 0 && (
              <ArrowUp className="w-4 h-4 text-danger-500" />
            )}
          </div>
        )
      },
    },
    {
      key: 'sla',
      header: 'SLA',
      render: (issue: Issue) => {
        const slaStatus = getSLAStatus(issue)
        const hoursRemaining = differenceInHours(new Date(issue.slaDeadline), new Date())
        return (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${
              slaStatus === 'breached' ? 'text-danger-500' :
              slaStatus === 'at_risk' ? 'text-warning-500' :
              'text-success-500'
            }`} />
            <span className={`text-sm ${
              slaStatus === 'breached' ? 'text-danger-600' :
              slaStatus === 'at_risk' ? 'text-warning-600' :
              'text-gray-600'
            }`}>
              {slaStatus === 'met' ? 'Met' :
               slaStatus === 'breached' ? `${Math.abs(hoursRemaining)}h overdue` :
               `${hoursRemaining}h left`}
            </span>
          </div>
        )
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (issue: Issue) => issue.assignee,
    },
    {
      key: 'created',
      header: 'Created',
      render: (issue: Issue) => format(new Date(issue.createdAt), 'MMM d, h:mm a'),
    },
    {
      key: 'actions',
      header: '',
      render: (issue: Issue) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedIssue(issue)
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
          <h1 className="text-2xl font-bold text-gray-900">Issue Log</h1>
          <p className="text-gray-600 mt-1">
            Track and resolve project issues with SLA monitoring
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Log Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open Issues', value: issues.filter(i => i.status === 'open' || i.status === 'in_progress').length, color: 'text-warning-600', icon: AlertCircle },
          { label: 'Escalated', value: issues.filter(i => i.status === 'escalated').length, color: 'text-danger-600', icon: ArrowUp },
          { label: 'SLA Breached', value: issues.filter(i => getSLAStatus(i) === 'breached').length, color: 'text-danger-600', icon: Clock },
          { label: 'Resolved', value: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length, color: 'text-success-600', icon: AlertCircle },
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
              placeholder="Search issues..."
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
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Priority</option>
              {Object.entries(priorityConfig).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <DataTable
        data={filteredIssues}
        columns={columns}
        keyExtractor={(issue) => issue.id}
        onRowClick={(issue) => setSelectedIssue(issue)}
        emptyMessage="No issues found"
      />

      {/* Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedIssue}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedIssue(null)
        }}
        title={selectedIssue ? 'Edit Issue' : 'Log Issue'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedIssue(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedIssue ? 'Save Changes' : 'Log Issue'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input" defaultValue={selectedIssue?.title} placeholder="Issue title" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} defaultValue={selectedIssue?.description} placeholder="Describe the issue" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input" defaultValue={selectedIssue?.category || ''}>
                <option value="">Select category</option>
                <option value="Technical">Technical</option>
                <option value="Integration">Integration</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Data">Data</option>
                <option value="Security">Security</option>
                <option value="Performance">Performance</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" defaultValue={selectedIssue?.priority || 'medium'}>
                {Object.entries(priorityConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Assignee</label>
              <select className="input" defaultValue={selectedIssue?.assigneeId || ''}>
                <option value="">Select assignee</option>
                <option value="7">Mike Chen</option>
                <option value="5">Lisa Park</option>
                <option value="6">Sarah Lee</option>
                <option value="8">Tom Wilson</option>
              </select>
            </div>
            <div>
              <label className="label">SLA (hours)</label>
              <input type="number" className="input" defaultValue={selectedIssue?.slaHours || 24} />
            </div>
          </div>

          {selectedIssue?.status === 'resolved' && (
            <div>
              <label className="label">Resolution</label>
              <textarea className="input" rows={2} defaultValue={selectedIssue?.resolution} placeholder="How was this resolved?" />
            </div>
          )}
        </form>
      </Modal>
    </div>
  )
}
