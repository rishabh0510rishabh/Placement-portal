"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Building2, CheckCircle2, AlertCircle, Info, Check } from "lucide-react"

type NotificationType = "job" | "application" | "shortlist" | "info"

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "job",
    title: "New Job Posting",
    message: "TCS has posted a new opening for Software Developer position. Apply before Apr 15, 2026.",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    type: "shortlist",
    title: "Shortlisted",
    message: "Congratulations! You have been shortlisted for the interview at HCL Technologies.",
    time: "1 day ago",
    isRead: false,
  },
  {
    id: "3",
    type: "application",
    title: "Application Update",
    message: "Your application for System Engineer at Infosys is now under review.",
    time: "2 days ago",
    isRead: true,
  },
  {
    id: "4",
    type: "job",
    title: "New Job Posting",
    message: "Wipro has posted a new opening for Project Engineer position.",
    time: "3 days ago",
    isRead: true,
  },
  {
    id: "5",
    type: "info",
    title: "Placement Drive",
    message: "A new placement drive is scheduled for next week. Make sure your profile is complete.",
    time: "5 days ago",
    isRead: true,
  },
]

const typeConfig = {
  job: { icon: Building2, color: "text-primary" },
  application: { icon: AlertCircle, color: "text-warning" },
  shortlist: { icon: CheckCircle2, color: "text-success" },
  info: { icon: Info, color: "text-muted-foreground" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No new notifications"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon

            return (
              <Card
                key={notification.id}
                className={`bg-card border-border transition-colors ${
                  !notification.isRead ? "border-l-2 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-secondary shrink-0 ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{notification.title}</h3>
                            {!notification.isRead && (
                              <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="shrink-0"
                          >
                            Mark as read
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
