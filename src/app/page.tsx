"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse " style={{ animationDelay: '2s' }} />
      </div>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage: "url('https://rkgit.edu.in/assets/images/slider/slide%201.jpeg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center px-6 w-full max-w-7xl mx-auto">
        {/* College Logo */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative bg-black/40 backdrop-blur-md p-6 rounded-full border border-white/10 shadow-2xl">
            <Image
              src="https://erp.rkgit.edu.in/assets/img/logo-nbg.png"
              alt="RKGIT Logo"
              width={160}
              height={80}
              className="w-32 h-auto"
              priority
            />
          </div>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            RKGIT <span className="text-[#22c55e]">Placements</span> Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            A premium placement ecosystem connecting the brightest minds 
            at RKGIT with industry leaders through streamlined, data-driven recruitment.
          </p>
        </div>

        {/* Action Buttons with Fixed Alignment */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto min-w-[280px]">
          <Button 
            asChild 
            className="w-full sm:w-48 h-14 text-base bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:-translate-y-0.5"
          >
            <Link href="/auth/signin" className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="w-full sm:w-48 h-14 text-base border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link href="/auth/signup" className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Join Portal
            </Link>
          </Button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 w-full text-center px-4">
        <p className="text-[10px] text-gray-600 font-semibold tracking-[0.3em] uppercase">
          Raj Kumar Goel Institute of Technology · Ghaziabad
        </p>
      </div>
    </div>
  )
}
