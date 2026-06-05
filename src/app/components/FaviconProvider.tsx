'use client'

import { useEffect } from 'react'
import { getInstitucionPrincipal } from '@/services/ambientalService'
import { isCancelledError } from '@/utils/isCancelledError'

export default function FaviconProvider() {
  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchData = async () => {
      try {
        const data = await getInstitucionPrincipal(controller.signal)
        if (!isMounted) return
        
        const logo = data?.Descripcion?.institucion_logo
        const nombre = data?.Descripcion?.institucion_nombre
        if (!logo) return

        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
          ?? (() => {
            const el = document.createElement('link')
            el.rel = 'icon'
            document.head.appendChild(el)
            return el
          })()
        link.href = logo

        if (nombre) document.title = nombre
      } catch (error) {
        if (isCancelledError(error)) return
        console.error(error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return null
}