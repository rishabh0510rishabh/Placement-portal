import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-blue-500/30">
      <AdminSidebar />
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
