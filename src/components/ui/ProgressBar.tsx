import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto'
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'auto',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const getAutoColor = () => {
    if (percentage >= 80) return 'bg-success-500'
    if (percentage >= 50) return 'bg-primary-500'
    if (percentage >= 25) return 'bg-warning-500'
    return 'bg-danger-500'
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    auto: getAutoColor(),
  }

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface DualProgressBarProps {
  planned: number
  actual: number
  max?: number
  label?: string
}

export function DualProgressBar({
  planned,
  actual,
  max = 100,
  label,
}: DualProgressBarProps) {
  const plannedPercent = Math.min(Math.round((planned / max) * 100), 100)
  const actualPercent = Math.min(Math.round((actual / max) * 100), 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Planned: {plannedPercent}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Actual: {actualPercent}%
            </span>
          </div>
        </div>
      )}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gray-400 rounded-full opacity-50"
          style={{ width: `${plannedPercent}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-primary-500 rounded-full"
          style={{ width: `${actualPercent}%` }}
        />
      </div>
    </div>
  )
}
