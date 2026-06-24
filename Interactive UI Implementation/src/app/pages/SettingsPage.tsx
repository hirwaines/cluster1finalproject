import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useApp } from '../context/AppContext';
import { User, Shield, Globe, Sparkles, LogOut, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [activeSection, setActiveSection] = useState('account');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const sections = [
    { id: 'account', icon: User, label: 'Account', description: 'Name, ORCID, affiliation' },
    { id: 'privacy', icon: Shield, label: 'Privacy', description: 'Visibility & data sharing' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Email digest, in-app alerts' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme & accent color' },
    { id: 'language', icon: Globe, label: 'Language & region', description: 'English (UK) · Europe/London' },
    { id: 'ai', icon: Sparkles, label: 'AI preferences', description: 'Match sensitivity, recommendations' },
  ];

  return (
    <ResearcherLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {sections.map(section => {
            const Icon = section.icon;

            return (
              <Card
                key={section.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  activeSection === section.id ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Settings Content */}
        <Card className="p-8 mt-8">
          {activeSection === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue={user.name} className="mt-2" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={user.email} type="email" className="mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>ORCID iD</Label>
                  <Input defaultValue={user.orcid || '0000-0001-2345-6789'} className="mt-2" />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input defaultValue={user.institution} className="mt-2" />
                </div>
              </div>

              <div>
                <Label>Department</Label>
                <Input defaultValue={user.department} className="mt-2" />
              </div>

              <Button className="bg-blue-900 hover:bg-blue-950">
                Save changes
              </Button>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Profile Visibility</div>
                    <div className="text-sm text-gray-600">Control who can see your profile</div>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="institution">Institution only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Show Publication Metrics</div>
                    <div className="text-sm text-gray-600">Display citations and h-index publicly</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Allow Collaboration Requests</div>
                    <div className="text-sm text-gray-600">Let other researchers contact you</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Share Research Data</div>
                    <div className="text-sm text-gray-600">Contribute to AI training and analytics</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Email Digest</div>
                    <div className="text-sm text-gray-600">Weekly summary of research updates</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Collaboration Requests</div>
                    <div className="text-sm text-gray-600">Get notified of new requests</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Trending Topics</div>
                    <div className="text-sm text-gray-600">Alerts for emerging research trends</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Funding Opportunities</div>
                    <div className="text-sm text-gray-600">New grants matching your expertise</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Appearance</h2>

              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 border-2 border-blue-800 cursor-pointer">
                    <div className="aspect-video bg-white rounded mb-2" />
                    <div className="font-medium text-center">Light</div>
                  </Card>
                  <Card className="p-4 border-2 border-transparent hover:border-gray-300 cursor-pointer">
                    <div className="aspect-video bg-gray-900 rounded mb-2" />
                    <div className="font-medium text-center">Dark</div>
                  </Card>
                  <Card className="p-4 border-2 border-transparent hover:border-gray-300 cursor-pointer">
                    <div className="aspect-video from-gray-900 to-white rounded mb-2" />
                    <div className="font-medium text-center">Auto</div>
                  </Card>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Accent Color</Label>
                <div className="flex gap-3">
                  {['blue', 'green', 'purple', 'orange', 'red'].map(color => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-full border-2 ${
                        color === 'blue' ? 'border-blue-800' : 'border-transparent hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Language & Region</h2>

              <div>
                <Label>Language</Label>
                <Select defaultValue="en-uk" className="mt-2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-uk">English (UK)</SelectItem>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Time Zone</Label>
                <Select defaultValue="europe-london" className="mt-2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe-london">Europe/London</SelectItem>
                    <SelectItem value="america-new-york">America/New York</SelectItem>
                    <SelectItem value="america-los-angeles">America/Los Angeles</SelectItem>
                    <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">AI Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Match Sensitivity</div>
                    <div className="text-sm text-gray-600">How strict should collaboration matching be?</div>
                  </div>
                  <Select defaultValue="balanced">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict (90%+)</SelectItem>
                      <SelectItem value="balanced">Balanced (70%+)</SelectItem>
                      <SelectItem value="exploratory">Exploratory (50%+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Cross-Disciplinary Suggestions</div>
                    <div className="text-sm text-gray-600">Show matches outside your primary field</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Trending Topic Alerts</div>
                    <div className="text-sm text-gray-600">AI-powered trend notifications</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Switch Workspace & Sign Out */}
        <Card className="p-6 mt-6">
          <div className="space-y-4">
            <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="font-medium mb-1">Switch workspace</div>
              <div className="text-sm text-gray-600">Quickly jump to a different role view.</div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left p-4 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign out</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </ResearcherLayout>
  );
}
