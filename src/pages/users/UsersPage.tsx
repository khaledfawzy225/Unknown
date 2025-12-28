import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
} from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import type { User, UserStatus, UserRole } from '../../types'

// Demo data
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@projectforge.io',
    firstName: 'Admin',
    lastName: 'User',
    department: 'IT PMO',
    status: 'active',
    role: 'admin',
    isVendor: false,
    isCustomer: false,
    projects: ['P001', 'P002'],
    costCenters: ['CC001'],
    approvalLimits: { poLimit: 100000, changeOrderLimit: 50000 },
    lastLogin: new Date('2024-01-15T10:30:00'),
    lastActivity: new Date('2024-01-15T14:45:00'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'john.pm@company.com',
    firstName: 'John',
    lastName: 'Smith',
    department: 'Projects',
    status: 'active',
    role: 'pm',
    isVendor: false,
    isCustomer: false,
    projects: ['P001', 'P003'],
    costCenters: ['CC002'],
    approvalLimits: { poLimit: 50000, changeOrderLimit: 25000 },
    lastLogin: new Date('2024-01-14T09:00:00'),
    lastActivity: new Date('2024-01-14T17:30:00'),
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    email: 'sarah.finance@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    department: 'Finance',
    status: 'active',
    role: 'finance',
    isVendor: false,
    isCustomer: false,
    projects: [],
    costCenters: ['CC001', 'CC002', 'CC003'],
    approvalLimits: { poLimit: 200000, changeOrderLimit: 100000 },
    lastLogin: new Date('2024-01-15T08:00:00'),
    lastActivity: new Date('2024-01-15T12:00:00'),
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    email: 'vendor@supplier.com',
    firstName: 'Mike',
    lastName: 'Vendor',
    department: 'External',
    status: 'active',
    role: 'vendor',
    isVendor: true,
    isCustomer: false,
    projects: ['P001'],
    costCenters: [],
    approvalLimits: { poLimit: 0, changeOrderLimit: 0 },
    lastLogin: new Date('2024-01-10T11:00:00'),
    lastActivity: new Date('2024-01-10T11:30:00'),
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '5',
    email: 'locked.user@company.com',
    firstName: 'Locked',
    lastName: 'User',
    department: 'IT',
    status: 'locked',
    role: 'site_engineer',
    isVendor: false,
    isCustomer: false,
    projects: [],
    costCenters: [],
    approvalLimits: { poLimit: 10000, changeOrderLimit: 5000 },
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  pm: 'Project Manager',
  pmo: 'PMO',
  finance: 'Finance',
  procurement: 'Procurement',
  site_engineer: 'Site Engineer',
  vendor: 'Vendor',
  customer: 'Customer',
}

const statusConfig: Record<UserStatus, { label: string; type: 'success' | 'warning' | 'danger' }> = {
  active: { label: 'Active', type: 'success' },
  locked: { label: 'Locked', type: 'danger' },
  pending: { label: 'Pending', type: 'warning' },
}

export default function UsersPage() {
  const [users] = useState<User[]>(demoUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <span>{roleLabels[user.role]}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => {
        const config = statusConfig[user.status]
        return (
          <StatusBadge status={config.type} dot>
            {config.label}
          </StatusBadge>
        )
      },
    },
    {
      key: 'approvalLimits',
      header: 'PO Limit',
      render: (user: User) => (
        <span className="font-medium">
          ${user.approvalLimits.poLimit.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user: User) =>
        user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString()
          : 'Never',
    },
    {
      key: 'actions',
      header: '',
      render: (user: User) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsMenu(showActionsMenu === user.id ? null : user.id)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActionsMenu === user.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  setSelectedUser(user)
                  setShowActionsMenu(null)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {user.status === 'locked' ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unlock Account
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Lock Account
                  </>
                )}
              </button>
              <hr className="my-1" />
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50">
                <Trash2 className="w-4 h-4" />
                Delete User
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users, their roles, and project assignments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="input pl-10"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Roles</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-32"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        keyExtractor={(user) => user.id}
        onRowClick={(user) => setSelectedUser(user)}
        emptyMessage="No users found"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedUser}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedUser(null)
        }}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedUser(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedUser ? 'Save Changes' : 'Create User'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedUser?.firstName}
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedUser?.lastName}
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              defaultValue={selectedUser?.email}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedUser?.department}
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" defaultValue={selectedUser?.role}>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedUser?.isVendor}
              />
              <span className="text-sm">Vendor Account</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded"
                defaultChecked={selectedUser?.isCustomer}
              />
              <span className="text-sm">Customer Account</span>
            </label>
          </div>

          {/* Approval Limits */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Approval Limits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">PO Limit ($)</label>
                <input
                  type="number"
                  className="input"
                  defaultValue={selectedUser?.approvalLimits.poLimit}
                />
              </div>
              <div>
                <label className="label">Change Order Limit ($)</label>
                <input
                  type="number"
                  className="input"
                  defaultValue={selectedUser?.approvalLimits.changeOrderLimit}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
