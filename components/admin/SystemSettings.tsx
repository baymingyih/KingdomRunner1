"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Database, 
  Shield, 
  Bell,
  Globe,
  Save
} from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input defaultValue="Kingdom Runners" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Description</label>
              <Input defaultValue="Global virtual running community united in faith" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Maintenance Mode</label>
                <p className="text-xs text-muted-foreground">Temporarily disable site access</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">User Registration</label>
                <p className="text-xs text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Two-Factor Authentication</label>
                <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Session Timeout</label>
                <p className="text-xs text-muted-foreground">Auto-logout inactive users</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration (hours)</label>
              <Input type="number" defaultValue="24" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Login Attempts</label>
              <Input type="number" defaultValue="5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-muted-foreground">Send system notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Event Reminders</label>
                <p className="text-xs text-muted-foreground">Notify users about upcoming events</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input type="email" defaultValue="admin@kingdomrunners.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Backup</label>
                <p className="text-xs text-muted-foreground">Automatically backup database</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Backup Frequency (days)</label>
              <Input type="number" defaultValue="7" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Retention (days)</label>
              <Input type="number" defaultValue="365" />
            </div>
            
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Create Backup Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}