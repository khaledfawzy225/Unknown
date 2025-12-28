import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Package,
  FileText,
  DollarSign,
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'milestone' | 'deliverable' | 'po' | 'invoice' | 'task'
  project: string
  status: 'on_track' | 'at_risk' | 'completed' | 'overdue'
}

const demoEvents: CalendarEvent[] = [
  { id: '1', title: 'UAT Sign-off', date: new Date('2024-01-15'), type: 'milestone', project: 'ERP Implementation', status: 'completed' },
  { id: '2', title: 'API Documentation', date: new Date('2024-01-18'), type: 'deliverable', project: 'ERP Implementation', status: 'on_track' },
  { id: '3', title: 'Server Hardware PO', date: new Date('2024-01-20'), type: 'po', project: 'Cloud Migration', status: 'at_risk' },
  { id: '4', title: 'Phase 2 Invoice', date: new Date('2024-01-22'), type: 'invoice', project: 'Security Audit', status: 'on_track' },
  { id: '5', title: 'Design Review', date: new Date('2024-01-25'), type: 'milestone', project: 'Mobile App', status: 'on_track' },
  { id: '6', title: 'Security Report', date: new Date('2024-01-28'), type: 'deliverable', project: 'Security Audit', status: 'at_risk' },
  { id: '7', title: 'Go-Live', date: new Date('2024-02-15'), type: 'milestone', project: 'Cloud Migration', status: 'on_track' },
  { id: '8', title: 'Training Materials', date: new Date('2024-02-10'), type: 'deliverable', project: 'ERP Implementation', status: 'on_track' },
]

const eventTypeConfig = {
  milestone: { icon: Flag, color: 'bg-primary-100 text-primary-600 border-primary-200' },
  deliverable: { icon: Package, color: 'bg-success-100 text-success-600 border-success-200' },
  po: { icon: FileText, color: 'bg-warning-100 text-warning-600 border-warning-200' },
  invoice: { icon: DollarSign, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  task: { icon: FileText, color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const statusColors = {
  on_track: 'border-l-success-500',
  at_risk: 'border-l-warning-500',
  completed: 'border-l-gray-400',
  overdue: 'border-l-danger-500',
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [eventFilter, setEventFilter] = useState<string>('')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const filteredEvents = demoEvents.filter((event) => {
    if (!eventFilter) return true
    return event.type === eventFilter
  })

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => isSameDay(new Date(event.date), date))
  }

  const generateCalendarDays = () => {
    const days = []
    let day = calendarStart

    while (day <= calendarEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">
            View milestones, deliverables, and key dates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="input w-40"
          >
            <option value="">All Events</option>
            <option value="milestone">Milestones</option>
            <option value="deliverable">Deliverables</option>
            <option value="po">Purchase Orders</option>
            <option value="invoice">Invoices</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-50 border-primary-300'
                      : isCurrentMonth
                      ? 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day)
                      ? 'w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center'
                      : isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const config = eventTypeConfig[event.type]
                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border-l-2 truncate ${config.color} ${statusColors[event.status]}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar - Selected Date Events */}
        <div className="card h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">
            {selectedDate
              ? format(selectedDate, 'EEEE, MMMM d')
              : 'Select a date'}
          </h3>

          {selectedDate && selectedDateEvents.length === 0 && (
            <p className="text-sm text-gray-500">No events on this date</p>
          )}

          <div className="space-y-3">
            {selectedDateEvents.map((event) => {
              const config = eventTypeConfig[event.type]
              const Icon = config.icon
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${config.color} ${statusColors[event.status]}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{event.project}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                        event.status === 'on_track' ? 'bg-success-100 text-success-600' :
                        event.status === 'at_risk' ? 'bg-warning-100 text-warning-600' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-danger-100 text-danger-600'
                      }`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
            <div className="space-y-2">
              {Object.entries(eventTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <div className={`p-1 rounded ${config.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="capitalize">{type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
