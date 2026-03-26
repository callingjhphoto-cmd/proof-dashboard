import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', text: '#22C55E' },
  warning: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', text: '#F97316' },
  error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  info: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#3B82F6' },
}

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false)
  const Icon = ICONS[toast.type] || Info
  const color = COLORS[toast.type] || COLORS.info

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, toast.duration || 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: 10,
        minWidth: 280,
        maxWidth: 420,
        backdropFilter: 'blur(12px)',
        animation: exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease forwards',
        pointerEvents: 'auto',
      }}
    >
      <Icon size={18} color={color.text} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#E5E5E5', lineHeight: 1.4 }}>
        {toast.message}
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onDismiss(toast.id), 300) }}
        style={{
          background: 'none', border: 'none', color: '#666', cursor: 'pointer',
          padding: 2, display: 'flex', flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback({
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  }, [addToast])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
