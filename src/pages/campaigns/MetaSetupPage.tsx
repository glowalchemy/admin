import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, Plus, Trash2, TestTube, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';

import { API_ORIGIN } from "@/lib/apiClient";
const API_BASE_URL = `${API_ORIGIN}/api`;

type MetaConfig = {
  _id: string;
  pixelId: string;
  pixelName: string;
  accessToken: string;
  testEventCode: string;
  capiEnabled: boolean;
  pixelEnabled: boolean;
  apiVersion: string;
  businessAccountId: string;
  domain: string;
  trackedEvents: string[];
  status: 'active' | 'inactive' | 'testing';
  lastTested: string;
  testResults: Record<string, unknown>;
  notes: string;
};

const MetaSetupPage = () => {
  const [configs, setConfigs] = useState<MetaConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<MetaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pixelId: '',
    pixelName: '',
    accessToken: '',
    testEventCode: '',
    capiEnabled: true,
    pixelEnabled: true,
    apiVersion: 'v19.0',
    businessAccountId: '',
    domain: '',
    trackedEvents: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'],
    notes: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/meta-config`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setConfigs(response.data.data);
        const active = response.data.data.find((c: MetaConfig) => c.status === 'active');
        setActiveConfig(active || null);
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/admin/meta-config`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setFormData({
        pixelId: '',
        pixelName: '',
        accessToken: '',
        testEventCode: '',
        capiEnabled: true,
        pixelEnabled: true,
        apiVersion: 'v19.0',
        businessAccountId: '',
        domain: '',
        trackedEvents: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'],
        notes: ''
      });
      loadConfigs();
    } catch (error) {
      console.error('Error creating config:', error);
    }
  };

  const handleTest = async (configId: string) => {
    try {
      setTesting(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/admin/meta-config/${configId}/test`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadConfigs();
    } catch (error) {
      console.error('Error testing config:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleActivate = async (configId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/admin/meta-config/${configId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadConfigs();
    } catch (error) {
      console.error('Error activating config:', error);
    }
  };

  const handleDelete = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/meta-config/${configId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadConfigs();
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const availableEvents = [
    'PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 
    'Purchase', 'Lead', 'CustomEvent', 'Search', 'Contact'
  ];

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      trackedEvents: prev.trackedEvents.includes(event)
        ? prev.trackedEvents.filter(e => e !== event)
        : [...prev.trackedEvents, event]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meta Pixel & CAPI Setup</h1>
          <p className="text-muted-foreground">Configure your Meta Pixel and Conversions API integration</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Configuration'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Configuration</CardTitle>
            <CardDescription>
              Set up your Meta Pixel and Conversions API for enhanced tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pixelId">Pixel ID *</Label>
                  <Input
                    id="pixelId"
                    placeholder="e.g., 1851696042154850"
                    value={formData.pixelId}
                    onChange={(e) => setFormData({...formData, pixelId: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixelName">Pixel Name</Label>
                  <Input
                    id="pixelName"
                    placeholder="e.g., My Website Pixel"
                    value={formData.pixelName}
                    onChange={(e) => setFormData({...formData, pixelName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token *</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Your Meta Access Token"
                  value={formData.accessToken}
                  onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Generate this from Meta Business Settings → Events Manager → Conversions API
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testEventCode">Test Event Code (Optional)</Label>
                <Input
                  id="testEventCode"
                  placeholder="e.g., TEST12345"
                  value={formData.testEventCode}
                  onChange={(e) => setFormData({...formData, testEventCode: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Use this to test events without affecting real data
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Select value={formData.apiVersion} onValueChange={(value) => setFormData({...formData, apiVersion: value})}>
                    <SelectTrigger id="apiVersion">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v18.0">v18.0</SelectItem>
                      <SelectItem value="v19.0">v19.0</SelectItem>
                      <SelectItem value="v20.0">v20.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="yourdomain.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="capiEnabled"
                    checked={formData.capiEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, capiEnabled: checked})}
                  />
                  <Label htmlFor="capiEnabled">Enable Conversions API (CAPI)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pixelEnabled"
                    checked={formData.pixelEnabled}
                    onCheckedChange={(checked) => setFormData({...formData, pixelEnabled: checked})}
                  />
                  <Label htmlFor="pixelEnabled">Enable Browser Pixel</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tracked Events</Label>
                <div className="flex flex-wrap gap-2">
                  {availableEvents.map(event => (
                    <Badge
                      key={event}
                      variant={formData.trackedEvents.includes(event) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEvent(event)}
                    >
                      {formData.trackedEvents.includes(event) && <CheckCircle className="h-3 w-3 mr-1" />}
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this configuration..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Configuration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Configuration</TabsTrigger>
          <TabsTrigger value="all">All Configurations</TabsTrigger>
          <TabsTrigger value="guide">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeConfig ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      {activeConfig.pixelName || 'Active Configuration'}
                    </CardTitle>
                    <CardDescription>Pixel ID: {activeConfig.pixelId}</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pixel ID</p>
                    <p className="font-medium">{activeConfig.pixelId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Version</p>
                    <p className="font-medium">{activeConfig.apiVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CAPI Status</p>
                    <Badge variant={activeConfig.capiEnabled ? "default" : "secondary"}>
                      {activeConfig.capiEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pixel Status</p>
                    <Badge variant={activeConfig.pixelEnabled ? "default" : "secondary"}>
                      {activeConfig.pixelEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tracked Events</p>
                  <div className="flex flex-wrap gap-2">
                    {activeConfig.trackedEvents.map(event => (
                      <Badge key={event} variant="outline">{event}</Badge>
                    ))}
                  </div>
                </div>

                {activeConfig.lastTested && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Last Tested</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activeConfig.lastTested).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleTest(activeConfig._id)}
                    disabled={testing}
                    className="gap-2"
                  >
                    {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                    Test Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Configuration</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create and activate a Meta Pixel configuration to start tracking events
                </p>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Configuration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {configs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No configurations found</p>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Configuration
                </Button>
              </CardContent>
            </Card>
          ) : (
            configs.map((config) => (
              <Card key={config._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{config.pixelName || 'Configuration'}</CardTitle>
                      <CardDescription>Pixel ID: {config.pixelId}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.status === 'active' ? 'default' : 'secondary'}>
                        {config.status}
                      </Badge>
                      {config.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivate(config._id)}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>CAPI: {config.capiEnabled ? 'Enabled' : 'Disabled'}</span>
                      <span>Pixel: {config.pixelEnabled ? 'Enabled' : 'Disabled'}</span>
                      <span>Events: {config.trackedEvents.length}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTest(config._id)}
                        disabled={testing}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(config._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
              <CardDescription>Follow these steps to set up Meta Pixel and CAPI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Create a Meta Pixel</h3>
                    <p className="text-sm text-muted-foreground">
                      Go to Meta Events Manager and create a new pixel for your website
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Generate Access Token</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a system user in Meta Business Manager and generate an access token with appropriate permissions
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Configure CAPI</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up Conversions API in your Meta Business settings and configure webhook endpoints
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Add Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the form above to add your Pixel ID and Access Token to Trozzi
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="font-semibold mb-1">Test Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the Test button to verify your configuration is working correctly
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetaSetupPage;