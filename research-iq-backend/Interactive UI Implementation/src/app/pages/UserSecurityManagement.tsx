import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, Shield, Users, Lock, LogOut, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

type TabType = 'users' | 'permissions' | 'audit' | 'sessions' | 'security';

export function UserSecurityManagement() {
  const navigate = useNavigate();
  const {
    user,
    researchers,
    auditLogs,
    userSessions,
    userPermissions,
    securitySettings,
    disableUser,
    deleteUser,
    terminateUserSession,
    terminateAllUserSessions,
    createAuditLog,
    updateSecuritySettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredResearchers = researchers.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = researchers.find(r => r.id === selectedUserId);
  const userPermissionsForRole = userPermissions.filter(p => p.roleId === selectedUser?.role);
  const userSessionsForSelected = selectedUserId
    ? userSessions.filter(s => s.userId === selectedUserId)
    : [];

  const handleDisableUser = (userId: string) => {
    disableUser(userId, !researchers.find(r => r.id === userId)?.disabled);
    createAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'USER_STATUS_CHANGED',
      resource: 'user',
      resourceId: userId,
      timestamp: new Date().toISOString(),
      status: 'success',
    });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    createAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'USER_DELETED',
      resource: 'user',
      resourceId: userId,
      timestamp: new Date().toISOString(),
      status: 'success',
    });
  };

  return (
    <AppShell>
    <div style={{ padding: '2rem' }}>
        <h1 className="text-4xl font-bold mb-2">User & Security Management</h1>
        <p className="text-gray-600 mb-8">Manage users, permissions, audit logs, and security settings</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {(['users', 'permissions', 'audit', 'sessions', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-800 text-blue-800'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-bold text-lg mb-4">Users ({filteredResearchers.length})</h3>
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredResearchers.map(researcher => (
                    <Card
                      key={researcher.id}
                      onClick={() => setSelectedUserId(researcher.id)}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedUserId === researcher.id
                          ? 'border-2 border-blue-800 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="font-medium text-sm line-clamp-1">{researcher.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{researcher.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-xs">{researcher.role}</Badge>
                        {researcher.disabled && <Badge className="text-xs bg-red-100 text-red-800">Disabled</Badge>}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            <div className="col-span-3">
              {selectedUser ? (
                <Card className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{selectedUser.role}</Badge>
                      {selectedUser.disabled && <Badge className="bg-red-100 text-red-800">Disabled</Badge>}
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Institution</div>
                      <div className="text-lg">{selectedUser.institution || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Department</div>
                      <div className="text-lg">{selectedUser.department || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Joined</div>
                      <div className="text-lg">{selectedUser.joinedDate || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Status</div>
                      <div className="text-lg">{selectedUser.disabled ? 'Disabled' : 'Active'}</div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="mb-8 pb-8 border-b">
                    <h3 className="font-bold mb-4">Verification Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedUser.verified} disabled />
                        <span>Email Verified</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedUser.accredited} disabled />
                        <span>Accredited / Approved</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="mb-8 pb-8 border-b">
                    <h3 className="font-bold mb-4">Active Sessions ({userSessionsForSelected.length})</h3>
                    {userSessionsForSelected.length > 0 ? (
                      <div className="space-y-3">
                        {userSessionsForSelected.map(session => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="text-sm">
                              <div className="font-medium">Session {session.id.slice(-8)}</div>
                              <div className="text-gray-600">
                                {new Date(session.loginTime).toLocaleString()}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => terminateUserSession(session.id)}
                            >
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No active sessions</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowPermissionsDialog(true)}
                      className="flex-1 bg-blue-800 hover:bg-blue-900"
                    >
                      View Permissions
                    </Button>
                    <Button
                      onClick={() => handleDisableUser(selectedUser.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      {selectedUser.disabled ? 'Enable User' : 'Disable User'}
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteUser(selectedUser.id);
                        setSelectedUserId(null);
                      }}
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 flex items-center justify-center min-h-96">
                  <p className="text-gray-500">Select a user to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* PERMISSIONS TAB */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            {userPermissions.map(perm => (
              <Card key={perm.id} className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg">{perm.roleId.toUpperCase()}</h3>
                  <p className="text-gray-600">Resource: {perm.resource}</p>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {['create', 'read', 'update', 'delete', 'approve', 'admin'].map(action => (
                    <div key={action} className="flex items-center gap-2">
                      <Checkbox checked={perm.actions.includes(action as any)} disabled />
                      <label className="text-sm capitalize cursor-pointer">{action}</label>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <Card className="p-6">
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="flex items-start justify-between p-4 border-b">
                  <div>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-sm text-gray-600">
                      {log.userName} on {log.resource} ({log.resourceId})
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{log.timestamp}</div>
                  </div>
                  <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <Card className="p-6">
            <h3 className="font-bold mb-6">All Active User Sessions ({userSessions.filter(s => s.active).length})</h3>
            <div className="space-y-3">
              {userSessions
                .filter(s => s.active)
                .map(session => {
                  const sessionUser = researchers.find(r => r.id === session.userId);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <div className="font-medium">{sessionUser?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">
                          Login: {new Date(session.loginTime).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Last: {session.lastActivity}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => terminateUserSession(session.id)}
                      >
                        Terminate
                      </Button>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}

        {/* SECURITY SETTINGS TAB */}
        {activeTab === 'security' && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-6">System Security Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <Label className="block mb-2">Password Expiration (days)</Label>
                  <Input type="number" placeholder="90" disabled defaultValue="90" />
                </div>
                <div className="p-4 border rounded">
                  <Label className="block mb-2">Session Timeout (minutes)</Label>
                  <Input type="number" placeholder="60" disabled defaultValue="60" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <Label className="block mb-2">Login Attempt Limit</Label>
                  <Input type="number" placeholder="5" disabled defaultValue="5" />
                </div>
                <div className="p-4 border rounded">
                  <Label className="block mb-2">MFA Enabled</Label>
                  <Checkbox disabled defaultChecked={false} />
                </div>
              </div>

              <div className="p-4 border rounded">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox disabled defaultChecked={true} />
                  <span>Data Encryption Enabled</span>
                </Label>
              </div>

              <div className="p-4 border rounded">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox disabled defaultChecked={true} />
                  <span>Audit Logging Enabled</span>
                </Label>
              </div>

              <Button className="w-full bg-blue-800 hover:bg-blue-900">
                Update Security Settings
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Permissions Dialog */}
      {showPermissionsDialog && selectedUser && (
        <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Permissions for {selectedUser.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userPermissionsForRole.map(perm => (
                <Card key={perm.id} className="p-4">
                  <div className="font-medium mb-2">{perm.resource}</div>
                  <div className="flex flex-wrap gap-2">
                    {perm.actions.map(action => (
                      <Badge key={action}>{action}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

