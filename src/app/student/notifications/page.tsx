"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Building2, CheckCircle2, AlertCircle, Info, Check, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/notifications")
      const result = await res.json()
      if (res.ok) {
        setNotifications(result.notifications || [])
      } else {
        toast.error("Failed to sync alert stream")
      }
    } catch (err) {
      toast.error("Telemetry link failed")
    } finally {
      setIsLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = async (id: string) => {
    // Local optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    // We could add a PATCH endpoint later if needed for persistence
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff} hours ago`;
    return d.toLocaleDateString();
  }

  const getIcon = (message: string) => {
    const msg = message.toLowerCase()
    if (msg.includes('shortlist') || msg.includes('congratulations') || msg.includes('hired')) return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    if (msg.includes('job') || msg.includes('posted') || msg.includes('opportunity')) return { icon: Building2, color: "text-primary", bg: "bg-primary/10" }
    if (msg.includes('rejected') || msg.includes('closed')) return { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" }
    return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" }
  }

  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Alerts</h1>
          <p className="text-gray-400 mt-1 font-light tracking-wide italic">
            {unreadCount > 0 ? `Intercepted ${unreadCount} new high-priority transmissions` : "No new transmissions detected"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2 rounded-xl border-white/10 hover:bg-white/5">
            <Check className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing Feed</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-white/5 border-white/10 border-dashed shadow-xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-24 opacity-30">
            <Bell className="h-20 w-20 mb-6" />
            <p className="text-xs font-black uppercase tracking-[0.4em]">No Logs Found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const config = getIcon(notification.message)
            const Icon = config.icon

            return (
              <Card
                key={notification.id}
                className={cn(
                  "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all shadow-xl backdrop-blur-sm group relative overflow-hidden cursor-pointer",
                  !notification.isRead && "border-l-4 border-l-primary"
                )}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={cn("p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500", config.bg, config.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white tracking-tight">System Transmission</h3>
                            {!notification.isRead && (
                              <Badge className="bg-primary text-black font-black text-[9px] uppercase tracking-widest rounded-full py-0.5 border-none">Priority</Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{notification.message}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.1em] pt-2">
                             <Clock className="h-3 w-3" />
                             {formatDate(notification.createdAt)}
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="shrink-0 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 border border-transparent hover:border-white/10"
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

