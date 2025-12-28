import { useState } from 'react'
import { Plus, Edit, Trash2, Shield, Check, X } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import type { Role, Permission } from '../../types'

const modules: Permission['module'][] = [
  'projects',
  'financials',
  'materials',
  'reports',
  'admin',
]

const actions: Permission['actions'][number][] = [
  'view',
  'create',
  'edit',
  'delete',
  'approve',
]

const demoRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    permissions: modules.map((module) => ({
      module,
      actions: [...actions],
    })),
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Project Manager',
    description: 'Manage projects, tasks, and team members',
    isSystem: true,
    permissions: [
      { module: 'projects', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'financials', actions: ['view'] },
      { module: 'materials', actions: ['view', 'create', 'edit'] },
      { module: 'reports', actions: ['view', 'create'] },
    ],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: 'PMO',
    description: 'Portfolio oversight and reporting',
    isSystem: true,
    permissions: [
      { module: 'projects', actions: ['view', 'edit'] },
      { module: 'financials', actions: ['view'] },
      { module: 'materials', actions: ['view'] },
      { module: 'reports', actions: ['view', 'create', 'edit'] },
    ],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '4',
    name: 'Finance',
    description: 'Financial management and approvals',
    isSystem: true,
    permissions: [
      { module: 'projects', actions: ['view'] },
      { module: 'financials', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'materials', actions: ['view', 'approve'] },
      { module: 'reports', actions: ['view', 'create'] },
    ],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '5',
    name: 'Procurement',
    description: 'Purchase order and vendor management',
    isSystem: false,
    permissions: [
      { module: 'projects', actions: ['view'] },
      { module: 'financials', actions: ['view', 'create'] },
      { module: 'materials', actions: ['view', 'create', 'edit', 'approve'] },
    ],
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '6',
    name: 'Site Engineer',
    description: 'Field operations and task updates',
    isSystem: false,
    permissions: [
      { module: 'projects', actions: ['view', 'edit'] },
      { module: 'materials', actions: ['view'] },
    ],
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '7',
    name: 'Vendor',
    description: 'External vendor with limited access',
    isSystem: true,
    permissions: [
      { module: 'projects', actions: ['view'] },
      { module: 'materials', actions: ['view'] },
    ],
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '8',
    name: 'Customer',
    description: 'Customer portal access',
    isSystem: true,
    permissions: [
      { module: 'projects', actions: ['view'] },
      { module: 'reports', actions: ['view'] },
    ],
    createdAt: new Date('2023-01-01'),
  },
]

export default function RolesPage() {
  const [roles] = useState<Role[]>(demoRoles)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const hasPermission = (role: Role, module: Permission['module'], action: Permission['actions'][number]) => {
    const modulePermission = role.permissions.find((p) => p.module === module)
    return modulePermission?.actions.includes(action) ?? false
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">
            Define roles and configure access permissions for each module
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              {role.isSystem && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  System
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span
                  key={perm.module}
                  className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded"
                >
                  {perm.module}: {perm.actions.length} actions
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase text-xs">
                  Role / Module
                </th>
                {modules.map((module) => (
                  <th
                    key={module}
                    colSpan={actions.length}
                    className="text-center py-3 px-2 font-medium text-gray-900 capitalize border-l border-gray-200"
                  >
                    {module}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-2 px-4"></th>
                {modules.map((module) =>
                  actions.map((action) => (
                    <th
                      key={`${module}-${action}`}
                      className="py-2 px-1 text-xs text-gray-500 font-normal capitalize"
                    >
                      {action[0].toUpperCase()}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {role.name}
                  </td>
                  {modules.map((module) =>
                    actions.map((action) => (
                      <td
                        key={`${role.id}-${module}-${action}`}
                        className="py-3 px-1 text-center"
                      >
                        {hasPermission(role, module, action) ? (
                          <Check className="w-4 h-4 text-success-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <span className="font-medium">Legend:</span> V=View, C=Create, E=Edit, D=Delete, A=Approve
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!selectedRole}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedRole(null)
        }}
        title={selectedRole ? 'Edit Role' : 'Create New Role'}
        size="xl"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setSelectedRole(null)
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {selectedRole ? 'Save Changes' : 'Create Role'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role Name</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedRole?.name}
                disabled={selectedRole?.isSystem}
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                type="text"
                className="input"
                defaultValue={selectedRole?.description}
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Module
                    </th>
                    {actions.map((action) => (
                      <th
                        key={action}
                        className="py-3 px-4 text-center font-medium text-gray-500 text-sm capitalize"
                      >
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {modules.map((module) => (
                    <tr key={module}>
                      <td className="py-3 px-4 font-medium text-gray-900 capitalize">
                        {module}
                      </td>
                      {actions.map((action) => (
                        <td key={action} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 rounded"
                            defaultChecked={
                              selectedRole
                                ? hasPermission(selectedRole, module, action)
                                : false
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
