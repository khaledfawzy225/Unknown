import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Tag,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { Task, TaskStatus, TaskPriority } from '../../types'

const demoTasks: Task[] = [
  {
    id: 't1', projectId: '1', title: 'Database schema design', description: 'Design the database schema for the ERP system',
    status: 'done', priority: 'high', assigneeId: '7', assigneeName: 'Mike Chen', reporterId: '2',
    plannedStart: new Date('2024-03-01'), plannedEnd: new Date('2024-03-15'),
    actualStart: new Date('2024-03-01'), actualEnd: new Date('2024-03-14'),
    estimatedHours: 40, actualHours: 38, dependencies: [], tags: ['database', 'design'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: true,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't2', projectId: '1', title: 'API development - Phase 1', description: 'Develop core API endpoints',
    status: 'in_progress', priority: 'high', assigneeId: '7', assigneeName: 'Mike Chen', reporterId: '2',
    plannedStart: new Date('2024-03-15'), plannedEnd: new Date('2024-04-15'),
    actualStart: new Date('2024-03-16'),
    estimatedHours: 80, actualHours: 45, dependencies: ['t1'], tags: ['api', 'backend'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: true,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't3', projectId: '1', title: 'UI mockups review', description: 'Review and approve UI mockups with client',
    status: 'blocked', priority: 'medium', assigneeId: '5', assigneeName: 'Lisa Park', reporterId: '2',
    plannedStart: new Date('2024-03-10'), plannedEnd: new Date('2024-03-20'),
    actualStart: new Date('2024-03-10'),
    estimatedHours: 16, actualHours: 8, dependencies: [], tags: ['design', 'client'],
    isRisk: true, isCustomerFacing: true, isCriticalPath: false,
    blockedBy: 'Client availability', blockReason: 'Waiting for client feedback',
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't4', projectId: '1', title: 'Integration testing setup', description: 'Set up integration testing environment',
    status: 'todo', priority: 'medium', assigneeId: '8', assigneeName: 'Tom Wilson', reporterId: '6',
    plannedStart: new Date('2024-04-01'), plannedEnd: new Date('2024-04-10'),
    estimatedHours: 24, actualHours: 0, dependencies: ['t2'], tags: ['testing', 'infrastructure'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't5', projectId: '1', title: 'User authentication module', description: 'Implement user authentication and authorization',
    status: 'in_progress', priority: 'critical', assigneeId: '7', assigneeName: 'Mike Chen', reporterId: '6',
    plannedStart: new Date('2024-03-20'), plannedEnd: new Date('2024-04-05'),
    actualStart: new Date('2024-03-20'),
    estimatedHours: 32, actualHours: 20, dependencies: ['t1'], tags: ['security', 'backend'],
    isRisk: true, isCustomerFacing: false, isCriticalPath: true,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't6', projectId: '1', title: 'Data migration planning', description: 'Plan data migration from legacy system',
    status: 'backlog', priority: 'low', assigneeId: '5', assigneeName: 'Lisa Park', reporterId: '2',
    plannedStart: new Date('2024-05-01'), plannedEnd: new Date('2024-05-15'),
    estimatedHours: 40, actualHours: 0, dependencies: [], tags: ['migration', 'planning'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
]

const statusConfig: Record<TaskStatus, { label: string; type: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  backlog: { label: 'Backlog', type: 'default' },
  todo: { label: 'To Do', type: 'info' },
  in_progress: { label: 'In Progress', type: 'warning' },
  blocked: { label: 'Blocked', type: 'danger' },
  review: { label: 'Review', type: 'info' },
  done: { label: 'Done', type: 'success' },
}

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-warning-500' },
  high: { label: 'High', color: 'text-orange-500' },
  critical: { label: 'Critical', color: 'text-danger-500' },
}

export default function TasksPage() {
  const { projectId } = useParams()
  const [tasks] = useState<Task[]>(demoTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const columns = [
    {
      key: 'title',
      header: 'Task',
      render: (task: Task) => (
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{task.title}</p>
              {task.isCriticalPath && (
                <span className="text-xs bg-danger-100 text-danger-600 px-1.5 py-0.5 rounded">
                  Critical
                </span>
              )}
              {task.isCustomerFacing && (
                <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">
                  Customer
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => {
        const config = statusConfig[task.status]
        return (
          <StatusBadge status={config.type} size="sm">
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (task: Task) => {
        const config = priorityConfig[task.priority]
        return (
          <span className={`font-medium ${config.color}`}>
            {config.label}
          </span>
        )
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (task: Task) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm">{task.assigneeName}</span>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Due Date',
      render: (task: Task) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {format(new Date(task.plannedEnd), 'MMM d')}
        </div>
      ),
    },
    {
      key: 'hours',
      header: 'Hours',
      render: (task: Task) => (
        <div className="text-sm">
          <span className="font-medium">{task.actualHours}</span>
          <span className="text-gray-500"> / {task.estimatedHours}h</span>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (task: Task) => (
        <div className="flex items-center gap-1 flex-wrap">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (task: Task) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsMenu(showActionsMenu === task.id ? null : task.id)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActionsMenu === task.id && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  setSelectedTask(task)
                  setShowActionsMenu(null)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
      className: 'w-12',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage project tasks and assignments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'text-gray-900' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-warning-600' },
          { label: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length, color: 'text-danger-600' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, color: 'text-success-600' },
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
              placeholder="Search tasks..."
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

      {/* Blocked Tasks Alert */}
      {tasks.filter(t => t.status === 'blocked').length > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-danger-700">
                {tasks.filter(t => t.status === 'blocked').length} tasks are blocked
              </h4>
              <p className="text-sm text-danger-600 mt-1">
                Review blocked tasks and resolve blockers to keep the project on track.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        keyExtractor={(task) => task.id}
        onRowClick={(task) => setSelectedTask(task)}
        emptyMessage="No tasks found"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedTask}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedTask(null)
        }}
        title={selectedTask ? 'Edit Task' : 'Create Task'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedTask(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedTask ? 'Save Changes' : 'Create Task'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              defaultValue={selectedTask?.title}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              defaultValue={selectedTask?.description}
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select className="input" defaultValue={selectedTask?.status || 'backlog'}>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" defaultValue={selectedTask?.priority || 'medium'}>
                {Object.entries(priorityConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Assignee</label>
              <select className="input" defaultValue={selectedTask?.assigneeId}>
                <option value="">Select assignee</option>
                <option value="7">Mike Chen</option>
                <option value="5">Lisa Park</option>
                <option value="8">Tom Wilson</option>
                <option value="6">Sarah Lee</option>
              </select>
            </div>
            <div>
              <label className="label">Estimated Hours</label>
              <input
                type="number"
                className="input"
                defaultValue={selectedTask?.estimatedHours}
                placeholder="e.g., 8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input"
                defaultValue={selectedTask ? format(new Date(selectedTask.plannedStart), 'yyyy-MM-dd') : ''}
              />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                className="input"
                defaultValue={selectedTask ? format(new Date(selectedTask.plannedEnd), 'yyyy-MM-dd') : ''}
              />
            </div>
          </div>

          <div>
            <label className="label">Tags</label>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input"
                defaultValue={selectedTask?.tags.join(', ')}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedTask?.isCriticalPath}
              />
              <span className="text-sm">Critical Path</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedTask?.isCustomerFacing}
              />
              <span className="text-sm">Customer Facing</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedTask?.isRisk}
              />
              <span className="text-sm">Risk Flag</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  )
}
