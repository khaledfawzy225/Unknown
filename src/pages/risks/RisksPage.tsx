import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { Risk, RiskProbability, RiskImpact, RiskStatus } from '../../types'

const demoRisks: Risk[] = [
  {
    id: 'r1', projectId: '1', code: 'RSK-001', title: 'Vendor resource availability',
    description: 'Key vendor resources may not be available during critical project phases',
    category: 'Resource', probability: 'high', impact: 'major', riskScore: 16,
    status: 'mitigating', owner: 'John Smith', ownerId: '2',
    mitigationPlan: 'Establish backup vendor relationships and cross-train internal team',
    contingencyPlan: 'Bring in contractor resources if vendor fails to deliver',
    linkedTasks: ['t2'], linkedPOs: ['PO-001'],
    identifiedDate: new Date('2024-01-15'),
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'r2', projectId: '1', code: 'RSK-002', title: 'Scope creep from change requests',
    description: 'Frequent change requests may lead to scope expansion beyond budget',
    category: 'Scope', probability: 'medium', impact: 'major', riskScore: 12,
    status: 'monitoring', owner: 'Lisa Park', ownerId: '5',
    mitigationPlan: 'Implement strict change control process with impact assessment',
    contingencyPlan: 'Request additional budget approval if scope increases significantly',
    linkedTasks: [], linkedPOs: [],
    identifiedDate: new Date('2024-01-20'),
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'r3', projectId: '1', code: 'RSK-003', title: 'Data migration complexity',
    description: 'Legacy data quality issues may complicate migration',
    category: 'Technical', probability: 'high', impact: 'moderate', riskScore: 12,
    status: 'analyzing', owner: 'Mike Chen', ownerId: '7',
    mitigationPlan: 'Conduct early data profiling and cleansing activities',
    contingencyPlan: 'Extend migration timeline if data issues are severe',
    linkedTasks: ['t6'], linkedPOs: [],
    identifiedDate: new Date('2024-02-01'),
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'r4', projectId: '1', code: 'RSK-004', title: 'Integration with legacy systems',
    description: 'Integration with existing systems may face compatibility issues',
    category: 'Technical', probability: 'medium', impact: 'moderate', riskScore: 9,
    status: 'identified', owner: 'Sarah Lee', ownerId: '6',
    mitigationPlan: 'Conduct integration testing early in development phase',
    contingencyPlan: 'Develop adapter layer if direct integration fails',
    linkedTasks: ['t2'], linkedPOs: [],
    identifiedDate: new Date('2024-02-10'),
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 'r5', projectId: '1', code: 'RSK-005', title: 'User adoption resistance',
    description: 'End users may resist adopting the new system',
    category: 'Organizational', probability: 'medium', impact: 'minor', riskScore: 6,
    status: 'monitoring', owner: 'Lisa Park', ownerId: '5',
    mitigationPlan: 'Implement comprehensive training program and change management',
    contingencyPlan: 'Extend training period and provide additional support',
    linkedTasks: [], linkedPOs: [],
    identifiedDate: new Date('2024-01-25'),
    createdAt: new Date(), updatedAt: new Date(),
  },
]

const probabilityConfig: Record<RiskProbability, { label: string; value: number; color: string }> = {
  very_low: { label: 'Very Low', value: 1, color: 'text-gray-500' },
  low: { label: 'Low', value: 2, color: 'text-success-600' },
  medium: { label: 'Medium', value: 3, color: 'text-warning-600' },
  high: { label: 'High', value: 4, color: 'text-orange-600' },
  very_high: { label: 'Very High', value: 5, color: 'text-danger-600' },
}

const impactConfig: Record<RiskImpact, { label: string; value: number; color: string }> = {
  negligible: { label: 'Negligible', value: 1, color: 'text-gray-500' },
  minor: { label: 'Minor', value: 2, color: 'text-success-600' },
  moderate: { label: 'Moderate', value: 3, color: 'text-warning-600' },
  major: { label: 'Major', value: 4, color: 'text-orange-600' },
  severe: { label: 'Severe', value: 5, color: 'text-danger-600' },
}

const statusConfig: Record<RiskStatus, { label: string; type: 'default' | 'info' | 'warning' | 'success' | 'danger' }> = {
  identified: { label: 'Identified', type: 'default' },
  analyzing: { label: 'Analyzing', type: 'info' },
  mitigating: { label: 'Mitigating', type: 'warning' },
  monitoring: { label: 'Monitoring', type: 'success' },
  closed: { label: 'Closed', type: 'success' },
}

