-- Create tables for news, chat history and user preferences
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT,
  source TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  sentiment_score FLOAT,
  credibility_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT true,
  news_categories TEXT[] DEFAULT ARRAY['general', 'technology', 'politics'],
  dark_mode BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news (public read access)
CREATE POLICY "News articles are publicly readable"
ON public.news_articles FOR SELECT
USING (true);

-- RLS Policies for chat conversations
CREATE POLICY "Users can view their own conversations"
ON public.chat_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.chat_conversations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON public.chat_conversations FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = chat_messages.conversation_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON public.chat_messages FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = chat_messages.conversation_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for user preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
ON public.user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample news data
INSERT INTO public.news_articles (title, description, content, source, category, sentiment_score, credibility_score, published_at) VALUES
('AI Breakthrough in Healthcare', 'New AI system shows promise in early disease detection', 'Researchers have developed an AI system that can detect diseases 40% earlier than traditional methods...', 'TechNews', 'technology', 0.8, 0.9, now() - interval '2 hours'),
('Climate Change Report Released', 'New comprehensive study on global warming trends', 'The latest climate report reveals concerning trends in global temperature rise...', 'ScienceDaily', 'environment', -0.3, 0.85, now() - interval '4 hours'),
('Breakthrough in Quantum Computing', 'Scientists achieve new milestone in quantum processing', 'A team of researchers has successfully demonstrated quantum supremacy...', 'ResearchToday', 'technology', 0.7, 0.88, now() - interval '6 hours');