import { createContext, useContext, useState, useCallback } from 'react'

const RoleContext = createContext(null)

export const ROLES = {
  OWNER: 'owner',
  GM: 'gm',
  EMPLOYEE: 'employee',
}

export const ROLE_META = {
  [ROLES.OWNER]: {
    label: 'Owner',
    subtitle: 'Multi-Venue Intelligence',
    description: 'Am I making money?',
    color: '#D4A853',
    initials: 'JH',
  },
  [ROLES.GM]: {
    label: 'General Manager',
    subtitle: 'Venue Operations',
    description: 'Is today going to run smoothly?',
    color: '#14B8A6',
    initials: 'SM',
  },
  [ROLES.EMPLOYEE]: {
    label: 'Employee',
    subtitle: 'My Shifts & Tasks',
    description: 'What do I need to know?',
    color: '#3B82F6',
    initials: 'MT',
  },
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null)
  const [notifications, setNotifications] = useState({
    [ROLES.OWNER]: 3,
    [ROLES.GM]: 7,
    [ROLES.EMPLOYEE]: 2,
  })

  const addNotification = useCallback((targetRole) => {
    setNotifications(prev => ({ ...prev, [targetRole]: (prev[targetRole] || 0) + 1 }))
  }, [])

  const clearNotifications = useCallback((targetRole) => {
    setNotifications(prev => ({ ...prev, [targetRole]: 0 }))
  }, [])

  return (
    <RoleContext.Provider value={{ role, setRole, notifications, addNotification, clearNotifications }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
