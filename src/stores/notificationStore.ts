import { create } from 'zustand'
import type { Notification, ReminderRule } from '../types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  reminderRules: ReminderRule[]

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  deleteNotification: (id: string) => void

  setReminderRules: (rules: ReminderRule[]) => void
  addReminderRule: (rule: ReminderRule) => void
  updateReminderRule: (id: string, updates: Partial<ReminderRule>) => void
  deleteReminderRule: (id: string) => void
  toggleReminderRule: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  reminderRules: [],

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id)
      const wasUnread = notification && !notification.isRead
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
        ),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date(),
      })),
      unreadCount: 0,
    })),

  archiveNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isArchived: true } : n
      ),
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id)
      const wasUnread = notification && !notification.isRead
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      }
    }),

  setReminderRules: (reminderRules) => set({ reminderRules }),

  addReminderRule: (rule) =>
    set((state) => ({ reminderRules: [...state.reminderRules, rule] })),

  updateReminderRule: (id, updates) =>
    set((state) => ({
      reminderRules: state.reminderRules.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  deleteReminderRule: (id) =>
    set((state) => ({
      reminderRules: state.reminderRules.filter((r) => r.id !== id),
    })),

  toggleReminderRule: (id) =>
    set((state) => ({
      reminderRules: state.reminderRules.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ),
    })),
}))
