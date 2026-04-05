"use client"
export const dynamic = "force-dynamic"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#22c55e]" />
        <p className="text-lg font-medium animate-pulse text-gray-400">Verifying authorization...</p>
      </div>
    </div>
  )
}
