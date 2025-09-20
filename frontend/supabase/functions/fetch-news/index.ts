import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting news fetch process');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Mock news data (in production, you'd use a real news API)
    const mockNews = [
      {
        title: "Revolutionary AI System Detects Deepfakes with 99.9% Accuracy",
        description: "Researchers develop groundbreaking technology to combat misinformation through advanced deepfake detection",
        content: "A team of AI researchers has unveiled a revolutionary system that can detect deepfake videos and images with unprecedented accuracy...",
        source: "TechCrunch",
        category: "technology",
        published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        sentiment_score: 0.8,
        credibility_score: 0.92
      },
      {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to ambitious new targets for carbon emission reduction",
        content: "In a landmark decision, representatives from 195 countries have agreed to a comprehensive climate action plan...",
        source: "Reuters",
        category: "environment", 
        published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        sentiment_score: 0.6,
        credibility_score: 0.95
      },
      {
        title: "Breakthrough in Quantum Computing Promises Faster Encryption",
        description: "New quantum processor achieves 1000x speed improvement over classical computers",
        content: "Scientists at a leading technology institute have demonstrated a quantum computing breakthrough...",
        source: "Nature",
        category: "technology",
        published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        sentiment_score: 0.7,
        credibility_score: 0.88
      },
      {
        title: "New Study Links Social Media Use to Misinformation Spread",
        description: "Research reveals how algorithmic feeds accelerate false information circulation",
        content: "A comprehensive study analyzing millions of social media posts has revealed concerning patterns...",
        source: "Scientific American",
        category: "technology",
        published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        sentiment_score: -0.3,
        credibility_score: 0.9
      },
      {
        title: "Medical AI Diagnoses Rare Diseases 40% Faster Than Doctors",
        description: "Healthcare AI system shows promising results in early disease detection trials",
        content: "A new artificial intelligence system designed for medical diagnostics has shown remarkable results...",
        source: "Medical Journal",
        category: "health",
        published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        sentiment_score: 0.75,
        credibility_score: 0.87
      }
    ];

    // Analyze each article with AI if OpenAI key is available
    const processedNews = [];
    
    for (const article of mockNews) {
      let processedArticle = { ...article };
      
      if (openAIApiKey) {
        try {
          // Use AI to enhance credibility and sentiment analysis
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert fact-checker. Analyze the given news article and return a JSON with credibility_score (0-1), sentiment_score (-1 to 1), and a brief analysis. Only return valid JSON.'
                },
                {
                  role: 'user',
                  content: `Title: ${article.title}\nDescription: ${article.description}\nSource: ${article.source}`
                }
              ],
              max_tokens: 200,
              temperature: 0.1,
            }),
          });

          if (response.ok) {
            const aiData = await response.json();
            try {
              const analysis = JSON.parse(aiData.choices[0].message.content);
              if (analysis.credibility_score) processedArticle.credibility_score = analysis.credibility_score;
              if (analysis.sentiment_score !== undefined) processedArticle.sentiment_score = analysis.sentiment_score;
            } catch (parseError) {
              console.log('Could not parse AI analysis, using defaults');
            }
          }
        } catch (aiError) {
          console.log('AI analysis failed, using default scores:', aiError.message);
        }
      }
      
      processedNews.push(processedArticle);
    }

    // Insert new articles into database
    const { data, error } = await supabase
      .from('news_articles')
      .upsert(processedNews, { 
        onConflict: 'title',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully processed ${processedNews.length} articles`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedNews.length,
        articles: data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});