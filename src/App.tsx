import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'

// Dashboard pages
import PortfolioDashboard from './pages/dashboard/PortfolioDashboard'
import ProjectDashboard from './pages/dashboard/ProjectDashboard'

// User & Security pages
import UsersPage from './pages/users/UsersPage'
import RolesPage from './pages/users/RolesPage'
import AuditLogPage from './pages/users/AuditLogPage'

// Project pages
import ProjectsPage from './pages/projects/ProjectsPage'
import ProjectSetupPage from './pages/projects/ProjectSetupPage'
import TasksPage from './pages/projects/TasksPage'
import KanbanPage from './pages/projects/KanbanPage'

// Risks & Issues pages
import RisksPage from './pages/risks/RisksPage'
import IssuesPage from './pages/risks/IssuesPage'
import ChangeRequestsPage from './pages/risks/ChangeRequestsPage'

// Milestones & Deliverables pages
import MilestonesPage from './pages/milestones/MilestonesPage'
import DeliverablesPage from './pages/milestones/DeliverablesPage'
import CalendarPage from './pages/milestones/CalendarPage'

// Notifications & Reminders
import NotificationsPage from './pages/notifications/NotificationsPage'
import ReminderRulesPage from './pages/notifications/ReminderRulesPage'

// Settings
import SettingsPage from './pages/settings/SettingsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<PortfolioDashboard />} />
        <Route path="/projects/:projectId/dashboard" element={<ProjectDashboard />} />

        {/* Users & Security */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProjectSetupPage />} />
        <Route path="/projects/:projectId/setup" element={<ProjectSetupPage />} />
        <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
        <Route path="/projects/:projectId/kanban" element={<KanbanPage />} />

        {/* Risks, Issues & Changes */}
        <Route path="/projects/:projectId/risks" element={<RisksPage />} />
        <Route path="/projects/:projectId/issues" element={<IssuesPage />} />
        <Route path="/projects/:projectId/changes" element={<ChangeRequestsPage />} />

        {/* Milestones & Deliverables */}
        <Route path="/projects/:projectId/milestones" element={<MilestonesPage />} />
        <Route path="/projects/:projectId/deliverables" element={<DeliverablesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reminder-rules" element={<ReminderRulesPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
