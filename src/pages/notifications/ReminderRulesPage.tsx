import { useState } from 'react'
import {
  Plus,
  Bell,
  Clock,
  Mail,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  Flag,
  Package,
  FileText,
  AlertCircle,
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import type { ReminderRule, ReminderTrigger } from '../../types'

const demoRules: ReminderRule[] = [
  {
    id: 'rule1', name: 'Milestone Due Reminder', description: 'Notify PM and Finance before milestone due date',
    isActive: true, entityType: 'milestone', trigger: 'days_before', triggerDays: 10,
    recipients: { roles: ['pm', 'finance'], specificUsers: [], projectRoles: ['pm', 'owner'] },
    channels: ['in_app', 'email'],
    escalation: { afterDays: 7, escalateTo: ['pmo'] },
    messageTemplate: 'Milestone "{entity.name}" is due in {days} days',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'rule2', name: 'Deliverable Overdue Alert', description: 'Escalate overdue deliverables to Director',
    isActive: true, entityType: 'deliverable', trigger: 'days_after', triggerDays: 3,
    recipients: { roles: [], specificUsers: [], projectRoles: ['owner', 'assignee'] },
    channels: ['in_app', 'email', 'slack'],
    escalation: { afterDays: 7, escalateTo: ['admin'] },
    messageTemplate: 'Deliverable "{entity.name}" is {days} days overdue',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'rule3', name: 'PO Delivery Warning', description: 'Alert before PO expected delivery date',
    isActive: true, entityType: 'po', trigger: 'days_before', triggerDays: 5,
    recipients: { roles: ['procurement'], specificUsers: [], projectRoles: ['pm'] },
    channels: ['in_app', 'email'],
    messageTemplate: 'PO "{entity.code}" delivery expected in {days} days',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'rule4', name: 'Invoice Due Reminder', description: 'Remind about upcoming invoice due dates',
    isActive: true, entityType: 'invoice', trigger: 'days_before', triggerDays: 7,
    recipients: { roles: ['finance'], specificUsers: [], projectRoles: [] },
    channels: ['in_app', 'email'],
    escalation: { afterDays: 0, escalateTo: ['admin'] },
    messageTemplate: 'Invoice "{entity.code}" for ${entity.amount} is due in {days} days',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'rule5', name: 'Task Overdue Notification', description: 'Notify assignee and PM when tasks are overdue',
    isActive: false, entityType: 'task', trigger: 'days_after', triggerDays: 1,
    recipients: { roles: [], specificUsers: [], projectRoles: ['assignee', 'pm'] },
    channels: ['in_app'],
    messageTemplate: 'Task "{entity.title}" is {days} day(s) overdue',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'rule6', name: 'Issue SLA Warning', description: 'Alert when issue SLA is at risk',
    isActive: true, entityType: 'issue', trigger: 'days_before', triggerDays: 1,
    recipients: { roles: [], specificUsers: [], projectRoles: ['owner', 'assignee'] },
    channels: ['in_app', 'email', 'teams'],
    escalation: { afterDays: 0, escalateTo: ['pm'] },
    messageTemplate: 'Issue "{entity.code}" SLA deadline is in {days} day(s)',
    createdAt: new Date(), updatedAt: new Date(),
  },
]

const entityTypeConfig = {
  milestone: { label: 'Milestones', icon: Flag, color: 'text-primary-500' },
  deliverable: { label: 'Deliverables', icon: Package, color: 'text-success-500' },
  po: { label: 'Purchase Orders', icon: FileText, color: 'text-warning-500' },
  invoice: { label: 'Invoices', icon: FileText, color: 'text-purple-500' },
  task: { label: 'Tasks', icon: Clock, color: 'text-gray-500' },
  issue: { label: 'Issues', icon: AlertCircle, color: 'text-danger-500' },
}

const channelIcons = {
  in_app: Bell,
  email: Mail,
  slack: MessageSquare,
  teams: MessageSquare,
}

export default function ReminderRulesPage() {
  const [rules, setRules] = useState<ReminderRule[]>(demoRules)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRule, setSelectedRule] = useState<ReminderRule | null>(null)

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    )
  }

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminder Rules</h1>
          <p className="text-gray-600 mt-1">
            Configure automatic reminders and escalation rules
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Rules</p>
          <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-success-600">
            {rules.filter((r) => r.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">With Escalation</p>
          <p className="text-2xl font-bold text-warning-600">
            {rules.filter((r) => r.escalation).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-2xl font-bold text-gray-400">
            {rules.filter((r) => !r.isActive).length}
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const entityConfig = entityTypeConfig[rule.entityType]
          const Icon = entityConfig.icon
          return (
            <div
              key={rule.id}
              className={`card flex items-start gap-4 ${!rule.isActive ? 'opacity-60' : ''}`}
            >
              <div className={`p-2 rounded-lg bg-gray-100 ${entityConfig.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title={rule.isActive ? 'Disable' : 'Enable'}
                    >
                      {rule.isActive ? (
                        <ToggleRight className="w-6 h-6 text-success-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedRule(rule)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-gray-400 hover:text-danger-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Entity:</span>
                    <span className="font-medium">{entityConfig.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Trigger:</span>
                    <span className="font-medium">
                      {rule.triggerDays} days {rule.trigger === 'days_before' ? 'before' : 'after'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Channels:</span>
                    <div className="flex items-center gap-1">
                      {rule.channels.map((channel) => {
                        const ChannelIcon = channelIcons[channel]
                        return (
                          <span
                            key={channel}
                            className="p-1 bg-gray-100 rounded"
                            title={channel}
                          >
                            <ChannelIcon className="w-4 h-4 text-gray-500" />
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  {rule.escalation && (
                    <div className="flex items-center gap-2">
                      <span className="text-warning-600 font-medium">
                        Escalates after {rule.escalation.afterDays}d
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedRule}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedRule(null)
        }}
        title={selectedRule ? 'Edit Reminder Rule' : 'Create Reminder Rule'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedRule(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedRule ? 'Save Changes' : 'Create Rule'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div>
            <label className="label">Rule Name</label>
            <input type="text" className="input" defaultValue={selectedRule?.name} placeholder="e.g., Milestone Due Reminder" />
          </div>

          <div>
            <label className="label">Description</label>
            <input type="text" className="input" defaultValue={selectedRule?.description} placeholder="Brief description of this rule" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Entity Type</label>
              <select className="input" defaultValue={selectedRule?.entityType || 'milestone'}>
                {Object.entries(entityTypeConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Trigger</label>
              <select className="input" defaultValue={selectedRule?.trigger || 'days_before'}>
                <option value="days_before">Days Before Due Date</option>
                <option value="days_after">Days After Due Date</option>
                <option value="on_date">On Due Date</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Trigger Days</label>
            <input type="number" className="input w-32" defaultValue={selectedRule?.triggerDays || 7} min={0} />
          </div>

          <div>
            <label className="label">Notification Channels</label>
            <div className="flex items-center gap-4 mt-2">
              {['in_app', 'email', 'slack', 'teams'].map((channel) => (
                <label key={channel} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 rounded"
                    defaultChecked={selectedRule?.channels.includes(channel as 'in_app' | 'email' | 'slack' | 'teams')}
                  />
                  <span className="text-sm capitalize">{channel.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Recipients</label>
            <div className="space-y-2 mt-2">
              <div>
                <span className="text-sm text-gray-500">Project Roles:</span>
                <div className="flex items-center gap-4 mt-1">
                  {['pm', 'owner', 'assignee'].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded"
                        defaultChecked={selectedRule?.recipients.projectRoles.includes(role as 'pm' | 'owner' | 'assignee')}
                      />
                      <span className="text-sm capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Message Template</label>
            <textarea
              className="input"
              rows={2}
              defaultValue={selectedRule?.messageTemplate}
              placeholder="Use {entity.name}, {days}, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              Variables: {'{entity.name}'}, {'{entity.code}'}, {'{days}'}, {'{project.name}'}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={!!selectedRule?.escalation}
              />
              <span className="font-medium">Enable Escalation</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Escalate After (days)</label>
                <input type="number" className="input" defaultValue={selectedRule?.escalation?.afterDays || 7} min={0} />
              </div>
              <div>
                <label className="label">Escalate To</label>
                <select className="input" defaultValue={selectedRule?.escalation?.escalateTo[0] || 'pmo'}>
                  <option value="pmo">PMO</option>
                  <option value="admin">Admin</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
