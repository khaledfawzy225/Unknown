import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Plus,
  MoreVertical,
  Clock,
  User,
  AlertTriangle,
  Flag,
} from 'lucide-react'
import type { Task, TaskStatus } from '../../types'

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
    id: 't2', projectId: '1', title: 'API development - Phase 1', description: 'Develop core API endpoints for user management and authentication',
    status: 'in_progress', priority: 'high', assigneeId: '7', assigneeName: 'Mike Chen', reporterId: '2',
    plannedStart: new Date('2024-03-15'), plannedEnd: new Date('2024-04-15'),
    actualStart: new Date('2024-03-16'),
    estimatedHours: 80, actualHours: 45, dependencies: ['t1'], tags: ['api', 'backend'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: true,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't3', projectId: '1', title: 'UI mockups review', description: 'Review and approve UI mockups with client stakeholders',
    status: 'blocked', priority: 'medium', assigneeId: '5', assigneeName: 'Lisa Park', reporterId: '2',
    plannedStart: new Date('2024-03-10'), plannedEnd: new Date('2024-03-20'),
    actualStart: new Date('2024-03-10'),
    estimatedHours: 16, actualHours: 8, dependencies: [], tags: ['design', 'client'],
    isRisk: true, isCustomerFacing: true, isCriticalPath: false,
    blockedBy: 'Client availability', blockReason: 'Waiting for client feedback on design proposals',
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't4', projectId: '1', title: 'Integration testing setup', description: 'Set up integration testing environment and CI/CD pipeline',
    status: 'backlog', priority: 'medium', assigneeId: '8', assigneeName: 'Tom Wilson', reporterId: '6',
    plannedStart: new Date('2024-04-01'), plannedEnd: new Date('2024-04-10'),
    estimatedHours: 24, actualHours: 0, dependencies: ['t2'], tags: ['testing', 'infrastructure'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't5', projectId: '1', title: 'User authentication module', description: 'Implement user authentication and role-based authorization',
    status: 'in_progress', priority: 'critical', assigneeId: '7', assigneeName: 'Mike Chen', reporterId: '6',
    plannedStart: new Date('2024-03-20'), plannedEnd: new Date('2024-04-05'),
    actualStart: new Date('2024-03-20'),
    estimatedHours: 32, actualHours: 20, dependencies: ['t1'], tags: ['security', 'backend'],
    isRisk: true, isCustomerFacing: false, isCriticalPath: true,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't6', projectId: '1', title: 'Data migration planning', description: 'Plan and document data migration strategy from legacy system',
    status: 'backlog', priority: 'low', assigneeId: '5', assigneeName: 'Lisa Park', reporterId: '2',
    plannedStart: new Date('2024-05-01'), plannedEnd: new Date('2024-05-15'),
    estimatedHours: 40, actualHours: 0, dependencies: [], tags: ['migration', 'planning'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't7', projectId: '1', title: 'Frontend dashboard', description: 'Build the main dashboard UI components',
    status: 'todo', priority: 'high', assigneeId: '6', assigneeName: 'Sarah Lee', reporterId: '2',
    plannedStart: new Date('2024-04-01'), plannedEnd: new Date('2024-04-20'),
    estimatedHours: 48, actualHours: 0, dependencies: [], tags: ['frontend', 'ui'],
    isRisk: false, isCustomerFacing: true, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 't8', projectId: '1', title: 'Performance testing', description: 'Conduct load and stress testing on API endpoints',
    status: 'todo', priority: 'medium', assigneeId: '8', assigneeName: 'Tom Wilson', reporterId: '6',
    plannedStart: new Date('2024-04-15'), plannedEnd: new Date('2024-04-25'),
    estimatedHours: 32, actualHours: 0, dependencies: ['t2'], tags: ['testing', 'performance'],
    isRisk: false, isCustomerFacing: false, isCriticalPath: false,
    attachments: [], comments: [], createdAt: new Date(), updatedAt: new Date(),
  },
]

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-400' },
  { id: 'todo', title: 'To Do', color: 'bg-primary-400' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-warning-400' },
  { id: 'blocked', title: 'Blocked', color: 'bg-danger-400' },
  { id: 'done', title: 'Done', color: 'bg-success-400' },
]

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-warning-400',
  high: 'border-l-orange-400',
  critical: 'border-l-danger-500',
}

export default function KanbanPage() {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState<Task[]>(demoTasks)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggedTask ? { ...task, status } : task
        )
      )
      setDraggedTask(null)
    }
  }

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Body */}
              <div className={`bg-gray-50 rounded-lg p-2 min-h-[calc(100vh-280px)] ${
                draggedTask ? 'ring-2 ring-primary-200 ring-opacity-50' : ''
              }`}>
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-move hover:shadow-md transition-shadow border-l-4 ${priorityColors[task.priority]} ${
                        draggedTask === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {task.title}
                        </h4>
                        <button className="p-1 text-gray-400 hover:text-gray-600 -mr-1 -mt-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Task Description */}
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {task.description}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1 mb-3 flex-wrap">
                        {task.isCriticalPath && (
                          <span className="inline-flex items-center gap-1 text-xs bg-danger-50 text-danger-600 px-1.5 py-0.5 rounded">
                            <Flag className="w-3 h-3" />
                            Critical
                          </span>
                        )}
                        {task.isRisk && (
                          <span className="inline-flex items-center gap-1 text-xs bg-warning-50 text-warning-600 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Risk
                          </span>
                        )}
                        {task.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Blocked Reason */}
                      {task.status === 'blocked' && task.blockReason && (
                        <div className="bg-danger-50 text-danger-600 text-xs p-2 rounded mb-3">
                          <span className="font-medium">Blocked:</span> {task.blockReason}
                        </div>
                      )}

                      {/* Task Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {task.assigneeName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-xs text-gray-500">{task.assigneeName.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.actualHours}/{task.estimatedHours}h
                          </span>
                          <span>{format(new Date(task.plannedEnd), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
