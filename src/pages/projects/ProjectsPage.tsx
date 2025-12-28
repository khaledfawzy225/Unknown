import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  Trash2,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge, { RAGIndicator } from '../../components/ui/StatusBadge'
import ProgressBar from '../../components/ui/ProgressBar'
import type { Project, ProjectStage } from '../../types'

const demoProjects: Project[] = [
  {
    id: '1', code: 'P001', name: 'ERP Implementation', description: 'Enterprise resource planning system rollout',
    customer: 'Acme Corp', region: 'North America', type: 'Implementation', stage: 'execution', status: 'active',
    ragStatus: 'amber', projectManager: 'John Smith', pmId: '2', team: [],
    plannedStartDate: new Date('2024-01-01'), plannedEndDate: new Date('2024-12-31'),
    baselineStartDate: new Date('2024-01-01'), baselineEndDate: new Date('2024-11-30'),
    budget: 500000, actualCost: 280000, committed: 150000, forecast: 520000, margin: 15,
    percentComplete: 56, spiValue: 0.92, cpiValue: 0.96, openRisks: 5, openIssues: 3,
    pendingChanges: 2, variationOrders: 1, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', code: 'P002', name: 'Cloud Migration', description: 'AWS cloud infrastructure migration',
    customer: 'TechStart Inc', region: 'Europe', type: 'Migration', stage: 'execution', status: 'active',
    ragStatus: 'green', projectManager: 'Sarah Johnson', pmId: '3', team: [],
    plannedStartDate: new Date('2024-02-01'), plannedEndDate: new Date('2024-08-31'),
    baselineStartDate: new Date('2024-02-01'), baselineEndDate: new Date('2024-08-31'),
    budget: 300000, actualCost: 120000, committed: 80000, forecast: 290000, margin: 20,
    percentComplete: 45, spiValue: 1.05, cpiValue: 1.02, openRisks: 2, openIssues: 1,
    pendingChanges: 0, variationOrders: 0, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', code: 'P003', name: 'Security Audit & Remediation', description: 'Comprehensive security assessment',
    customer: 'FinanceHub', region: 'Asia Pacific', type: 'Consulting', stage: 'monitoring', status: 'active',
    ragStatus: 'red', projectManager: 'John Smith', pmId: '2', team: [],
    plannedStartDate: new Date('2023-10-01'), plannedEndDate: new Date('2024-03-31'),
    baselineStartDate: new Date('2023-10-01'), baselineEndDate: new Date('2024-02-28'),
    budget: 150000, actualCost: 140000, committed: 20000, forecast: 175000, margin: -5,
    percentComplete: 85, spiValue: 0.78, cpiValue: 0.85, openRisks: 8, openIssues: 6,
    pendingChanges: 3, variationOrders: 2, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '4', code: 'P004', name: 'Mobile App Development', description: 'Customer-facing mobile application',
    customer: 'RetailMax', region: 'North America', type: 'Development', stage: 'planning', status: 'active',
    ragStatus: 'green', projectManager: 'Emily Chen', pmId: '4', team: [],
    plannedStartDate: new Date('2024-02-15'), plannedEndDate: new Date('2024-10-31'),
    baselineStartDate: new Date('2024-02-15'), baselineEndDate: new Date('2024-10-31'),
    budget: 400000, actualCost: 15000, committed: 50000, forecast: 400000, margin: 22,
    percentComplete: 5, spiValue: 1.0, cpiValue: 1.0, openRisks: 3, openIssues: 0,
    pendingChanges: 0, variationOrders: 0, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '5', code: 'P005', name: 'Data Analytics Platform', description: 'Business intelligence solution',
    customer: 'DataDriven LLC', region: 'Europe', type: 'Development', stage: 'initiation', status: 'active',
    ragStatus: 'green', projectManager: 'Sarah Johnson', pmId: '3', team: [],
    plannedStartDate: new Date('2024-03-01'), plannedEndDate: new Date('2024-09-30'),
    baselineStartDate: new Date('2024-03-01'), baselineEndDate: new Date('2024-09-30'),
    budget: 250000, actualCost: 5000, committed: 0, forecast: 250000, margin: 18,
    percentComplete: 2, spiValue: 1.0, cpiValue: 1.0, openRisks: 2, openIssues: 0,
    pendingChanges: 0, variationOrders: 0, createdAt: new Date(), updatedAt: new Date(),
  },
]

const stageLabels: Record<ProjectStage, string> = {
  initiation: 'Initiation',
  planning: 'Planning',
  execution: 'Execution',
  monitoring: 'Monitoring',
  closing: 'Closing',
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)

  const filteredProjects = demoProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = !stageFilter || project.stage === stageFilter
    const matchesStatus = !statusFilter || project.status === statusFilter
    return matchesSearch && matchesStage && matchesStatus
  })

  const columns = [
    {
      key: 'project',
      header: 'Project',
      render: (project: Project) => (
        <div className="flex items-center gap-3">
          <RAGIndicator status={project.ragStatus} />
          <div>
            <p className="font-medium text-gray-900">{project.name}</p>
            <p className="text-xs text-gray-500">{project.code} • {project.customer}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'projectManager',
      header: 'PM',
      sortable: true,
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (project: Project) => (
        <StatusBadge status="info" size="sm">
          {stageLabels[project.stage]}
        </StatusBadge>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (project: Project) => (
        <div className="w-32">
          <ProgressBar value={project.percentComplete} size="sm" showPercentage />
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (project: Project) => (
        <div>
          <p className="font-medium">${(project.budget / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">
            ${(project.actualCost / 1000).toFixed(0)}K spent
          </p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Timeline',
      render: (project: Project) => (
        <div className="text-sm">
          <p>{format(new Date(project.plannedStartDate), 'MMM d')}</p>
          <p className="text-xs text-gray-500">
            to {format(new Date(project.plannedEndDate), 'MMM d, yyyy')}
          </p>
        </div>
      ),
    },
    {
      key: 'metrics',
      header: 'SPI/CPI',
      render: (project: Project) => (
        <div className="flex items-center gap-2 text-sm">
          <span className={project.spiValue >= 1 ? 'text-success-600' : 'text-danger-600'}>
            {project.spiValue.toFixed(2)}
          </span>
          <span className="text-gray-300">/</span>
          <span className={project.cpiValue >= 1 ? 'text-success-600' : 'text-danger-600'}>
            {project.cpiValue.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (project: Project) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsMenu(showActionsMenu === project.id ? null : project.id)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActionsMenu === project.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => navigate(`/projects/${project.id}/dashboard`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
                View Dashboard
              </button>
              <button
                onClick={() => navigate(`/projects/${project.id}/setup`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <hr className="my-1" />
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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
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
              placeholder="Search projects..."
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="input w-36"
            >
              <option value="">All Stages</option>
              {Object.entries(stageLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-32"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}/dashboard`)}
              className="card hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <RAGIndicator status={project.ragStatus} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.code}</p>
                  </div>
                </div>
                <StatusBadge status="info" size="sm">
                  {stageLabels[project.stage]}
                </StatusBadge>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="mb-4">
                <ProgressBar value={project.percentComplete} label="Progress" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-medium">${(project.budget / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-500">PM</p>
                  <p className="font-medium">{project.projectManager}</p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium">{format(new Date(project.plannedEndDate), 'MMM d')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredProjects}
          columns={columns}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => navigate(`/projects/${p.id}/dashboard`)}
          emptyMessage="No projects found"
        />
      )}
    </div>
  )
}
