import { useState } from 'react'
import { format } from 'date-fns'
import {
  Bell,
  CheckCheck,
  Trash2,
  Archive,
  Filter,
  Flag,
  AlertTriangle,
  Package,
  FileText,
  Clock,
  Check,
} from 'lucide-react'
import type { Notification, NotificationType } from '../../types'

const demoNotifications: Notification[] = [
  {
    id: 'n1', userId: '1', type: 'milestone_upcoming', title: 'Milestone Due Soon',
    message: 'UAT Sign-off milestone is due in 3 days for ERP Implementation project',
    projectId: '1', entityType: 'milestone', entityId: 'm5',
    isRead: false, isArchived: false, actionUrl: '/projects/1/milestones',
    createdAt: new Date('2024-01-15T09:00:00'),
  },
  {
    id: 'n2', userId: '1', type: 'task_assigned', title: 'New Task Assigned',
    message: 'You have been assigned to "API Documentation" task',
    projectId: '1', entityType: 'task', entityId: 't7',
    isRead: false, isArchived: false, actionUrl: '/projects/1/tasks',
    createdAt: new Date('2024-01-15T08:30:00'),
  },
  {
    id: 'n3', userId: '1', type: 'issue_escalated', title: 'Issue Escalated',
    message: 'Issue ISS-004 "User session expiring" has been escalated to Director level',
    projectId: '1', entityType: 'issue', entityId: 'i4',
    isRead: false, isArchived: false, actionUrl: '/projects/1/issues',
    createdAt: new Date('2024-01-14T16:00:00'),
  },
  {
    id: 'n4', userId: '1', type: 'change_request_approval', title: 'Change Request Pending',
    message: 'CR-002 "Integrate with CRM system" requires your approval',
    projectId: '1', entityType: 'change_request', entityId: 'cr2',
    isRead: true, isArchived: false, actionUrl: '/projects/1/changes',
    createdAt: new Date('2024-01-14T14:00:00'),
  },
  {
    id: 'n5', userId: '1', type: 'po_delivery_date', title: 'PO Delivery Alert',
    message: 'PO-2024-015 "Server Hardware" delivery is due in 5 days',
    projectId: '2', entityType: 'po', entityId: 'po-15',
    isRead: true, isArchived: false, actionUrl: '/projects/2/po',
    createdAt: new Date('2024-01-14T10:00:00'),
  },
  {
    id: 'n6', userId: '1', type: 'deliverable_due', title: 'Deliverable Due',
    message: 'API Documentation deliverable is due tomorrow',
    projectId: '1', entityType: 'deliverable', entityId: 'd7',
    isRead: true, isArchived: false, actionUrl: '/projects/1/deliverables',
    createdAt: new Date('2024-01-13T09:00:00'),
  },
  {
    id: 'n7', userId: '1', type: 'risk_review', title: 'Risk Review Required',
    message: 'RSK-001 "Vendor resource availability" is due for review',
    projectId: '1', entityType: 'risk', entityId: 'r1',
    isRead: true, isArchived: false, actionUrl: '/projects/1/risks',
    createdAt: new Date('2024-01-12T11:00:00'),
  },
  {
    id: 'n8', userId: '1', type: 'milestone_overdue', title: 'Milestone Overdue',
    message: 'Development Phase 1 Complete milestone is 5 days overdue',
    projectId: '1', entityType: 'milestone', entityId: 'm4',
    isRead: true, isArchived: false, actionUrl: '/projects/1/milestones',
    createdAt: new Date('2024-01-10T08:00:00'),
  },
]

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  milestone_upcoming: { icon: Flag, color: 'text-primary-500 bg-primary-50' },
  milestone_overdue: { icon: Flag, color: 'text-danger-500 bg-danger-50' },
  deliverable_due: { icon: Package, color: 'text-warning-500 bg-warning-50' },
  po_delivery_date: { icon: FileText, color: 'text-primary-500 bg-primary-50' },
  invoice_due: { icon: FileText, color: 'text-warning-500 bg-warning-50' },
  task_assigned: { icon: Check, color: 'text-primary-500 bg-primary-50' },
  task_overdue: { icon: AlertTriangle, color: 'text-danger-500 bg-danger-50' },
  issue_escalated: { icon: AlertTriangle, color: 'text-danger-500 bg-danger-50' },
  change_request_approval: { icon: FileText, color: 'text-primary-500 bg-primary-50' },
  risk_review: { icon: AlertTriangle, color: 'text-warning-500 bg-warning-50' },
  general: { icon: Bell, color: 'text-gray-500 bg-gray-100' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const filteredNotifications = notifications.filter((n) => {
    if (n.isArchived) return false
    if (showUnreadOnly && n.isRead) return false
    if (typeFilter && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt || new Date() }))
    )
  }

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: true } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="btn btn-secondary"
          disabled={unreadCount === 0}
        >
          <CheckCheck className="w-5 h-5" />
          Mark All Read
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-48"
            >
              <option value="">All Types</option>
              <option value="milestone_upcoming">Milestone Upcoming</option>
              <option value="milestone_overdue">Milestone Overdue</option>
              <option value="deliverable_due">Deliverable Due</option>
              <option value="task_assigned">Task Assigned</option>
              <option value="issue_escalated">Issue Escalated</option>
              <option value="change_request_approval">Change Request</option>
              <option value="risk_review">Risk Review</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm">Show unread only</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon
            return (
              <div
                key={notification.id}
                className={`card p-4 flex items-start gap-4 transition-colors ${
                  !notification.isRead ? 'bg-primary-50/50 border-primary-200' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => archiveNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-danger-600 hover:bg-gray-100 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
