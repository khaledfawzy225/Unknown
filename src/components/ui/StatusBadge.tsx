import { clsx } from 'clsx'

type StatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'
  | 'rag-red'
  | 'rag-amber'
  | 'rag-green'

interface StatusBadgeProps {
  status: StatusType
  children: React.ReactNode
  size?: 'sm' | 'md'
  dot?: boolean
}

const statusClasses: Record<StatusType, string> = {
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-primary-50 text-primary-600',
  default: 'bg-gray-100 text-gray-600',
  'rag-red': 'bg-red-100 text-red-700',
  'rag-amber': 'bg-amber-100 text-amber-700',
  'rag-green': 'bg-green-100 text-green-700',
}

const dotClasses: Record<StatusType, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-primary-500',
  default: 'bg-gray-500',
  'rag-red': 'bg-red-500',
  'rag-amber': 'bg-amber-500',
  'rag-green': 'bg-green-500',
}

export default function StatusBadge({
  status,
  children,
  size = 'md',
  dot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        statusClasses[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', dotClasses[status])} />
      )}
      {children}
    </span>
  )
}

export function RAGIndicator({ status }: { status: 'red' | 'amber' | 'green' }) {
  const colorClass = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  }[status]

  return (
    <span
      className={clsx('inline-block w-3 h-3 rounded-full', colorClass)}
      title={`Status: ${status.toUpperCase()}`}
    />
  )
}
