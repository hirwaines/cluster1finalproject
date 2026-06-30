import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { tabClass } from '../components/layout';
import { useApp } from '../context/AppContext';
import { LogOut, Save, Trash2, Shield, Users, ClipboardList, Monitor, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { UserPermission } from '../context/AppContext';

type TabType = 'users' | 'permissions' | 'audit' | 'sessions' | 'security';
type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'admin';

const ACTIONS: Action[] = ['create', 'read', 'update', 'delete', 'approve', 'admin'];
const RESOURCES = ['users', 'publications', 'reports', 'system', 'funding', 'research'];
const ROLES = ['admin', 'manager', 'department_head', 'researcher', 'funder'] as const;

export function UserSecurityManagement() {
  const navigate = useNavigate();
  const {
    user,
    researchers,
    auditLogs,
    userSessions,
    userPermissions,
    disableUser,
    deleteUser,
    updateUser,
    updateUserPermissions,
    terminateUserSession,
    createAuditLog,
    updateSecuritySettings,
    securitySettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Local edit state for selected user
  const [editRole, setEditRole] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editDirty, setEditDirty] = useState(false);

  // Local state for permissions tab
  const [localPermissions, setLocalPermissions] = useState<UserPermission[]>([]);
  const [permsDirty, setPermsDirty] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('admin');

  // Local state for security settings
  const [pwExpiry, setPwExpiry] = useState('90');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [loginLimit, setLoginLimit] = useState('5');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [auditEnabled, setAuditEnabled] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/admin/dashboard');
  }, [user, navigate]);

  // Sync security settings from context
  useEffect(() => {
    if (securitySettings) {
      setPwExpiry(String(securitySettings.passwordExpireDays ?? 90));
      setSessionTimeout(String(securitySettings.sessionTimeoutMinutes ?? 60));
      setLoginLimit(String(securitySettings.loginAttemptLimit ?? 5));
      setMfaEnabled(securitySettings.mfaEnabled ?? false);
      setEncryptionEnabled(securitySettings.dataEncryption ?? true);
      setAuditEnabled(securitySettings.auditLoggingEnabled ?? true);
    }
  }, [securitySettings]);

  // Sync permissions for selected role
  useEffect(() => {
    const permsForRole = userPermissions.filter(p => p.roleId === selectedRole);
    if (permsForRole.length === 0) {
      // Build default skeleton if no permissions defined yet
      setLocalPermissions(
        RESOURCES.map((res, i) => ({
          id: `${selectedRole}-${res}`,
          roleId: selectedRole,
          resource: res,
          actions: selectedRole === 'admin' ? [...ACTIONS] : ['read'],
        })),
      );
    } else {
      setLocalPermissions(permsForRole.map(p => ({ ...p, actions: [...p.actions] })));
    }
    setPermsDirty(false);
  }, [selectedRole, userPermissions]);

  if (!user || user.role !== 'admin') return null;

  const filteredResearchers = researchers.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const selectedUser = researchers.find(r => r.id === selectedUserId);

  function selectUser(id: string) {
    const u = researchers.find(r => r.id === id);
    if (!u) return;
    setSelectedUserId(id);
    setEditRole(u.role);
    setEditInstitution(u.institution ?? '');
    setEditDepartment(u.department ?? '');
    setEditDirty(false);
  }

  function handleSaveUser() {
    if (!selectedUser) return;
    updateUser(selectedUser.id, {
      role: editRole as typeof selectedUser.role,
      institution: editInstitution,
      department: editDepartment,
    });
    createAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'USER_UPDATED',
      resource: 'user',
      resourceId: selectedUser.id,
      timestamp: new Date().toISOString(),
      status: 'success',
    });
    setEditDirty(false);
    toast.success('User updated successfully');
  }

  function handleToggleDisable() {
    if (!selectedUser) return;
    disableUser(selectedUser.id, !selectedUser.disabled);
    toast.success(selectedUser.disabled ? 'User enabled' : 'User disabled');
  }

  function handleDeleteUser() {
    if (!selectedUser) return;
    if (!window.confirm(`Delete ${selectedUser.name}? This cannot be undone.`)) return;
    deleteUser(selectedUser.id);
    setSelectedUserId(null);
    toast.success('User deleted');
  }

  function toggleAction(permId: string, action: Action, checked: boolean) {
    setLocalPermissions(prev =>
      prev.map(p => {
        if (p.id !== permId) return p;
        const actions = checked
          ? ([...new Set([...p.actions, action])] as Action[])
          : (p.actions.filter(a => a !== action) as Action[]);
        return { ...p, actions };
      }),
    );
    setPermsDirty(true);
  }

  function handleSavePermissions() {
    updateUserPermissions(selectedRole, localPermissions);
    setPermsDirty(false);
    toast.success(`Permissions for ${selectedRole} saved`);
  }

  function handleSaveSecurity() {
    updateSecuritySettings({
      passwordExpireDays: Number(pwExpiry),
      sessionTimeoutMinutes: Number(sessionTimeout),
      loginAttemptLimit: Number(loginLimit),
      mfaEnabled,
      dataEncryption: encryptionEnabled,
      auditLoggingEnabled: auditEnabled,
    });
    toast.success('Security settings saved');
  }

  const TABS = [
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'permissions' as const, label: 'Permissions', icon: Shield },
    { id: 'audit' as const, label: 'Audit log', icon: ClipboardList },
    { id: 'sessions' as const, label: 'Sessions', icon: Monitor },
    { id: 'security' as const, label: 'Security', icon: Lock },
  ];

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={tabClass(activeTab === tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Sidebar list */}
          <div className="lg:col-span-1">
            <Card className="p-4 lg:sticky lg:top-20">
              <p className="text-sm font-semibold mb-3">Users ({filteredResearchers.length})</p>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {filteredResearchers.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectUser(r.id)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors ${
                      selectedUserId === r.id
                        ? 'border-brand bg-brand-muted'
                        : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge className="text-xs px-1.5 py-0">{r.role}</Badge>
                      {r.disabled && <Badge className="text-xs px-1.5 py-0 bg-destructive/10 text-destructive">Disabled</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Edit panel */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <Card className="p-6 space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>{selectedUser.role}</Badge>
                    {selectedUser.disabled && <Badge className="bg-destructive/10 text-destructive">Disabled</Badge>}
                    {selectedUser.verified && <Badge className="bg-brand-muted text-brand">Verified</Badge>}
                  </div>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Role</Label>
                    <Select
                      value={editRole}
                      onValueChange={v => { setEditRole(v); setEditDirty(true); }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="funder">Funder</SelectItem>
                        <SelectItem value="manager">Research Manager</SelectItem>
                        <SelectItem value="department_head">Department Head</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Institution</Label>
                    <Input
                      value={editInstitution}
                      onChange={e => { setEditInstitution(e.target.value); setEditDirty(true); }}
                      placeholder="University / Organisation"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Department</Label>
                    <Input
                      value={editDepartment}
                      onChange={e => { setEditDepartment(e.target.value); setEditDirty(true); }}
                      placeholder="Department"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Joined</Label>
                    <Input value={selectedUser.joinedDate ?? '—'} readOnly className="bg-muted/50" />
                  </div>
                </div>

                {/* Active sessions */}
                {userSessions.filter(s => s.userId === selectedUserId && s.active).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Active sessions</p>
                    <div className="space-y-2">
                      {userSessions
                        .filter(s => s.userId === selectedUserId && s.active)
                        .map(s => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                            <div>
                              <p className="text-sm font-medium">Session {s.id.slice(-6)}</p>
                              <p className="text-xs text-muted-foreground">{new Date(s.loginTime).toLocaleString()}</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => terminateUserSession(s.id)}>
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2 border-t">
                  <Button
                    onClick={handleSaveUser}
                    disabled={!editDirty}
                    className="flex-1 min-w-[120px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save changes
                  </Button>
                  <Button variant="outline" className="flex-1 min-w-[120px]" onClick={handleToggleDisable}>
                    {selectedUser.disabled ? 'Enable account' : 'Disable account'}
                  </Button>
                  <Button variant="outline" className="flex-1 min-w-[100px] text-destructive hover:text-destructive" onClick={handleDeleteUser}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 flex items-center justify-center min-h-64">
                <p className="text-muted-foreground">Select a user from the list to edit their account</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── PERMISSIONS TAB ────────────────────────────────────────────────── */}
      {activeTab === 'permissions' && (
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Role to configure</p>
                <p className="text-xs text-muted-foreground">Changes apply to all users with this role</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r} value={r}>{r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSavePermissions} disabled={!permsDirty}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </Card>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resource</th>
                  {ACTIONS.map(a => (
                    <th key={a} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {localPermissions.map(perm => (
                  <tr key={perm.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium capitalize text-sm">{perm.resource}</td>
                    {ACTIONS.map(action => (
                      <td key={action} className="px-3 py-3 text-center">
                        <Checkbox
                          checked={perm.actions.includes(action)}
                          onCheckedChange={(checked) => toggleAction(perm.id, action, !!checked)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {permsDirty && (
            <div className="flex justify-end">
              <Button onClick={handleSavePermissions}>
                <Save className="w-4 h-4 mr-2" />
                Save permissions for {selectedRole}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── AUDIT LOG TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Audit log ({auditLogs.length} entries)</h2>
          </div>
          <div className="divide-y divide-border">
            {auditLogs.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No audit entries yet</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="flex items-start justify-between gap-4 px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.userName} — {log.resource} ({log.resourceId})
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <Badge className={log.status === 'success' ? 'bg-brand-muted text-brand' : 'bg-destructive/10 text-destructive'}>
                    {log.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* ── SESSIONS TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'sessions' && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Active sessions ({userSessions.filter(s => s.active).length})</h2>
          </div>
          <div className="divide-y divide-border">
            {userSessions.filter(s => s.active).length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No active sessions</p>
            ) : (
              userSessions
                .filter(s => s.active)
                .map(session => {
                  const su = researchers.find(r => r.id === session.userId);
                  return (
                    <div key={session.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div>
                        <p className="text-sm font-medium">{su?.name ?? 'Unknown user'}</p>
                        <p className="text-xs text-muted-foreground">Login: {new Date(session.loginTime).toLocaleString()}</p>
                        {session.lastActivity && (
                          <p className="text-xs text-muted-foreground">Last active: {session.lastActivity}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { terminateUserSession(session.id); toast.success('Session terminated'); }}
                      >
                        Terminate
                      </Button>
                    </div>
                  );
                })
            )}
          </div>
        </Card>
      )}

      {/* ── SECURITY SETTINGS TAB ──────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <Card className="p-6 max-w-2xl space-y-6">
          <h2 className="text-base font-semibold">System security settings</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Password expiration (days)</Label>
              <Input type="number" min={7} max={365} value={pwExpiry} onChange={e => setPwExpiry(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Session timeout (minutes)</Label>
              <Input type="number" min={5} max={480} value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Max login attempts before lockout</Label>
              <Input type="number" min={3} max={20} value={loginLimit} onChange={e => setLoginLimit(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={mfaEnabled} onCheckedChange={v => setMfaEnabled(!!v)} />
              <span className="text-sm font-medium">Require MFA for all users</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={encryptionEnabled} onCheckedChange={v => setEncryptionEnabled(!!v)} />
              <span className="text-sm font-medium">Data encryption enabled</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={auditEnabled} onCheckedChange={v => setAuditEnabled(!!v)} />
              <span className="text-sm font-medium">Audit logging enabled</span>
            </label>
          </div>

          <Button className="w-full" onClick={handleSaveSecurity}>
            <Save className="w-4 h-4 mr-2" />
            Save security settings
          </Button>
        </Card>
      )}
    </>
  );
}
