"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

function SignInForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // Auto-redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/dashboard-redirect"
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Namaste! Welcome back to RKGIT Portal.")
        // Use hard redirect to ensure session cookies are fully recognized by middleware
        const targetUrl = callbackUrl === "/" ? "/dashboard-redirect" : callbackUrl
        window.location.href = targetUrl
      }
    } catch (err) {
      toast.error("An unexpected server error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
      {/* Background with subtle glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#22c55e]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-4">
        {/* College Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="hover:scale-105 transition-transform duration-500">
            <Image
              src="https://erp.rkgit.edu.in/assets/img/logo-nbg.png"
              alt="RKGIT Logo"
              width={160}
              height={80}
              className="w-32 h-auto"
              priority
            />
          </Link>
        </div>

        <Card className="border-white/5 bg-white/[0.04] backdrop-blur-2xl shadow-[0_25px_80_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-4">
            <div className="mx-auto h-12 w-12 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#22c55e]/20">
               <ShieldCheck className="h-6 w-6 text-[#22c55e]" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Welcome Back</h1>
            <p className="text-base text-gray-500 mt-2 font-medium tracking-tight">Placement Portal Authentication Hub</p>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">College Credentials (Email)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="r.sharma@rkgit.edu.in"
                  className="bg-white/5 border-white/5 focus:border-[#22c55e]/50 text-white placeholder:text-gray-700 h-14 rounded-2xl transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" title="Password" className="text-[10px] uppercase font-black tracking-widest text-gray-500">Security Phrase</Label>
                  <Link href="#" className="text-[10px] font-black text-[#22c55e] hover:text-[#16a34a] transition-colors uppercase tracking-widest">Reset Key</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/5 focus:border-[#22c55e]/50 text-white placeholder:text-gray-700 h-14 rounded-2xl transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-lg transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : "Verify Identity"}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                  <span className="bg-[#0e0e0e] px-4 text-gray-600">Evaluation Phase Access</span>
                </div>
              </div>

              {/* Fixed Alignment Demo Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white h-12 text-xs font-bold rounded-xl transition-all"
                  onClick={() => {
                    setFormData({ email: "student@rkgit.edu.in", password: "password123" });
                  }}
                >
                  Student Access
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white h-12 text-xs font-bold rounded-xl transition-all"
                  onClick={() => {
                    setFormData({ email: "admin@rkgit.edu.in", password: "password123" });
                  }}
                >
                  Admin Terminal
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                {"Don't have an institutional account? "}
                <Link href="/auth/signup" className="text-[#22c55e] font-black hover:underline tracking-tight transition-all">
                  Onboard Here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="h-10 w-10 animate-spin text-[#22c55e]" />
       </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
