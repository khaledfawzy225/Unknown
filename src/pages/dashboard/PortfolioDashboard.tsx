import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  FolderKanban,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Filter,
  Search,
  ArrowRight,
  Flag,
  FileText,
  AlertCircle,
} from 'lucide-react'
import KPICard from '../../components/ui/KPICard'
import { RAGIndicator } from '../../components/ui/StatusBadge'
import ProgressBar from '../../components/ui/ProgressBar'
import type { Project } from '../../types'

// Demo data
const demoProjects: Project[] = [
  {
    id: '1',
    code: 'P001',
    name: 'ERP Implementation',
    description: 'Enterprise resource planning system rollout',
    customer: 'Acme Corp',
    region: 'North America',
    type: 'Implementation',
    stage: 'execution',
    status: 'active',
    ragStatus: 'amber',
    projectManager: 'John Smith',
    pmId: '2',
    team: ['2', '5', '6'],
    plannedStartDate: new Date('2024-01-01'),
    plannedEndDate: new Date('2024-12-31'),
    baselineStartDate: new Date('2024-01-01'),
    baselineEndDate: new Date('2024-11-30'),
    budget: 500000,
    actualCost: 280000,
    committed: 150000,
    forecast: 520000,
    margin: 15,
    percentComplete: 56,
    spiValue: 0.92,
    cpiValue: 0.96,
    openRisks: 5,
    openIssues: 3,
    pendingChanges: 2,
    variationOrders: 1,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    code: 'P002',
    name: 'Cloud Migration',
    description: 'AWS cloud infrastructure migration',
    customer: 'TechStart Inc',
    region: 'Europe',
    type: 'Migration',
    stage: 'execution',
    status: 'active',
    ragStatus: 'green',
    projectManager: 'Sarah Johnson',
    pmId: '3',
    team: ['3', '7'],
    plannedStartDate: new Date('2024-02-01'),
    plannedEndDate: new Date('2024-08-31'),
    baselineStartDate: new Date('2024-02-01'),
    baselineEndDate: new Date('2024-08-31'),
    budget: 300000,
    actualCost: 120000,
    committed: 80000,
    forecast: 290000,
    margin: 20,
    percentComplete: 45,
    spiValue: 1.05,
    cpiValue: 1.02,
    openRisks: 2,
    openIssues: 1,
    pendingChanges: 0,
    variationOrders: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    code: 'P003',
    name: 'Security Audit & Remediation',
    description: 'Comprehensive security assessment and fixes',
    customer: 'FinanceHub',
    region: 'Asia Pacific',
    type: 'Consulting',
    stage: 'monitoring',
    status: 'active',
    ragStatus: 'red',
    projectManager: 'John Smith',
    pmId: '2',
    team: ['2', '8'],
    plannedStartDate: new Date('2023-10-01'),
    plannedEndDate: new Date('2024-03-31'),
    baselineStartDate: new Date('2023-10-01'),
    baselineEndDate: new Date('2024-02-28'),
    budget: 150000,
    actualCost: 140000,
    committed: 20000,
    forecast: 175000,
    margin: -5,
    percentComplete: 85,
    spiValue: 0.78,
    cpiValue: 0.85,
    openRisks: 8,
    openIssues: 6,
    pendingChanges: 3,
    variationOrders: 2,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    code: 'P004',
    name: 'Mobile App Development',
    description: 'Customer-facing mobile application',
    customer: 'RetailMax',
    region: 'North America',
    type: 'Development',
    stage: 'planning',
    status: 'active',
    ragStatus: 'green',
    projectManager: 'Emily Chen',
    pmId: '4',
    team: ['4', '9', '10'],
    plannedStartDate: new Date('2024-02-15'),
    plannedEndDate: new Date('2024-10-31'),
    baselineStartDate: new Date('2024-02-15'),
    baselineEndDate: new Date('2024-10-31'),
    budget: 400000,
    actualCost: 15000,
    committed: 50000,
    forecast: 400000,
    margin: 22,
    percentComplete: 5,
    spiValue: 1.0,
    cpiValue: 1.0,
    openRisks: 3,
    openIssues: 0,
    pendingChanges: 0,
    variationOrders: 0,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
]

const upcomingMilestones = [
  { id: '1', name: 'UAT Sign-off', project: 'ERP Implementation', dueDate: new Date('2024-02-15'), status: 'on_track' },
  { id: '2', name: 'Phase 2 Go-Live', project: 'Cloud Migration', dueDate: new Date('2024-02-20'), status: 'on_track' },
  { id: '3', name: 'Final Security Report', project: 'Security Audit', dueDate: new Date('2024-02-01'), status: 'at_risk' },
  { id: '4', name: 'Design Approval', project: 'Mobile App', dueDate: new Date('2024-02-28'), status: 'on_track' },
]

const delayedTasks = [
  { id: '1', name: 'Database optimization', project: 'ERP Implementation', daysOverdue: 5 },
  { id: '2', name: 'Penetration testing', project: 'Security Audit', daysOverdue: 12 },
  { id: '3', name: 'Vendor integration', project: 'ERP Implementation', daysOverdue: 3 },
]

const atRiskPOs = [
  { id: 'PO-2024-015', description: 'Server Hardware', project: 'Cloud Migration', amount: 45000, dueDate: new Date('2024-02-10') },
  { id: 'PO-2024-008', description: 'Security Software Licenses', project: 'Security Audit', amount: 25000, dueDate: new Date('2024-02-05') },
]

export default function PortfolioDashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const filteredProjects = demoProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !regionFilter || project.region === regionFilter
    const matchesStage = !stageFilter || project.stage === stageFilter
    return matchesSearch && matchesRegion && matchesStage
  })

  const totalBudget = demoProjects.reduce((sum, p) => sum + p.budget, 0)
  const totalActual = demoProjects.reduce((sum, p) => sum + p.actualCost, 0)
  const avgCompletion = Math.round(demoProjects.reduce((sum, p) => sum + p.percentComplete, 0) / demoProjects.length)
  const totalRisks = demoProjects.reduce((sum, p) => sum + p.openRisks, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of all active projects and key metrics
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Projects"
          value={demoProjects.filter((p) => p.status === 'active').length}
          subtitle={`${demoProjects.filter((p) => p.ragStatus === 'green').length} on track`}
          icon={<FolderKanban className="w-6 h-6" />}
          status="good"
          trend="up"
          trendValue="2 new"
        />
        <KPICard
          title="Avg. Completion"
          value={`${avgCompletion}%`}
          subtitle="Across all projects"
          icon={<TrendingUp className="w-6 h-6" />}
          status="good"
          trend="up"
          trendValue="5%"
        />
        <KPICard
          title="Total Budget"
          value={`$${(totalBudget / 1000000).toFixed(2)}M`}
          subtitle={`$${(totalActual / 1000000).toFixed(2)}M spent`}
          icon={<DollarSign className="w-6 h-6" />}
          status="warning"
          trend="stable"
          trendValue="0%"
        />
        <KPICard
          title="Open Risks"
          value={totalRisks}
          subtitle={`${demoProjects.filter((p) => p.openRisks > 5).length} projects high risk`}
          icon={<AlertTriangle className="w-6 h-6" />}
          status="warning"
          trend="down"
          trendValue="3 closed"
        />
      </div>

      {/* Filters */}
      <div className="card">
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
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="input w-36"
            >
              <option value="">All Stages</option>
              <option value="initiation">Initiation</option>
              <option value="planning">Planning</option>
              <option value="execution">Execution</option>
              <option value="monitoring">Monitoring</option>
              <option value="closing">Closing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}/dashboard`)}
            className="card hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <RAGIndicator status={project.ragStatus} />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.code} • {project.customer}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <ProgressBar value={project.percentComplete} size="sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <ProgressBar
                  value={project.actualCost}
                  max={project.budget}
                  size="sm"
                  color={project.actualCost > project.budget * 0.9 ? 'danger' : 'primary'}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">SPI</p>
                <p className={`font-semibold ${project.spiValue >= 1 ? 'text-success-600' : 'text-danger-600'}`}>
                  {project.spiValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CPI</p>
                <p className={`font-semibold ${project.cpiValue >= 1 ? 'text-success-600' : 'text-danger-600'}`}>
                  {project.cpiValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Risks</p>
                <p className={`font-semibold ${project.openRisks > 5 ? 'text-danger-600' : 'text-gray-900'}`}>
                  {project.openRisks}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Issues</p>
                <p className={`font-semibold ${project.openIssues > 3 ? 'text-warning-600' : 'text-gray-900'}`}>
                  {project.openIssues}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Widget Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Milestones */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary-500" />
              Upcoming Milestones
            </h3>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <ul className="space-y-3">
            {upcomingMilestones.map((milestone) => (
              <li key={milestone.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{milestone.name}</p>
                  <p className="text-xs text-gray-500">{milestone.project}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{format(milestone.dueDate, 'MMM d')}</p>
                  <span className={`text-xs ${milestone.status === 'at_risk' ? 'text-danger-600' : 'text-success-600'}`}>
                    {milestone.status === 'at_risk' ? 'At Risk' : 'On Track'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Delayed Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-danger-500" />
              Delayed Tasks
            </h3>
            <span className="badge badge-danger">{delayedTasks.length}</span>
          </div>
          <ul className="space-y-3">
            {delayedTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{task.name}</p>
                  <p className="text-xs text-gray-500">{task.project}</p>
                </div>
                <span className="text-sm font-medium text-danger-600">
                  {task.daysOverdue}d overdue
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* POs at Risk */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-warning-500" />
              POs at Risk
            </h3>
            <span className="badge badge-warning">{atRiskPOs.length}</span>
          </div>
          <ul className="space-y-3">
            {atRiskPOs.map((po) => (
              <li key={po.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{po.description}</p>
                  <p className="text-xs text-gray-500">{po.id} • {po.project}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${po.amount.toLocaleString()}</p>
                  <p className="text-xs text-warning-600">Due {format(po.dueDate, 'MMM d')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
