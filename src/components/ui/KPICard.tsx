import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'good' | 'warning' | 'critical'
  icon?: React.ReactNode
  onClick?: () => void
}

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status = 'good',
  icon,
  onClick,
}: KPICardProps) {
  const statusColors = {
    good: 'border-l-success-500',
    warning: 'border-l-warning-500',
    critical: 'border-l-danger-500',
  }

  const trendColors = {
    up: 'text-success-600 bg-success-50',
    down: 'text-danger-600 bg-danger-50',
    stable: 'text-gray-600 bg-gray-100',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 p-5 border-l-4 transition-all',
        statusColors[status],
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
        )}
      </div>

      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={clsx(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              trendColors[trend]
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  )
}
