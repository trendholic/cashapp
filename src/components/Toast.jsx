import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)

  const show = useCallback((text) => {
    setMsg(text)
    window.clearTimeout(show._t)
    show._t = window.setTimeout(() => setMsg(null), 2200)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && <div className="toast">{msg}</div>}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
