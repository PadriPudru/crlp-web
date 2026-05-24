import { useState, useCallback } from 'react'

export function useToast() {
  const [msg, setMsg] = useState(null)

  const toast = useCallback((text = 'Guardado') => {
    setMsg(text)
    setTimeout(() => setMsg(null), 2200)
  }, [])

  const Toast = msg ? <div className="adm-toast">{msg}</div> : null

  return { toast, Toast }
}
