import { useState } from 'react';
import { FileText, Mic, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type AnalysisMode = 'text-only' | 'voice-first' | 'multimodal';

interface ModeToggleProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const modes = [
  {
    id: 'text-only' as const,
    name: 'Text Only',
    description: 'Focus on text analysis',
    icon: FileText,
    color: 'text-truth'
  },
  {
    id: 'voice-first' as const,
    name: 'Voice First', 
    description: 'Prioritize voice input',
    icon: Mic,
    color: 'text-safe'
  },
  {
    id: 'multimodal' as const,
    name: 'Multi-modal',
    description: 'All input types',
    icon: Zap,
    color: 'text-unverified'
  }
];

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Analysis Mode</h3>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              const isActive = mode === modeOption.id;
              
              return (
                <Button
                  key={modeOption.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onModeChange(modeOption.id)}
                  className={`flex flex-col h-auto p-3 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-surface-2'
                  }`}
                >
                  <Icon className={`h-4 w-4 mb-1 ${
                    isActive ? '' : modeOption.color
                  }`} />
                  <span className="text-xs font-medium">{modeOption.name}</span>
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {modes.find(m => m.id === mode)?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}