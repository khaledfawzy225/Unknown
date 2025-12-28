// ============================================
// USER & SECURITY TYPES
// ============================================

export type UserRole =
  | 'admin'
  | 'pm'
  | 'pmo'
  | 'finance'
  | 'procurement'
  | 'site_engineer'
  | 'vendor'
  | 'customer'

export type UserStatus = 'active' | 'locked' | 'pending'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  department: string
  status: UserStatus
  role: UserRole
  isVendor: boolean
  isCustomer: boolean
  projects: string[]
  costCenters: string[]
  approvalLimits: {
    poLimit: number
    changeOrderLimit: number
  }
  lastLogin?: Date
  lastActivity?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: Date
}

export interface Permission {
  module: 'projects' | 'financials' | 'materials' | 'reports' | 'admin'
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve')[]
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  entityType: string
  entityId: string
  entityName: string
  changes?: Record<string, { old: unknown; new: unknown }>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

// ============================================
// PROJECT & PORTFOLIO TYPES
// ============================================

export type RAGStatus = 'red' | 'amber' | 'green'
export type ProjectStage = 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closing'
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled'

export interface Project {
  id: string
  code: string
  name: string
  description: string
  customer: string
  region: string
  type: string
  stage: ProjectStage
  status: ProjectStatus
  ragStatus: RAGStatus

  // Team
  projectManager: string
  pmId: string
  team: string[]

  // Dates
  plannedStartDate: Date
  plannedEndDate: Date
  actualStartDate?: Date
  actualEndDate?: Date
  baselineStartDate: Date
  baselineEndDate: Date

  // Financials
  budget: number
  actualCost: number
  committed: number
  forecast: number
  margin: number

  // Progress
  percentComplete: number
  spiValue: number // Schedule Performance Index
  cpiValue: number // Cost Performance Index

  // Counts
  openRisks: number
  openIssues: number
  pendingChanges: number
  variationOrders: number

  createdAt: Date
  updatedAt: Date
}

export interface WBSItem {
  id: string
  projectId: string
  parentId?: string
  code: string
  name: string
  description: string
  level: number
  type: 'phase' | 'deliverable' | 'work_package' | 'task'
  owner: string
  ownerId: string

  // Dates
  plannedStart: Date
  plannedEnd: Date
  actualStart?: Date
  actualEnd?: Date
  baselineStart: Date
  baselineEnd: Date

  // Budget
  baselineBudget: number
  currentBudget: number
  actualCost: number

  // Progress
  percentComplete: number
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'

  children?: WBSItem[]
}

// ============================================
// TASK & KANBAN TYPES
// ============================================

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  projectId: string
  wbsItemId?: string
  parentTaskId?: string

  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority

  assigneeId: string
  assigneeName: string
  reporterId: string

  plannedStart: Date
  plannedEnd: Date
  actualStart?: Date
  actualEnd?: Date

  estimatedHours: number
  actualHours: number

  dependencies: string[]
  blockedBy?: string
  blockReason?: string

  tags: string[]
  isRisk: boolean
  isCustomerFacing: boolean
  isCriticalPath: boolean

  attachments: Attachment[]
  comments: Comment[]

  createdAt: Date
  updatedAt: Date
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: Date
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

// ============================================
// RISK, ISSUE & CHANGE TYPES
// ============================================

export type RiskProbability = 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
export type RiskImpact = 'negligible' | 'minor' | 'moderate' | 'major' | 'severe'
export type RiskStatus = 'identified' | 'analyzing' | 'mitigating' | 'monitoring' | 'closed'

export interface Risk {
  id: string
  projectId: string
  code: string
  title: string
  description: string
  category: string

  probability: RiskProbability
  impact: RiskImpact
  riskScore: number // probability * impact

  status: RiskStatus
  owner: string
  ownerId: string

  mitigationPlan: string
  contingencyPlan: string

  linkedTasks: string[]
  linkedPOs: string[]

  identifiedDate: Date
  reviewDate?: Date
  closedDate?: Date

  createdAt: Date
  updatedAt: Date
}

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type IssueStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed'

export interface Issue {
  id: string
  projectId: string
  code: string
  title: string
  description: string
  category: string

  priority: IssuePriority
  status: IssueStatus

  owner: string
  ownerId: string
  assignee: string
  assigneeId: string

  slaHours: number
  slaDeadline: Date
  escalationPath: string[]
  currentEscalationLevel: number

  linkedTasks: string[]
  linkedPOs: string[]
  linkedRisks: string[]

  resolution?: string
  resolvedDate?: Date

  createdAt: Date
  updatedAt: Date
}

export type ChangeRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'implemented'

export interface ChangeRequest {
  id: string
  projectId: string
  code: string
  title: string
  description: string

  scopeDescription: string
  justification: string

  // Impact Assessment
  timeImpactDays: number
  costImpact: number
  qualityImpact: string
  riskImpact: string

  status: ChangeRequestStatus

