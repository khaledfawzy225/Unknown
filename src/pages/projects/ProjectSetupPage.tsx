import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react'
import type { WBSItem } from '../../types'

const demoWBS: WBSItem[] = [
  {
    id: 'wbs-1', projectId: '1', code: '1.0', name: 'Project Initiation', description: 'Initial project setup',
    level: 1, type: 'phase', owner: 'John Smith', ownerId: '2',
    plannedStart: new Date('2024-01-01'), plannedEnd: new Date('2024-01-31'),
    baselineStart: new Date('2024-01-01'), baselineEnd: new Date('2024-01-31'),
    baselineBudget: 25000, currentBudget: 25000, actualCost: 22000,
    percentComplete: 100, status: 'completed',
    children: [
      {
        id: 'wbs-1-1', projectId: '1', parentId: 'wbs-1', code: '1.1', name: 'Project Charter', description: '',
        level: 2, type: 'deliverable', owner: 'John Smith', ownerId: '2',
        plannedStart: new Date('2024-01-01'), plannedEnd: new Date('2024-01-15'),
        baselineStart: new Date('2024-01-01'), baselineEnd: new Date('2024-01-15'),
        baselineBudget: 10000, currentBudget: 10000, actualCost: 8000,
        percentComplete: 100, status: 'completed',
      },
      {
        id: 'wbs-1-2', projectId: '1', parentId: 'wbs-1', code: '1.2', name: 'Stakeholder Analysis', description: '',
        level: 2, type: 'deliverable', owner: 'John Smith', ownerId: '2',
        plannedStart: new Date('2024-01-10'), plannedEnd: new Date('2024-01-25'),
        baselineStart: new Date('2024-01-10'), baselineEnd: new Date('2024-01-25'),
        baselineBudget: 15000, currentBudget: 15000, actualCost: 14000,
        percentComplete: 100, status: 'completed',
      },
    ],
  },
  {
    id: 'wbs-2', projectId: '1', code: '2.0', name: 'Requirements', description: 'Requirements gathering and analysis',
    level: 1, type: 'phase', owner: 'Lisa Park', ownerId: '5',
    plannedStart: new Date('2024-02-01'), plannedEnd: new Date('2024-02-28'),
    baselineStart: new Date('2024-02-01'), baselineEnd: new Date('2024-02-28'),
    baselineBudget: 50000, currentBudget: 55000, actualCost: 52000,
    percentComplete: 100, status: 'completed',
    children: [
      {
        id: 'wbs-2-1', projectId: '1', parentId: 'wbs-2', code: '2.1', name: 'Business Requirements', description: '',
        level: 2, type: 'deliverable', owner: 'Lisa Park', ownerId: '5',
        plannedStart: new Date('2024-02-01'), plannedEnd: new Date('2024-02-15'),
        baselineStart: new Date('2024-02-01'), baselineEnd: new Date('2024-02-15'),
        baselineBudget: 25000, currentBudget: 28000, actualCost: 26000,
        percentComplete: 100, status: 'completed',
      },
    ],
  },
  {
    id: 'wbs-3', projectId: '1', code: '3.0', name: 'Design', description: 'System design and architecture',
    level: 1, type: 'phase', owner: 'Sarah Lee', ownerId: '6',
    plannedStart: new Date('2024-03-01'), plannedEnd: new Date('2024-04-30'),
    baselineStart: new Date('2024-03-01'), baselineEnd: new Date('2024-04-30'),
    baselineBudget: 75000, currentBudget: 75000, actualCost: 70000,
    percentComplete: 100, status: 'completed',
  },
  {
    id: 'wbs-4', projectId: '1', code: '4.0', name: 'Development', description: 'System development and coding',
    level: 1, type: 'phase', owner: 'Mike Chen', ownerId: '7',
    plannedStart: new Date('2024-04-01'), plannedEnd: new Date('2024-08-31'),
    baselineStart: new Date('2024-04-01'), baselineEnd: new Date('2024-08-31'),
    baselineBudget: 200000, currentBudget: 210000, actualCost: 120000,
    percentComplete: 60, status: 'in_progress',
  },
]

