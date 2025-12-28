import { useState } from 'react'
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Database,
  Key,
  Shield,
  Save,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'integrations'>('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Database },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <button className="btn btn-secondary btn-sm mb-2">Change Photo</button>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input type="text" className="input" defaultValue={user?.firstName} />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input type="text" className="input" defaultValue={user?.lastName} />
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" defaultValue={user?.email} />
                </div>

                <div>
                  <label className="label">Department</label>
                  <input type="text" className="input" defaultValue={user?.department} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Language</label>
                    <select className="input">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Timezone</label>
                    <select className="input">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="btn btn-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Milestone reminders', description: 'Get notified before milestones are due' },
                      { label: 'Task assignments', description: 'When you are assigned to a task' },
                      { label: 'Issue escalations', description: 'When issues are escalated' },
                      { label: 'Change request approvals', description: 'When your approval is needed' },
                      { label: 'Weekly digest', description: 'Summary of project activities' },
                    ].map((item, index) => (
                      <label key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" defaultChecked />
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">In-App Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Desktop notifications', description: 'Show browser notifications' },
                      { label: 'Sound alerts', description: 'Play sound for important notifications' },
                    ].map((item, index) => (
                      <label key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" defaultChecked={index === 0} />
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="btn btn-primary">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                <form className="space-y-4">
                  <div>
                    <label className="label">Current Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input type="password" className="input" />
                  </div>
                  <button className="btn btn-primary">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </form>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">2FA is not enabled</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="btn btn-primary">Enable 2FA</button>
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Sessions</h2>
                <div className="space-y-3">
                  {[
                    { device: 'Windows PC - Chrome', location: 'New York, US', current: true },
                    { device: 'MacBook Pro - Safari', location: 'Los Angeles, US', current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.device}
                          {session.current && <span className="ml-2 text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded">Current</span>}
                        </p>
                        <p className="text-sm text-gray-500">{session.location}</p>
                      </div>
                      {!session.current && (
                        <button className="text-sm text-danger-600 hover:text-danger-700">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>

              <div className="space-y-4">
                {[
                  { name: 'Google Workspace', description: 'Sync calendar and emails', connected: true, icon: Globe },
                  { name: 'Microsoft 365', description: 'Outlook and Teams integration', connected: false, icon: Globe },
                  { name: 'Slack', description: 'Send notifications to Slack', connected: true, icon: Globe },
                  { name: 'Jira', description: 'Sync tasks and issues', connected: false, icon: Database },
                  { name: 'Azure AD', description: 'Single Sign-On (SSO)', connected: false, icon: Key },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <integration.icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{integration.name}</p>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-success-600 font-medium">Connected</span>
                        <button className="text-sm text-gray-500 hover:text-gray-700">Disconnect</button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary btn-sm">Connect</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">API Access</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate API keys for programmatic access to ProjectForge
                </p>
                <button className="btn btn-secondary btn-sm">
                  <Key className="w-4 h-4" />
                  Generate API Key
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
