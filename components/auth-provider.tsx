"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    // Recuperar login ao carregar a página
    initAuth()
  }, [initAuth])

  return <>{children}</>
}