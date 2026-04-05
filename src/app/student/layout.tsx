import { StudentSidebar } from "@/components/student/sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#22c55e]/30">
      <StudentSidebar />
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-10 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
