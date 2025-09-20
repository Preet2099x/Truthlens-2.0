import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Filter,
  Clock,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  Newspaper
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
  image_url: string;
  category: string;
  sentiment_score: number;
  credibility_score: number;
  created_at: string;
}

export const NewsSection = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("published_at");
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All News" },
    { value: "technology", label: "Technology" },
    { value: "politics", label: "Politics" },
    { value: "environment", label: "Environment" },
    { value: "health", label: "Health" },
    { value: "business", label: "Business" }
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('news_articles')
        .select('*');

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      query = query.order(sortBy, { ascending: false }).limit(20);

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 0.8) return { color: "verified", icon: CheckCircle, text: "High Credibility" };
    if (score >= 0.6) return { color: "suspicious", icon: AlertTriangle, text: "Medium Credibility" };
    return { color: "unverified", icon: AlertTriangle, text: "Low Credibility" };
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "text-accent-green";
    if (score < -0.3) return "text-unverified";
    return "text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
            <Newspaper className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Real-Time News Hub
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stay informed with AI-powered credibility analysis and real-time fact-checking
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border p-6 mb-8 shadow-soft">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="md:w-48">
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published_at">Latest First</SelectItem>
              <SelectItem value="credibility_score">Most Credible</SelectItem>
              <SelectItem value="sentiment_score">Most Positive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="hover-lift animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const credibility = getCredibilityBadge(article.credibility_score || 0);
            const CredibilityIcon = credibility.icon;
            
            return (
              <Card key={article.id} className="hover-lift transition-all duration-300 group">
                <CardHeader className="p-0">
                  {article.image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <Badge 
                      className={`status-${credibility.color === "verified" ? "verified" : credibility.color === "suspicious" ? "suspicious" : "unverified"}`}
                    >
                      <CredibilityIcon className="w-3 h-3 mr-1" />
                      {Math.round((article.credibility_score || 0) * 100)}%
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className={`text-xs ${getSentimentColor(article.sentiment_score || 0)}`}>
                      Sentiment: {article.sentiment_score ? (article.sentiment_score > 0 ? 'Positive' : 'Negative') : 'Neutral'}
                    </div>
                    {article.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read More
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-16">
          <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};