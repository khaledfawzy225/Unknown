import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  AlertCircle,
  GitPullRequest,
  Flag,
  Package,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import NotificationDropdown from '../components/notifications/NotificationDropdown'

const navigation = [
  { name: 'Portfolio Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Projects',
    icon: FolderKanban,
    children: [
      { name: 'All Projects', href: '/projects' },
      { name: 'New Project', href: '/projects/new' },
    ],
  },
  {
    name: 'Users & Security',
    icon: Shield,
    children: [
      { name: 'Users', href: '/users' },
      { name: 'Roles & Permissions', href: '/roles' },
      { name: 'Audit Log', href: '/audit-log' },
    ],
  },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Reminder Rules', href: '/reminder-rules', icon: Settings },
]

const projectNavigation = [
  { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
  { name: 'Setup & WBS', href: 'setup', icon: FileText },
  { name: 'Tasks', href: 'tasks', icon: FolderKanban },
  { name: 'Kanban Board', href: 'kanban', icon: FolderKanban },
  { name: 'Risks', href: 'risks', icon: AlertTriangle },
  { name: 'Issues', href: 'issues', icon: AlertCircle },
  { name: 'Change Requests', href: 'changes', icon: GitPullRequest },
  { name: 'Milestones', href: 'milestones', icon: Flag },
  { name: 'Deliverables', href: 'deliverables', icon: Package },
]

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">ProjectForge</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedItems.includes(item.name) && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.href}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Project Context Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Project Navigation
            </h3>
            <ul className="space-y-1">
              {projectNavigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={`/projects/demo/${item.href}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Menu */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden sm:flex items-center w-96 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, tasks, issues..."
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {/* Settings */}
              <NavLink
                to="/settings"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