export default function ProjectSetupPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const isNew = !projectId || projectId === 'new'

  const [activeTab, setActiveTab] = useState<'details' | 'wbs' | 'team' | 'settings'>('details')
  const [expandedWBS, setExpandedWBS] = useState<string[]>(['wbs-1', 'wbs-2'])
  const [wbsItems] = useState<WBSItem[]>(demoWBS)

  const toggleWBSExpand = (id: string) => {
    setExpandedWBS((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const renderWBSItem = (item: WBSItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedWBS.includes(item.id)

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 py-3 px-4 hover:bg-gray-50 border-b border-gray-100 ${
            level > 0 ? 'bg-gray-50/50' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleWBSExpand(item.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <span className="text-sm font-mono text-gray-500 w-12">{item.code}</span>
          <span className="flex-1 font-medium text-gray-900">{item.name}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            item.type === 'phase' ? 'bg-primary-50 text-primary-600' :
            item.type === 'deliverable' ? 'bg-success-50 text-success-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {item.type}
          </span>
          <span className="text-sm text-gray-500 w-24">{item.owner}</span>
          <span className="text-sm font-medium w-20 text-right">
            ${(item.currentBudget / 1000).toFixed(0)}K
          </span>
          <span className={`text-sm font-medium w-16 text-right ${
            item.status === 'completed' ? 'text-success-600' :
            item.status === 'in_progress' ? 'text-primary-600' :
            'text-gray-500'
          }`}>
            {item.percentComplete}%
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-danger-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && item.children?.map((child) => renderWBSItem(child, level + 1))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'New Project' : 'Project Setup'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isNew ? 'Create a new project' : 'Configure project details and structure'}
            </p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {[
            { id: 'details', label: 'Project Details', icon: Calendar },
            { id: 'wbs', label: 'WBS Structure', icon: FolderTree },
            { id: 'team', label: 'Team & Roles', icon: Users },
            { id: 'settings', label: 'Settings', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">Project Information</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Project Code</label>
                <input type="text" className="input" placeholder="e.g., P001" defaultValue={!isNew ? 'P001' : ''} />
              </div>
              <div>
                <label className="label">Project Name</label>
                <input type="text" className="input" placeholder="Enter project name" defaultValue={!isNew ? 'ERP Implementation' : ''} />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Enter project description" defaultValue={!isNew ? 'Enterprise resource planning system rollout for Acme Corp' : ''} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Customer</label>
                <input type="text" className="input" defaultValue={!isNew ? 'Acme Corp' : ''} />
              </div>
              <div>
                <label className="label">Region</label>
                <select className="input" defaultValue={!isNew ? 'North America' : ''}>
                  <option value="">Select region</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                </select>
              </div>
              <div>
                <label className="label">Project Type</label>
                <select className="input" defaultValue={!isNew ? 'Implementation' : ''}>
                  <option value="">Select type</option>
                  <option value="Implementation">Implementation</option>
                  <option value="Development">Development</option>
                  <option value="Migration">Migration</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Planned Start Date</label>
                <input type="date" className="input" defaultValue={!isNew ? '2024-01-01' : ''} />
              </div>
              <div>
                <label className="label">Planned End Date</label>
                <input type="date" className="input" defaultValue={!isNew ? '2024-12-31' : ''} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">Total Budget ($)</label>
                <input type="number" className="input" defaultValue={!isNew ? '500000' : ''} />
              </div>
              <div>
                <label className="label">Project Manager</label>
                <select className="input" defaultValue={!isNew ? '2' : ''}>
                  <option value="">Select PM</option>
                  <option value="2">John Smith</option>
                  <option value="3">Sarah Johnson</option>
                  <option value="4">Emily Chen</option>
                </select>
              </div>
              <div>
                <label className="label">Stage</label>
                <select className="input" defaultValue={!isNew ? 'execution' : 'initiation'}>
                  <option value="initiation">Initiation</option>
                  <option value="planning">Planning</option>
                  <option value="execution">Execution</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="closing">Closing</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'wbs' && (
        <div className="card p-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Work Breakdown Structure</h3>
            <button className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              Add Phase
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="flex items-center gap-3 py-2 px-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                <span className="w-6" />
                <span className="w-12">Code</span>
                <span className="flex-1">Name</span>
                <span className="w-20">Type</span>
                <span className="w-24">Owner</span>
                <span className="w-20 text-right">Budget</span>
                <span className="w-16 text-right">Progress</span>
                <span className="w-16">Actions</span>
              </div>

              {/* WBS Items */}
              {wbsItems.map((item) => renderWBSItem(item))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Team Members</h3>
            <button className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'John Smith', role: 'Project Manager', email: 'john@company.com' },
              { name: 'Sarah Lee', role: 'Technical Lead', email: 'sarah@company.com' },
              { name: 'Mike Chen', role: 'Senior Developer', email: 'mike@company.com' },
              { name: 'Lisa Park', role: 'Business Analyst', email: 'lisa@company.com' },
              { name: 'Tom Wilson', role: 'QA Lead', email: 'tom@company.com' },
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select className="input w-40" defaultValue={member.role}>
                    <option>Project Manager</option>
                    <option>Technical Lead</option>
                    <option>Senior Developer</option>
                    <option>Business Analyst</option>
                    <option>QA Lead</option>
                  </select>
                  <button className="p-2 text-gray-400 hover:text-danger-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">Project Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Baseline Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Baseline Start Date</label>
                  <input type="date" className="input" defaultValue="2024-01-01" />
                </div>
                <div>
                  <label className="label">Baseline End Date</label>
                  <input type="date" className="input" defaultValue="2024-11-30" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Financial Settings</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Currency</label>
                  <select className="input">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="label">Cost Center</label>
                  <input type="text" className="input" defaultValue="CC001" />
                </div>
                <div>
                  <label className="label">Target Margin (%)</label>
                  <input type="number" className="input" defaultValue="15" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span>Send milestone reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span>Send budget alerts when spending exceeds 90%</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span>Notify team on task assignments</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
