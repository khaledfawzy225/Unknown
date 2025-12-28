import { Outlet, Navigate } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <FolderKanban className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">ProjectForge</h1>
          <p className="text-primary-200 mt-2">Enterprise IT Project Management</p>
        </div>

        {/* Auth Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-primary-200 text-sm mt-6">
          &copy; {new Date().getFullYear()} ProjectForge. Portfolio control, operational tracking, and intelligent reminders.
        </p>
      </div>
    </div>
  )
}
