import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Bell, Check, CheckCheck, Flag, AlertTriangle, Package, FileText } from 'lucide-react'
import { useNotificationStore } from '../../stores/notificationStore'
import type { NotificationType } from '../../types'

interface NotificationDropdownProps {
  onClose: () => void
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  milestone_upcoming: <Flag className="w-4 h-4 text-primary-500" />,
  milestone_overdue: <Flag className="w-4 h-4 text-danger-500" />,
  deliverable_due: <Package className="w-4 h-4 text-warning-500" />,
  po_delivery_date: <FileText className="w-4 h-4 text-primary-500" />,
  invoice_due: <FileText className="w-4 h-4 text-warning-500" />,
  task_assigned: <Check className="w-4 h-4 text-primary-500" />,
  task_overdue: <AlertTriangle className="w-4 h-4 text-danger-500" />,
  issue_escalated: <AlertTriangle className="w-4 h-4 text-danger-500" />,
  change_request_approval: <FileText className="w-4 h-4 text-primary-500" />,
  risk_review: <AlertTriangle className="w-4 h-4 text-warning-500" />,
  general: <Bell className="w-4 h-4 text-gray-500" />,
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const navigate = useNavigate()
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()

  const recentNotifications = notifications.filter((n) => !n.isArchived).slice(0, 5)

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
    onClose()
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={() => markAllAsRead()}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {notificationIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        !notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <span className="w-2 h-2 bg-primary-500 rounded-full block" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => {
            navigate('/notifications')
            onClose()
          }}
          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}
