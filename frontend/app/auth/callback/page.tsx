// frontend/app/auth/callback/page.tsx
// GitHub OAuth ke baad yahan redirect hota hai — token save karta hai

"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error || !token) {
      router.push("/login?error=auth_failed")
      return
    }

    // JWT token save karo
    localStorage.setItem("flowci_token", token)

    // Dashboard pe bhejo
    router.push("/dashboard")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p>Logging you in...</p>
      </div>
    </div>
  )
}