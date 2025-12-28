import { useParams } from 'react-router-dom'
import { format, differenceInDays } from 'date-fns'
import {
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  AlertCircle,
  GitPullRequest,
  Flag,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import KPICard from '../../components/ui/KPICard'
import StatusBadge, { RAGIndicator } from '../../components/ui/StatusBadge'
import ProgressBar, { DualProgressBar } from '../../components/ui/ProgressBar'

// Demo project data (same as in PortfolioDashboard for consistency)
const demoProject = {
  id: '1',
  code: 'P001',
  name: 'ERP Implementation',
  description: 'Enterprise resource planning system rollout for Acme Corp',
  customer: 'Acme Corp',
  region: 'North America',
  type: 'Implementation',
  stage: 'execution',
  status: 'active',
  ragStatus: 'amber' as const,
  projectManager: 'John Smith',
  pmId: '2',
  team: ['2', '5', '6', '7', '8'],
  plannedStartDate: new Date('2024-01-01'),
  plannedEndDate: new Date('2024-12-31'),
  actualStartDate: new Date('2024-01-08'),
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
}

const phases = [
  { name: 'Requirements', start: '2024-01-01', end: '2024-02-28', progress: 100, status: 'completed' },
  { name: 'Design', start: '2024-02-15', end: '2024-04-30', progress: 100, status: 'completed' },
  { name: 'Development', start: '2024-04-01', end: '2024-08-31', progress: 65, status: 'in_progress' },
  { name: 'Testing', start: '2024-08-01', end: '2024-10-31', progress: 10, status: 'in_progress' },
  { name: 'Deployment', start: '2024-10-15', end: '2024-11-30', progress: 0, status: 'not_started' },
  { name: 'Hypercare', start: '2024-12-01', end: '2024-12-31', progress: 0, status: 'not_started' },
]

const upcomingMilestones = [
  { id: 'm1', name: 'Development Phase Complete', date: new Date('2024-08-31'), type: 'internal' },
  { id: 'm2', name: 'UAT Sign-off', date: new Date('2024-10-15'), type: 'contractual' },
  { id: 'm3', name: 'Go-Live', date: new Date('2024-11-30'), type: 'payment' },
]

const recentIssues = [
  { id: 'ISS-005', title: 'Database performance degradation', priority: 'high', status: 'in_progress', assignee: 'Mike Chen' },
  { id: 'ISS-004', title: 'Integration timeout errors', priority: 'medium', status: 'open', assignee: 'Sarah Lee' },
  { id: 'ISS-003', title: 'Report formatting issues', priority: 'low', status: 'resolved', assignee: 'Tom Wilson' },
]

const topRisks = [
  { id: 'RSK-003', title: 'Vendor resource availability', probability: 'high', impact: 'major', score: 16 },
  { id: 'RSK-001', title: 'Scope creep from change requests', probability: 'medium', impact: 'major', score: 12 },
  { id: 'RSK-005', title: 'Data migration complexity', probability: 'high', impact: 'moderate', score: 12 },
]

const teamMembers = [
  { name: 'John Smith', role: 'Project Manager', avatar: 'JS' },
  { name: 'Sarah Lee', role: 'Tech Lead', avatar: 'SL' },
  { name: 'Mike Chen', role: 'Developer', avatar: 'MC' },
  { name: 'Tom Wilson', role: 'QA Lead', avatar: 'TW' },
  { name: 'Lisa Park', role: 'Business Analyst', avatar: 'LP' },
]

export default function ProjectDashboard() {
  const { projectId } = useParams()
  const project = demoProject // In real app, fetch by projectId

  const daysRemaining = differenceInDays(new Date(project.plannedEndDate), new Date())
  const budgetUsedPercent = Math.round((project.actualCost / project.budget) * 100)

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <RAGIndicator status={project.ragStatus} />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <span className="text-sm text-gray-500 font-mono">{project.code}</span>
              </div>
              <p className="text-gray-600 mt-1">{project.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{project.customer}</span>
                <span>•</span>
                <span>{project.region}</span>
                <span>•</span>
                <span className="capitalize">{project.stage}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.ragStatus === 'red' ? 'danger' : project.ragStatus === 'amber' ? 'warning' : 'success'}>
              {project.ragStatus.toUpperCase()} Status
            </StatusBadge>
            <button className="btn btn-primary">Update Status</button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Progress"
          value={`${project.percentComplete}%`}
          subtitle="Overall completion"
          icon={<TrendingUp className="w-6 h-6" />}
          status={project.percentComplete >= 50 ? 'good' : 'warning'}
        />
        <KPICard
          title="Schedule (SPI)"
          value={project.spiValue.toFixed(2)}
          subtitle={project.spiValue >= 1 ? 'Ahead of schedule' : 'Behind schedule'}
          icon={project.spiValue >= 1 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          status={project.spiValue >= 1 ? 'good' : project.spiValue >= 0.9 ? 'warning' : 'critical'}
        />
        <KPICard
          title="Cost (CPI)"
          value={project.cpiValue.toFixed(2)}
          subtitle={project.cpiValue >= 1 ? 'Under budget' : 'Over budget'}
          icon={<DollarSign className="w-6 h-6" />}
          status={project.cpiValue >= 1 ? 'good' : project.cpiValue >= 0.9 ? 'warning' : 'critical'}
        />
        <KPICard
          title="Days Remaining"
          value={daysRemaining}
          subtitle={`Ends ${format(new Date(project.plannedEndDate), 'MMM d, yyyy')}`}
          icon={<Calendar className="w-6 h-6" />}
          status={daysRemaining > 60 ? 'good' : daysRemaining > 30 ? 'warning' : 'critical'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline & Budget */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline / Gantt */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Project Timeline
            </h3>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-28 flex-shrink-0">
                    <p className="font-medium text-sm text-gray-900">{phase.name}</p>
                    <p className="text-xs text-gray-500">{phase.start}</p>
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      value={phase.progress}
                      size="md"
                      color={
                        phase.status === 'completed'
                          ? 'success'
                          : phase.status === 'in_progress'
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </div>
                  <div className="w-20 text-right">
                    {phase.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-success-500 inline" />
                    ) : phase.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-primary-500 inline" />
                    ) : (
                      <span className="text-xs text-gray-400">Not Started</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-500" />
              Budget Overview
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-xl font-bold text-gray-900">${(project.budget / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Actual Cost</p>
                <p className="text-xl font-bold text-gray-900">${(project.actualCost / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Committed</p>
                <p className="text-xl font-bold text-gray-900">${(project.committed / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Forecast</p>
                <p className={`text-xl font-bold ${project.forecast > project.budget ? 'text-danger-600' : 'text-gray-900'}`}>
                  ${(project.forecast / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
            <DualProgressBar
              planned={project.percentComplete}
              actual={budgetUsedPercent}
              label="Budget vs Progress"
            />
            <p className="text-sm text-gray-500 mt-2">
              {budgetUsedPercent > project.percentComplete
                ? `Spending is ${budgetUsedPercent - project.percentComplete}% ahead of progress`
                : `Budget utilization is on track`}
            </p>
          </div>

          {/* Risks & Issues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Risks */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning-500" />
                Top Risks
                <span className="badge badge-warning ml-auto">{project.openRisks}</span>
              </h3>
              <ul className="space-y-3">
                {topRisks.map((risk) => (
                  <li key={risk.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                      risk.score >= 15 ? 'bg-danger-100 text-danger-600' :
                      risk.score >= 10 ? 'bg-warning-100 text-warning-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {risk.score}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{risk.title}</p>
                      <p className="text-xs text-gray-500">
                        {risk.probability} probability • {risk.impact} impact
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Issues */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-danger-500" />
                Recent Issues
                <span className="badge badge-danger ml-auto">{project.openIssues}</span>
              </h3>
              <ul className="space-y-3">
                {recentIssues.map((issue) => (
                  <li key={issue.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    {issue.status === 'resolved' ? (
                      <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                    ) : issue.priority === 'high' ? (
                      <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                      <p className="text-xs text-gray-500">
                        {issue.id} • {issue.assignee}
                      </p>
                    </div>
                    <StatusBadge
                      status={
                        issue.status === 'resolved' ? 'success' :
                        issue.priority === 'high' ? 'danger' : 'warning'
                      }
                      size="sm"
                    >
                      {issue.status}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Milestones, Team, Changes */}
        <div className="space-y-6">
          {/* Upcoming Milestones */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary-500" />
              Upcoming Milestones
            </h3>
            <ul className="space-y-3">
              {upcomingMilestones.map((milestone) => (
                <li key={milestone.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{milestone.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      milestone.type === 'contractual' ? 'bg-primary-50 text-primary-600' :
                      milestone.type === 'payment' ? 'bg-success-50 text-success-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {milestone.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{format(milestone.date, 'MMM d')}</p>
                    <p className="text-xs text-gray-500">
                      {differenceInDays(milestone.date, new Date())} days
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Team */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Project Team
            </h3>
            <ul className="space-y-3">
              {teamMembers.map((member, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Change Requests */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-primary-500" />
              Change Requests
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-warning-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-warning-600">{project.pendingChanges}</p>
                <p className="text-sm text-warning-600">Pending</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{project.variationOrders}</p>
                <p className="text-sm text-gray-600">Variation Orders</p>
              </div>
            </div>
            <button className="btn btn-secondary w-full mt-4">
              View All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
