// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
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
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  MessageCircle,
  Loader2,
  Sparkles,
  Languages,
  Settings
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  message_type: 'text' | 'voice';
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export const VoiceChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const languages = [
    { code: 'en', name: 'English', voice: 'en-US' },
    { code: 'es', name: 'Spanish', voice: 'es-ES' },
    { code: 'fr', name: 'French', voice: 'fr-FR' },
    { code: 'de', name: 'German', voice: 'de-DE' },
    { code: 'it', name: 'Italian', voice: 'it-IT' },
    { code: 'pt', name: 'Portuguese', voice: 'pt-PT' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = languages.find(l => l.code === language)?.voice || 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive"
          });
        };
      }
      
      // Initialize speech synthesis
      synthesisRef.current = window.speechSynthesis;
    }
    
    loadConversations();
    loadUserPreferences();
  }, [language, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('language, voice_enabled')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setLanguage(data.language || 'en');
        setVoiceEnabled(data.voice_enabled);
      }
    } catch (error) {
      console.log('No user preferences found, using defaults');
    }
  };

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages((data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        message_type: msg.message_type as 'text' | 'voice',
        created_at: msg.created_at
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createConversation = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{ user_id: user.id, title: 'New Chat' }])
        .select()
        .single();
      
      if (error) throw error;
      
      setCurrentConversation(data.id);
      setMessages([]);
      loadConversations();
      
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant', messageType: 'text' | 'voice' = 'text') => {
    if (!user || !currentConversation) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: currentConversation,
          user_id: user.id,
          content,
          role,
          message_type: messageType
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newMessage: Message = {
        id: data.id,
        content: data.content,
        role: data.role as 'user' | 'assistant',
        message_type: data.message_type as 'text' | 'voice',
        created_at: data.created_at
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    let conversationId = currentConversation;
    if (!conversationId) {
      conversationId = await createConversation();
      if (!conversationId) return;
    }
    
    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);
    
    // Save user message
    await saveMessage(userMessage, 'user');
    
    try {
      // Call AI chatbot function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage,
          language: language,
          context: messages.slice(-10) // Last 10 messages for context
        }
      });
      
      if (error) throw error;
      
      const aiResponse = data.response;
      
      // Save AI response
      await saveMessage(aiResponse, 'assistant');
      
      // Speak the response if voice is enabled
      if (voiceEnabled && synthesisRef.current) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        const selectedLang = languages.find(l => l.code === language);
        if (selectedLang) {
          const voices = synthesisRef.current.getVoices();
          const voice = voices.find(v => v.lang.startsWith(selectedLang.voice));
          if (voice) utterance.voice = voice;
        }
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        synthesisRef.current.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error", 
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation.id);
    loadMessages(conversation.id);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AI Voice Assistant
          </h1>
        </div>
        <p className="text-muted-foreground">
          Chat with our intelligent AI assistant using voice or text in multiple languages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversation History */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={createConversation} 
              className="w-full mb-4 bg-gradient-primary hover:bg-primary-hover"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={currentConversation === conversation.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{conversation.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(conversation.created_at)}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Truthlens Assistant
                {isSpeaking && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Speaking
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                
                {isSpeaking && (
                  <Button variant="outline" size="sm" onClick={stopSpeaking}>
                    <VolumeX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with the AI assistant!</p>
                    <p className="text-sm">Ask about fact-checking, news analysis, or general questions.</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          {message.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs opacity-70">
                              {formatTime(message.created_at)}
                            </span>
                            {message.message_type === 'voice' && (
                              <Badge variant="outline" className="text-xs">
                                <Mic className="w-2 h-2 mr-1" />
                                Voice
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message or use voice..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              
              <Button
                variant="outline"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={isListening ? "bg-red-500 text-white" : ""}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};