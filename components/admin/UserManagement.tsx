"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Shield, 
  ShieldOff, 
  User,
  Mail,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import { getAllUsers, updateUserAdminStatus, type UserProfile } from '@/lib/db/users';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminDialog, setShowAdminDialog] = useState<{
    user: UserProfile;
    action: 'grant' | 'revoke';
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleAdminStatusChange = async (user: UserProfile, isAdmin: boolean) => {
    try {
      await updateUserAdminStatus(user.uid, isAdmin);
      
      // Update local state
      const updatedUsers = users.map(u =>
        u.uid === user.uid ? { ...u, isAdmin } : u
      );
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: `${user.firstName} ${user.lastName} ${isAdmin ? 'granted' : 'revoked'} admin privileges`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user admin status",
        variant: "destructive",
      });
    }
    setShowAdminDialog(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Badge variant="secondary">
          {users.length} total users
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredUsers.length} users found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.uid} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      {user.isAdmin && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{user.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {user.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        <span>{user.totalDistance} km • {user.totalPrayers} prayers</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {user.isAdmin ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdminDialog({ user, action: 'revoke' })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ShieldOff className="h-4 w-4 mr-1" />
                      Revoke Admin
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdminDialog({ user, action: 'grant' })}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No users have registered yet'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Admin Status Change Dialog */}
      <AlertDialog open={!!showAdminDialog} onOpenChange={() => setShowAdminDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showAdminDialog?.action === 'grant' ? 'Grant Admin Access' : 'Revoke Admin Access'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showAdminDialog?.action === 'grant' 
                ? `Are you sure you want to grant admin privileges to ${showAdminDialog.user.firstName} ${showAdminDialog.user.lastName}? They will have access to all admin features.`
                : `Are you sure you want to revoke admin privileges from ${showAdminDialog.user.firstName} ${showAdminDialog.user.lastName}? They will lose access to admin features.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showAdminDialog && handleAdminStatusChange(
                showAdminDialog.user, 
                showAdminDialog.action === 'grant'
              )}
              className={showAdminDialog?.action === 'revoke' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {showAdminDialog?.action === 'grant' ? 'Grant Admin' : 'Revoke Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}