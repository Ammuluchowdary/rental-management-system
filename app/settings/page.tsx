"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Database, Bell, Mail, Shield, Palette, Download, Upload, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    smsAlerts: false,
    overdueNotifications: true,
    maintenanceAlerts: true,
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoBackup: true,
    showDemoData: false,
  })

  const dbConnected = isSupabaseConfigured()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your rental management system preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Database Status</p>
                  <p className="text-sm text-muted-foreground">
                    {dbConnected ? "Connected to Supabase" : "Using demo data"}
                  </p>
                </div>
                <Badge variant={dbConnected ? "default" : "secondary"} className="flex items-center gap-1">
                  {dbConnected ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      Demo Mode
                    </>
                  )}
                </Badge>
              </div>

              {!dbConnected && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Configure your Supabase database to enable full functionality. Check the SUPABASE_SETUP_GUIDE.md
                    file for instructions.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="db_url">Database URL</Label>
                  <Input
                    id="db_url"
                    placeholder="https://your-project.supabase.co"
                    value={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
                    disabled
                  />
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-sm text-muted-foreground">Send rent payment reminders via email</p>
                </div>
                <Switch
                  checked={notifications.emailReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailReminders: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Send urgent notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overdue Notifications</p>
                  <p className="text-sm text-muted-foreground">Alert when payments are overdue</p>
                </div>
                <Switch
                  checked={notifications.overdueNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, overdueNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify about maintenance requests</p>
                </div>
                <Switch
                  checked={notifications.maintenanceAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                </div>
                <Switch
                  checked={preferences.autoBackup}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoBackup: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium text-red-600">Danger Zone</p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. All data will be permanently deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Version</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">{preferences.autoBackup ? "Today, 2:00 AM" : "Never"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Flats</p>
                <p className="text-sm text-muted-foreground">20 units</p>
              </div>
              <div>
                <p className="text-sm font-medium">Active Tenants</p>
                <p className="text-sm text-muted-foreground">10 tenants</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Send Rent Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Database className="mr-2 h-4 w-4" />
                Backup Database
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help? Check out our documentation or contact support.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                View Documentation
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
