"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Code,
  FolderKanban,
  Briefcase,
  Link2,
  FileText,
  Building2,
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/student/profile", icon: User },
  { label: "Academic Details", href: "/student/academics", icon: GraduationCap },
  { label: "Skills", href: "/student/skills", icon: Code },
  { label: "Projects", href: "/student/projects", icon: FolderKanban },
  { label: "Work Experience", href: "/student/experience", icon: Briefcase },
  { label: "Professional Links", href: "/student/links", icon: Link2 },
  { label: "Resume Management", href: "/student/resume", icon: FileText },
  { label: "Job Listings", href: "/student/jobs", icon: Building2 },
  { label: "Applications", href: "/student/applications", icon: ClipboardList },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border md:transition-none transition-transform duration-200",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 min-h-16 px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://erp.rkgit.edu.in/assets/img/logo-nbg.png"
                alt="RKGIT Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-sm font-semibold text-sidebar-foreground leading-tight">
                RKGIT Placements<br />Portal
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                        isActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <Link href="/">
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
