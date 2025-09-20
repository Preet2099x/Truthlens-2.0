import { useState, useRef, useEffect } from 'react';
import { FileText, Image, Mic, Video, Link2, Upload, Loader2, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { verifyAPI } from '@/lib/api';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare const SpeechRecognition: {
  new (): SpeechRecognition;
};

export default function AnalyzeHub() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setVoiceTranscript(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Voice Recognition Error",
            description: "Failed to recognize speech. Please try again.",
            variant: "destructive",
          });
          setIsListening(false);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const handleAnalyze = async (type: string) => {
    if (!validateInput(type)) return;
    
    setIsAnalyzing(true);
    
    try {
      let response;
      
      switch (type) {
        case 'text':
          response = await verifyAPI.text(textContent);
          break;
        case 'image':
          if (!selectedFile) throw new Error('No image selected');
          response = await verifyAPI.image(selectedFile);
          break;
        case 'url':
          response = await verifyAPI.url(urlContent);
          break;
        case 'voice':
          response = await verifyAPI.text(voiceTranscript);
          break;
        case 'video':
          // For now, treat video like image (could be enhanced later)
          if (!selectedFile) throw new Error('No video selected');
          response = await verifyAPI.image(selectedFile);
          break;
        default:
          throw new Error('Unknown analysis type');
      }
      
      // Navigate to results with actual API response data
      navigate('/report/sample', { 
        state: { 
          type,
          content: getContentForType(type),
          result: response,
          timestamp: Date.now()
        }
      });
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${type} content`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({
        title: "Analysis Failed", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateInput = (type: string) => {
    switch (type) {
      case 'text':
        if (!textContent.trim()) {
          toast({
            title: "No Text Content",
            description: "Please enter some text to analyze.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 'voice':
        if (!voiceTranscript.trim()) {
          toast({
            title: "No Voice Content",
            description: "Please record some audio first.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 'image':
      case 'video':
        if (!selectedFile) {
          toast({
            title: "No File Selected",
            description: `Please select a ${type} file to analyze.`,
            variant: "destructive",
          });
          return false;
        }
        break;
      case 'url':
        if (!urlContent.trim()) {
          toast({
            title: "No URL Provided",
            description: "Please enter a URL to analyze.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const getContentForType = (type: string) => {
    switch (type) {
      case 'text': return textContent;
      case 'voice': return voiceTranscript;
      case 'url': return urlContent;
      case 'image': return selectedFile?.name || 'Image content';
      case 'video': return selectedFile?.name || 'Video content';
      default: return 'Sample content';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `Selected ${file.name}`,
      });
    }
  };

  const startVoiceRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start media recorder for audio file
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start speech recognition for real-time transcript
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
      
      toast({
        title: "Recording Started",
        description: "Speak now. Your voice is being recorded and transcribed.",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice recording.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    toast({
      title: "Recording Stopped",
      description: "Voice recording completed successfully.",
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const clearVoiceTranscript = () => {
    setVoiceTranscript('');
    toast({
      title: "Transcript Cleared",
      description: "Voice transcript has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Analyze Content
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload or input content across multiple formats for AI-powered verification
          </p>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Content Analysis</CardTitle>
            <CardDescription>
              Choose your input method and let our AI analyze the credibility
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Text Content</label>
                  <Textarea
                    placeholder="Paste the text content you want to analyze for misinformation..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </div>
                <Button 
                  onClick={() => handleAnalyze('text')}
                  disabled={!textContent.trim() || isAnalyzing}
                  className="w-full bg-truth hover:bg-truth/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Text'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Upload Image</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Choose Image
                      </label>
                    </Button>
                    {selectedFile && (
                      <p className="text-sm text-foreground mt-2">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => handleAnalyze('image')}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full bg-truth hover:bg-truth/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <div className="space-y-4">
                  {/* Voice Recording Interface */}
                  <div className="border border-border rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      {isRecording ? (
                        <Mic className="h-16 w-16 text-scam animate-pulse" />
                      ) : (
                        <MicOff className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {isRecording 
                        ? 'Recording... Speak clearly into your microphone' 
                        : 'Click to start voice recording and real-time transcription'}
                    </p>
                    
                    {/* Recording Status Indicator */}
                    {isRecording && (
                      <div className="flex justify-center items-center gap-1 mb-4">
                        <div className="w-2 h-2 bg-scam rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-scam rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-scam rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className={isRecording ? "bg-scam hover:bg-scam/90" : "bg-truth hover:bg-truth/90"}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      
                      {voiceTranscript && (
                        <Button 
                          onClick={clearVoiceTranscript}
                          variant="outline"
                          size="lg"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Transcript Display */}
                  {voiceTranscript && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Real-time Transcript</label>
                      <div className="border border-border rounded-lg p-4 bg-surface min-h-24">
                        <p className="text-sm text-foreground">
                          {voiceTranscript || (
                            <span className="text-muted-foreground italic">
                              Transcript will appear here as you speak...
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleAnalyze('voice')}
                  disabled={!voiceTranscript.trim() || isAnalyzing}
                  className="w-full bg-truth hover:bg-truth/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Voice...
                    </>
                  ) : (
                    'Analyze Voice Recording'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Upload Video</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Select a video file or provide a URL
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="video-upload" className="cursor-pointer">
                        Choose Video
                      </label>
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => handleAnalyze('video')}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full bg-truth hover:bg-truth/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Video...
                    </>
                  ) : (
                    'Analyze Video'
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Website URL</label>
                  <Input
                    placeholder="https://example.com/article"
                    value={urlContent}
                    onChange={(e) => setUrlContent(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleAnalyze('url')}
                  disabled={!urlContent.trim() || isAnalyzing}
                  className="w-full bg-truth hover:bg-truth/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing URL...
                    </>
                  ) : (
                    'Analyze URL'
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}