import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom React Hook to manage WebSocket connection lifecycle.
 * Binds active socket listeners and provides status states and send helpers.
 */
export function useWebSocket(sessionId, isEnabled, onMessageCallback) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    if (!isEnabled || !sessionId) {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      setIsConnected(false)
      return
    }

    // Determine WS Connection URLs
    const host = window.location.host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const envWsUrl = import.meta.env.VITE_WS_URL
    let wsUrl

    if (envWsUrl) {
      const cleanUrl = envWsUrl.replace(/^http/, 'ws')
      wsUrl = `${cleanUrl}/ws/session/${sessionId}`
    } else {
      wsUrl = `${protocol}//${host}/ws/session/${sessionId}`
    }

    console.log('[WS Hook] Connecting to:', wsUrl)

    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        setIsConnected(true)
        console.log('[WS Hook] Connected.')
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (onMessageCallback) {
            onMessageCallback(data)
          }
        } catch (e) {
          // Skip formatting issues
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log('[WS Hook] Connection closed.')
      }

      ws.onerror = (err) => {
        console.error('[WS Hook] Connection error:', err)
        setIsConnected(false)
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WS Hook] Connection setup failure:', err)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [sessionId, isEnabled, onMessageCallback])

  // Helper send handler
  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data))
    } else {
      console.warn('[WS Hook] Cannot send message, WebSocket is not open.')
    }
  }, [])

  return { isConnected, send }
}

export default useWebSocket
