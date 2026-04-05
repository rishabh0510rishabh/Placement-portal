"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Sparkles, UserPlus } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.toLowerCase().endsWith("@rkgit.edu.in")) {
      toast.error("Only @rkgit.edu.in email addresses are allowed for registration.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registration failed")
      } else {
        toast.success("Account created successfully! Please sign in.")
        router.push("/auth/signin")
      }
    } catch (err) {
      toast.error("An unexpected server error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
      {/* Background Glow */}
      <div className="absolute top-[20%] right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

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
            <div className="mx-auto h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
               <UserPlus className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Create Account</h1>
            <p className="text-base text-gray-500 mt-2 font-medium tracking-tight">Join the RKGIT Recruitment Hub</p>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Legal Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Rohan Sharma"
                  className="bg-white/5 border-white/5 focus:border-blue-500/50 text-white placeholder:text-gray-700 h-14 rounded-2xl transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Institutional Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="r.sharma@rkgit.edu.in"
                  className="bg-white/5 border-white/5 focus:border-blue-500/50 text-white placeholder:text-gray-700 h-14 rounded-2xl transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <div className="flex items-center gap-2 px-1">
                   <Sparkles className="h-3 w-3 text-amber-500" />
                   <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Must end with @rkgit.edu.in</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" title="Password" className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/5 focus:border-blue-500/50 text-white placeholder:text-gray-700 h-14 pr-12 rounded-2xl transition-all"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" title="Confirm Password" className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/5 focus:border-blue-500/50 text-white placeholder:text-gray-700 h-14 rounded-2xl transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-lg transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : "Create Identity"}
              </Button>

              <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                Already have an institutional account?{" "}
                <Link href="/auth/signin" className="text-[#22c55e] font-black hover:underline tracking-tight transition-all">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
