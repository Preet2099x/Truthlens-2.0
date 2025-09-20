import { useParams, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Share, Download, Bookmark, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import CredibilityDial from '@/components/CredibilityDial';

// Interface for the API response data
interface ApiResponse {
  // Common fields for all API responses
  verdict?: string;
  explanation?: string;
  
  // Text/Voice API response fields
  claim?: string;
  
  // OCR API response fields
  rawText?: string;
  extractedText?: string;
  factCheck?: {
    verdict: string;
    explanation: string;
  };
  
  // Crawler API response fields
  url?: string;
  title?: string;
  summary?: string;
  extractedClaims?: string[];
  verifiedClaim?: string;
}

interface LocationState {
  type: string;
  content: string;
  result: ApiResponse;
  timestamp: number;
}

export default function ReportViewer() {
  const { reportId } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Handle case where no state is passed (direct URL access)
  if (!state || !state.result) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border border-border">
            <CardContent className="py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Analysis Data Found</h2>
              <p className="text-muted-foreground mb-6">
                This report link appears to be invalid or the analysis data is no longer available.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { type, content, result } = state;
  
  // Parse the verdict and explanation based on API response structure
  const getVerdict = () => {
    if (result.factCheck) {
      return result.factCheck.verdict.toLowerCase();
    }
    if (result.verdict) {
      return result.verdict.toLowerCase();
    }
    return 'unverified';
  };
  
  const getExplanation = () => {
    if (result.factCheck) {
      return result.factCheck.explanation;
    }
    if (result.explanation) {
      return result.explanation;
    }
    return 'Analysis completed. Please review the content carefully.';
  };
  
  const getAnalyzedContent = () => {
    switch (type) {
      case 'text':
      case 'voice':
        return content;
      case 'image':
        return result.extractedText || result.rawText || content;
      case 'url':
        return result.summary || content;
      default:
        return content;
    }
  };
  
  const getCredibilityScore = (verdict: string) => {
    switch (verdict) {
      case 'real':
      case 'true':
        return 85;
      case 'fake':
      case 'scam':
        return 15;
      case 'misleading':
        return 30;
      case 'uncertain':
      case 'unverified':
        return 50;
      default:
        return 50;
    }
  };

  const verdict = getVerdict();
  const explanation = getExplanation();
  const analyzedContent = getAnalyzedContent();
  const score = getCredibilityScore(verdict);
  
  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return {
          label: 'Verified True',
          icon: CheckCircle,
          bgColor: 'bg-safe',
          textColor: 'text-safe-foreground',
          borderColor: 'border-safe'
        };
      case 'misleading':
        return {
          label: 'Misleading',
          icon: AlertTriangle,
          bgColor: 'bg-scam',
          textColor: 'text-scam-foreground',
          borderColor: 'border-scam'
        };
      case 'unverified':
        return {
          label: 'Unverified',
          icon: AlertCircle,
          bgColor: 'bg-unverified',
          textColor: 'text-unverified-foreground',
          borderColor: 'border-unverified'
        };
      default:
        return {
          label: 'Needs Review',
          icon: Shield,
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          borderColor: 'border-muted'
        };
    }
  };

  const verdictConfig = getVerdictConfig(verdict);
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <Badge className={`${verdictConfig.bgColor} ${verdictConfig.textColor} px-4 py-2`}>
                      <VerdictIcon className="h-4 w-4 mr-2" />
                      {verdictConfig.label}
                    </Badge>
                    <CardTitle className="text-xl font-semibold">Analysis Report</CardTitle>
                  </div>
                  <CredibilityDial score={score} size="md" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Analyzed Content:</h3>
                  <p className="text-muted-foreground bg-surface-2 p-4 rounded-lg border border-border">
                    "{analyzedContent}"
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="summary">
                    <AccordionTrigger>Summary & Assessment</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-muted-foreground">{explanation}</p>
                      
                      {/* Show additional details based on analysis type */}
                      {type === 'image' && result.rawText && (
                        <div className="mt-4">
                          <h4 className="font-medium text-foreground mb-2">Raw OCR Text:</h4>
                          <p className="text-sm text-muted-foreground bg-surface p-3 rounded border border-border">
                            {result.rawText}
                          </p>
                        </div>
                      )}
                      
                      {type === 'url' && (
                        <div className="space-y-3">
                          {result.title && (
                            <div>
                              <h4 className="font-medium text-foreground mb-1">Page Title:</h4>
                              <p className="text-sm text-muted-foreground">{result.title}</p>
                            </div>
                          )}
                          
                          {result.extractedClaims && result.extractedClaims.length > 0 && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">Extracted Claims:</h4>
                              <ul className="space-y-1">
                                {result.extractedClaims.map((claim, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">
                                    • {claim}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {result.verifiedClaim && (
                            <div>
                              <h4 className="font-medium text-foreground mb-1">Verified Claim:</h4>
                              <p className="text-sm text-muted-foreground bg-surface p-3 rounded border border-border">
                                {result.verifiedClaim}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="technical">
                    <AccordionTrigger>Technical Details</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Analysis Type</h4>
                          <p className="text-sm text-muted-foreground capitalize">{type}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Verdict</h4>
                          <p className="text-sm text-muted-foreground capitalize">{verdict}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Processed At</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(state.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Content Length</h4>
                          <p className="text-sm text-muted-foreground">
                            {analyzedContent.length} characters
                          </p>
                        </div>
                      </div>
                      
                      {/* Show raw API response for debugging */}
                      <div className="mt-6">
                        <h4 className="font-medium text-foreground mb-2">Raw API Response</h4>
                        <pre className="text-xs text-muted-foreground bg-surface p-3 rounded border border-border overflow-auto max-h-48">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">How to Verify Yourself</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Check the original source and publication date</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Look for quotes from verified experts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Cross-reference with reputable news sources</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Be skeptical of sensational headlines</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-truth rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Check if other credible outlets report the same story</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Analysis Type</span>
                  <span className="text-sm font-medium text-foreground capitalize">{type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verdict</span>
                  <span className="text-sm font-medium text-foreground capitalize">{verdict}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Confidence Score</span>
                  <span className="text-sm font-medium text-foreground">{score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Content Length</span>
                  <span className="text-sm font-medium text-foreground">{analyzedContent.length} chars</span>
                </div>
                {type === 'url' && result.extractedClaims && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Claims Found</span>
                    <span className="text-sm font-medium text-foreground">{result.extractedClaims.length}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}