  requestedBy: string
  requestedById: string
  requestedDate: Date

  approvals: ChangeApproval[]

  // If approved
  implementedBy?: string
  implementedDate?: Date
  baselineUpdated: boolean

  createdAt: Date
  updatedAt: Date
}

export interface ChangeApproval {
  id: string
  approverId: string
  approverName: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  date?: Date
}

// ============================================
// MILESTONE & DELIVERABLE TYPES
// ============================================

export type MilestoneType = 'contractual' | 'internal' | 'payment' | 'customer_acceptance'
export type MilestoneStatus = 'upcoming' | 'at_risk' | 'achieved' | 'missed' | 'deferred'

export interface Milestone {
  id: string
  projectId: string
  wbsItemId?: string
  code: string
  name: string
  description: string

  type: MilestoneType
  status: MilestoneStatus

  plannedDate: Date
  baselineDate: Date
  forecastDate?: Date
  actualDate?: Date

  owner: string
  ownerId: string

  acceptanceCriteria: string[]

  linkedDeliverables: string[]
  linkedPOs: string[]
  linkedPayments: string[]

  isPaymentMilestone: boolean
  paymentAmount?: number
  paymentTerms?: string

  createdAt: Date
  updatedAt: Date
}

export type DeliverableStatus = 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'rejected'

export interface Deliverable {
  id: string
  projectId: string
  milestoneId?: string
  wbsItemId?: string
  code: string
  name: string
  description: string

  status: DeliverableStatus

  dueDate: Date
  submittedDate?: Date
  acceptedDate?: Date

  owner: string
  ownerId: string
  reviewer?: string
  reviewerId?: string

  acceptanceCriteria: string[]

  attachments: Attachment[]
  comments: Comment[]

  createdAt: Date
  updatedAt: Date
}

// ============================================
// NOTIFICATION & REMINDER TYPES
// ============================================

export type NotificationType =
  | 'milestone_upcoming'
  | 'milestone_overdue'
  | 'deliverable_due'
  | 'po_delivery_date'
  | 'invoice_due'
  | 'task_assigned'
  | 'task_overdue'
  | 'issue_escalated'
  | 'change_request_approval'
  | 'risk_review'
  | 'general'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string

  entityType?: string
  entityId?: string
  projectId?: string

  isRead: boolean
  isArchived: boolean

  actionUrl?: string

  createdAt: Date
  readAt?: Date
}

export type ReminderTrigger =
  | 'days_before'
  | 'days_after'
  | 'on_date'
  | 'recurring'

export interface ReminderRule {
  id: string
  name: string
  description: string
  isActive: boolean

  entityType: 'milestone' | 'deliverable' | 'po' | 'invoice' | 'task' | 'issue'
  trigger: ReminderTrigger
  triggerDays: number

  recipients: {
    roles: UserRole[]
    specificUsers: string[]
    projectRoles: ('pm' | 'owner' | 'assignee')[]
  }

  channels: ('in_app' | 'email' | 'slack' | 'teams')[]

  escalation?: {
    afterDays: number
    escalateTo: UserRole[]
  }

  messageTemplate: string

  createdAt: Date
  updatedAt: Date
}

// ============================================
// FINANCIAL TYPES (PO, Invoice, Materials)
// ============================================

export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'acknowledged' | 'completed' | 'cancelled'

export interface PurchaseOrder {
  id: string
  projectId: string
  code: string

  vendorId: string
  vendorName: string

  description: string

  items: POItem[]
  totalAmount: number
  currency: string

  status: POStatus

  requiredDate: Date
  expectedDeliveryDate?: Date
  actualDeliveryDate?: Date

  requestedBy: string
  requestedById: string

  approvals: POApproval[]

  linkedMilestones: string[]
  linkedWBSItems: string[]

  createdAt: Date
  updatedAt: Date
}

export interface POItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  materialCode?: string
}

export interface POApproval {
  id: string
  approverId: string
  approverName: string
  level: number
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  date?: Date
}

export type InvoiceStatus = 'draft' | 'submitted' | 'approved' | 'paid' | 'overdue' | 'disputed'

export interface Invoice {
  id: string
  projectId: string
  code: string

  type: 'receivable' | 'payable'

  partyId: string
  partyName: string

  description: string
  lineItems: InvoiceLineItem[]

  subtotal: number
  taxAmount: number
  totalAmount: number
  currency: string

  status: InvoiceStatus

  issueDate: Date
  dueDate: Date
  gracePeriodDays: number
  paidDate?: Date

  linkedMilestones: string[]
  linkedPOs: string[]

  createdAt: Date
  updatedAt: Date
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// ============================================
// DASHBOARD & WIDGET TYPES
// ============================================

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'list' | 'calendar' | 'gantt'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  config: Record<string, unknown>
}

export interface KPIMetric {
  id: string
  name: string
  value: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  target?: number
  status: 'good' | 'warning' | 'critical'
}
