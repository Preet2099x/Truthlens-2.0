import { useState, useEffect } from 'react';

interface CredibilityDialProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function CredibilityDial({ score, size = 'md', animated = true }: CredibilityDialProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const strokeWidths = {
    sm: 4,
    md: 6,
    lg: 8
  };

  const radius = {
    sm: 28,
    md: 42,
    lg: 56
  }[size];

  const strokeWidth = strokeWidths[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        const increment = score / 50; // Animate over ~50 frames
        const interval = setInterval(() => {
          setDisplayScore(prev => {
            if (prev >= score) {
              clearInterval(interval);
              return score;
            }
            return Math.min(prev + increment, score);
          });
        }, 20);
        
        return () => clearInterval(interval);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-safe';
    if (score >= 60) return 'text-truth';
    if (score >= 40) return 'text-unverified';
    return 'text-scam';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return 'stroke-safe';
    if (score >= 60) return 'stroke-truth'; 
    if (score >= 40) return 'stroke-unverified';
    return 'stroke-scam';
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface-3"
        />
        
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={getStrokeColor(score)}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: animated ? 'stroke-dashoffset 0.5s ease-in-out' : 'none'
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(score)}`}>
            {Math.round(displayScore)}%
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Credibility
          </div>
        </div>
      </div>
    </div>
  );
}