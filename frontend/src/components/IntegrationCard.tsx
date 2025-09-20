import { ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink } from 'lucide-react';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure?: () => void;
  stats?: {
    label: string;
    value: string | number;
  }[];
  actionLabel?: string;
  onAction?: () => void;
}

export default function IntegrationCard({
  title,
  description,
  icon,
  status,
  isEnabled,
  onToggle,
  onConfigure,
  stats,
  actionLabel,
  onAction
}: IntegrationCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          label: 'Connected',
          className: 'bg-safe text-safe-foreground'
        };
      case 'pending':
        return {
          label: 'Connecting...',
          className: 'bg-unverified text-unverified-foreground'
        };
      default:
        return {
          label: 'Disconnected',
          className: 'bg-surface-3 text-muted-foreground'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card className="border border-border hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge className={`mt-1 ${statusConfig.className}`}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>
          <Switch
            checked={isEnabled && status === 'connected'}
            onCheckedChange={onToggle}
            disabled={status !== 'connected'}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {onConfigure && (
            <Button variant="outline" size="sm" onClick={onConfigure}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
          {onAction && actionLabel && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAction}
              disabled={status !== 'connected'}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}