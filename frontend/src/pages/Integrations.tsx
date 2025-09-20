import { useState } from 'react';
import { MessageCircle, Send, Chrome, Twitter, Shield, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IntegrationCard from '@/components/IntegrationCard';
import ModeToggle, { AnalysisMode } from '@/components/ModeToggle';
import { useToast } from '@/hooks/use-toast';

interface IntegrationStatus {
  whatsapp: 'connected' | 'disconnected' | 'pending';
  telegram: 'connected' | 'disconnected' | 'pending';
  chrome: 'connected' | 'disconnected' | 'pending';
  twitter: 'connected' | 'disconnected' | 'pending';
}

interface IntegrationSettings {
  whatsapp: boolean;
  telegram: boolean;
  chrome: boolean;
  twitter: boolean;
  fakeDetection: boolean;
  scamDetection: boolean;
  realTimeAlerts: boolean;
}

export default function Integrations() {
  const { toast } = useToast();
  const [mode, setMode] = useState<AnalysisMode>('multimodal');
  
  const [status, setStatus] = useState<IntegrationStatus>({
    whatsapp: 'disconnected',
    telegram: 'connected',
    chrome: 'connected',
    twitter: 'disconnected'
  });

  const [settings, setSettings] = useState<IntegrationSettings>({
    whatsapp: false,
    telegram: true,
    chrome: true,
    twitter: false,
    fakeDetection: true,
    scamDetection: true,
    realTimeAlerts: true
  });

  const [webhookUrls, setWebhookUrls] = useState({
    whatsapp: '',
    telegram: '',
    twitter: ''
  });

  const handleIntegrationToggle = (integration: keyof IntegrationSettings, enabled: boolean) => {
    setSettings(prev => ({ ...prev, [integration]: enabled }));
    
    if (enabled && status[integration as keyof IntegrationStatus] !== 'connected') {
      toast({
        title: "Integration Required",
        description: "Connect to Supabase to enable backend integrations",
        variant: "default"
      });
    }
  };

  const handleConnectIntegration = (integration: keyof IntegrationStatus) => {
    setStatus(prev => ({ ...prev, [integration]: 'pending' }));
    
    // Simulate connection
    setTimeout(() => {
      setStatus(prev => ({ ...prev, [integration]: 'connected' }));
      toast({
        title: "Integration Connected",
        description: `${integration.charAt(0).toUpperCase() + integration.slice(1)} integration is now active`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Integrations & Settings
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your favorite platforms and configure detection settings
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>
          </div>

          <Tabs defaultValue="platforms" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="detection">Detection</TabsTrigger>
              <TabsTrigger value="extension">Extension</TabsTrigger>
            </TabsList>

            {/* Platform Integrations */}
            <TabsContent value="platforms" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <IntegrationCard
                  title="WhatsApp Bot"
                  description="Verify messages and media shared in WhatsApp chats with real-time analysis"
                  icon={<MessageCircle className="h-5 w-5 text-safe" />}
                  status={status.whatsapp}
                  isEnabled={settings.whatsapp}
                  onToggle={(enabled) => handleIntegrationToggle('whatsapp', enabled)}
                  onConfigure={() => handleConnectIntegration('whatsapp')}
                  stats={[
                    { label: 'Messages Analyzed', value: '0' },
                    { label: 'Scams Detected', value: '0' }
                  ]}
                  actionLabel="Connect Bot"
                  onAction={() => handleConnectIntegration('whatsapp')}
                />

                <IntegrationCard
                  title="Telegram Bot"
                  description="Deploy verification bot in Telegram groups and channels"
                  icon={<Send className="h-5 w-5 text-truth" />}
                  status={status.telegram}
                  isEnabled={settings.telegram}
                  onToggle={(enabled) => handleIntegrationToggle('telegram', enabled)}
                  onConfigure={() => {}}
                  stats={[
                    { label: 'Active Groups', value: '3' },
                    { label: 'Verifications Today', value: '24' }
                  ]}
                  actionLabel="Manage Bot"
                  onAction={() => {}}
                />

                <IntegrationCard
                  title="Twitter/X Monitor"
                  description="Real-time monitoring and verification of trending topics and viral content"
                  icon={<Twitter className="h-5 w-5 text-foreground" />}
                  status={status.twitter}
                  isEnabled={settings.twitter}
                  onToggle={(enabled) => handleIntegrationToggle('twitter', enabled)}
                  onConfigure={() => handleConnectIntegration('twitter')}
                  stats={[
                    { label: 'Tweets Monitored', value: '0' },
                    { label: 'Trends Verified', value: '0' }
                  ]}
                  actionLabel="Connect API"
                  onAction={() => handleConnectIntegration('twitter')}
                />

                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-unverified" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Webhook Triggers</CardTitle>
                        <CardDescription>Configure external system notifications</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fake-webhook" className="text-sm font-medium">
                        Fake News Detection Webhook
                      </Label>
                      <Input
                        id="fake-webhook"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scam-webhook" className="text-sm font-medium">
                        Scam Detection Webhook
                      </Label>
                      <Input
                        id="scam-webhook"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="text-sm"
                      />
                    </div>
                    <Button size="sm" className="w-full">
                      Test Webhooks
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Detection Settings */}
            <TabsContent value="detection" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-truth" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Detection Triggers</CardTitle>
                        <CardDescription>Configure automatic detection alerts</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-foreground">
                          Fake News Detection
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Auto-detect misleading content patterns
                        </p>
                      </div>
                      <Switch
                        checked={settings.fakeDetection}
                        onCheckedChange={(checked) => handleIntegrationToggle('fakeDetection', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-foreground">
                          Scam Detection
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Identify fraudulent schemes and phishing
                        </p>
                      </div>
                      <Switch
                        checked={settings.scamDetection}
                        onCheckedChange={(checked) => handleIntegrationToggle('scamDetection', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-foreground">
                          Real-time Alerts
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Instant notifications for threats
                        </p>
                      </div>
                      <Switch
                        checked={settings.realTimeAlerts}
                        onCheckedChange={(checked) => handleIntegrationToggle('realTimeAlerts', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-scam" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Alert Thresholds</CardTitle>
                        <CardDescription>Configure detection sensitivity levels</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Credibility Threshold</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <div className="flex-1 bg-surface-3 rounded-full h-2 relative">
                          <div className="bg-scam h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alert when credibility drops below 25%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Scam Similarity</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">0%</span>
                        <div className="flex-1 bg-surface-3 rounded-full h-2 relative">
                          <div className="bg-unverified h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">100%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alert when similarity exceeds 75%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chrome Extension */}
            <TabsContent value="extension" className="space-y-6">
              <Card className="border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center">
                      <Chrome className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Truthlens Chrome Extension</CardTitle>
                      <CardDescription>
                        Right-click any content to verify with Truthlens AI
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-surface-2 border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">How it works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                        Highlight any text on any webpage
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                        Right-click and select "Check with Truthlens"
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                        Get instant credibility analysis in a popup
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                        View detailed report with one click
                      </li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">Extension Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Installation Status</span>
                          <span className="text-sm text-safe font-medium">Connected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Version</span>
                          <span className="text-sm text-muted-foreground">v1.0.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Checks Today</span>
                          <span className="text-sm text-foreground font-semibold">47</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Scams Blocked</span>
                          <span className="text-sm text-scam font-semibold">3</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full" variant="outline">
                          Download Extension
                        </Button>
                        <Button className="w-full" variant="outline">
                          View Extension Guide  
                        </Button>
                        <Button className="w-full" variant="outline">
                          Report Extension Issue
                        </Button>
                        <Button className="w-full" variant="outline">
                          Extension Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}