import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole, Permission } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  permissions: Permission[]

  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  hasPermission: (module: Permission['module'], action: Permission['actions'][number]) => boolean
  hasRole: (roles: UserRole[]) => boolean
}

// Demo user for development
const demoUser: User = {
  id: '1',
  email: 'admin@projectforge.io',
  firstName: 'Admin',
  lastName: 'User',
  department: 'IT PMO',
  status: 'active',
  role: 'admin',
  isVendor: false,
  isCustomer: false,
  projects: [],
  costCenters: ['CC001', 'CC002'],
  approvalLimits: {
    poLimit: 100000,
    changeOrderLimit: 50000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

const adminPermissions: Permission[] = [
  { module: 'projects', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'financials', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'materials', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'reports', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'admin', actions: ['view', 'create', 'edit', 'delete'] },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],

      login: async (email: string, _password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo, accept any login
        if (email) {
          set({
            user: { ...demoUser, email },
            token: 'demo-token-' + Date.now(),
            isAuthenticated: true,
            permissions: adminPermissions,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
        })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      hasPermission: (module, action) => {
        const { permissions } = get()
        const modulePermission = permissions.find((p) => p.module === module)
        return modulePermission?.actions.includes(action) ?? false
      },

      hasRole: (roles) => {
        const { user } = get()
        return user ? roles.includes(user.role) : false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