export default function RisksPage() {
  const { projectId } = useParams()
  const [risks] = useState<Risk[]>(demoRisks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)

  const filteredRisks = risks.filter((risk) => {
    const matchesSearch = risk.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || risk.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getRiskScoreColor = (score: number) => {
    if (score >= 15) return 'bg-danger-500 text-white'
    if (score >= 10) return 'bg-orange-500 text-white'
    if (score >= 5) return 'bg-warning-500 text-white'
    return 'bg-success-500 text-white'
  }

  const columns = [
    {
      key: 'code',
      header: 'ID',
      render: (risk: Risk) => (
        <span className="font-mono text-sm text-gray-500">{risk.code}</span>
      ),
    },
    {
      key: 'title',
      header: 'Risk',
      render: (risk: Risk) => (
        <div>
          <p className="font-medium text-gray-900">{risk.title}</p>
          <p className="text-sm text-gray-500">{risk.category}</p>
        </div>
      ),
    },
    {
      key: 'probability',
      header: 'Probability',
      render: (risk: Risk) => (
        <span className={`font-medium ${probabilityConfig[risk.probability].color}`}>
          {probabilityConfig[risk.probability].label}
        </span>
      ),
    },
    {
      key: 'impact',
      header: 'Impact',
      render: (risk: Risk) => (
        <span className={`font-medium ${impactConfig[risk.impact].color}`}>
          {impactConfig[risk.impact].label}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      render: (risk: Risk) => (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm ${getRiskScoreColor(risk.riskScore)}`}>
          {risk.riskScore}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (risk: Risk) => {
        const config = statusConfig[risk.status]
        return (
          <StatusBadge status={config.type} size="sm">
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (risk: Risk) => risk.owner,
    },
    {
      key: 'actions',
      header: '',
      render: (risk: Risk) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedRisk(risk)
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
      className: 'w-12',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Register</h1>
          <p className="text-gray-600 mt-1">
            Identify, assess, and manage project risks
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Risk
        </button>
      </div>

      {/* Risk Matrix Summary */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Risk Matrix</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {['Very High', 'High', 'Medium', 'Low', 'Very Low'].map((prob, pIdx) => (
            <div key={prob} className="contents">
              {['Negligible', 'Minor', 'Moderate', 'Major', 'Severe'].map((imp, iIdx) => {
                const score = (5 - pIdx) * (iIdx + 1)
                const count = risks.filter(r => r.riskScore === score).length
                return (
                  <div
                    key={`${prob}-${imp}`}
                    className={`h-12 rounded flex items-center justify-center text-sm font-medium ${
                      score >= 15 ? 'bg-danger-100 text-danger-700' :
                      score >= 10 ? 'bg-orange-100 text-orange-700' :
                      score >= 5 ? 'bg-warning-100 text-warning-700' :
                      'bg-success-100 text-success-700'
                    }`}
                  >
                    {count > 0 && count}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
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
              placeholder="Search risks..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-36"
            >
              <option value="">All Status</option>
              {Object.entries(statusConfig).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <DataTable
        data={filteredRisks}
        columns={columns}
        keyExtractor={(risk) => risk.id}
        onRowClick={(risk) => setSelectedRisk(risk)}
        emptyMessage="No risks found"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedRisk}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedRisk(null)
        }}
        title={selectedRisk ? 'Edit Risk' : 'Add Risk'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedRisk(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedRisk ? 'Save Changes' : 'Add Risk'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Risk ID</label>
              <input type="text" className="input" defaultValue={selectedRisk?.code} placeholder="RSK-XXX" />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" defaultValue={selectedRisk?.category || ''}>
                <option value="">Select category</option>
                <option value="Technical">Technical</option>
                <option value="Resource">Resource</option>
                <option value="Scope">Scope</option>
                <option value="Schedule">Schedule</option>
                <option value="Cost">Cost</option>
                <option value="Organizational">Organizational</option>
                <option value="External">External</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Title</label>
            <input type="text" className="input" defaultValue={selectedRisk?.title} placeholder="Risk title" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} defaultValue={selectedRisk?.description} placeholder="Risk description" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Probability</label>
              <select className="input" defaultValue={selectedRisk?.probability || 'medium'}>
                {Object.entries(probabilityConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Impact</label>
              <select className="input" defaultValue={selectedRisk?.impact || 'moderate'}>
                {Object.entries(impactConfig).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Owner</label>
              <select className="input" defaultValue={selectedRisk?.ownerId || ''}>
                <option value="">Select owner</option>
                <option value="2">John Smith</option>
                <option value="5">Lisa Park</option>
                <option value="6">Sarah Lee</option>
                <option value="7">Mike Chen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Mitigation Plan</label>
            <textarea className="input" rows={2} defaultValue={selectedRisk?.mitigationPlan} placeholder="How will this risk be mitigated?" />
          </div>

          <div>
            <label className="label">Contingency Plan</label>
            <textarea className="input" rows={2} defaultValue={selectedRisk?.contingencyPlan} placeholder="What if mitigation fails?" />
          </div>
        </form>
      </Modal>
    </div>
  )
}
