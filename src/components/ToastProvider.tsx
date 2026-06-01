'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type ToastType = 'success' | 'warning' | 'danger' | 'info'

interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
}

interface ToastContextValue {
  success: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  danger: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const styles: Record<ToastType, { icon: any; className: string; iconClassName: string; defaultTitle: string }> = {
  success: {
    icon: CheckCircle,
    className: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-50',
    iconClassName: 'text-emerald-300',
    defaultTitle: 'Success',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-950/90 text-amber-50',
    iconClassName: 'text-amber-300',
    defaultTitle: 'Warning',
  },
  danger: {
    icon: XCircle,
    className: 'border-red-500/30 bg-red-950/90 text-red-50',
    iconClassName: 'text-red-300',
    defaultTitle: 'Error',
  },
  info: {
    icon: Info,
    className: 'border-sky-500/30 bg-sky-950/90 text-sky-50',
    iconClassName: 'text-sky-300',
    defaultTitle: 'Info',
  },
}

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = createToastId()
    setToasts(current => [...current, { id, type, title, message }].slice(-4))
    window.setTimeout(() => dismiss(id), 5000)
  }, [dismiss])

  const value = useMemo<ToastContextValue>(() => ({
    success: (message, title) => addToast('success', message, title),
    warning: (message, title) => addToast('warning', message, title),
    danger: (message, title) => addToast('danger', message, title),
    info: (message, title) => addToast('info', message, title),
    dismiss,
  }), [addToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        <AnimatePresence initial={false}>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const style = styles[toast.type]
  const Icon = style.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`flex gap-3 rounded-lg border p-4 shadow-2xl backdrop-blur ${style.className}`}
      role="status"
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClassName}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title || style.defaultTitle}</p>
        <p className="mt-1 text-sm leading-relaxed opacity-90">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
