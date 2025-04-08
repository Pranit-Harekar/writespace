
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ArticleListItem {
  id: string;
  title: string;
  category: string | null;
  category_id: string | null;
  categories: {
    id: string;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

const MyArticles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(
            `
            id, 
            title, 
            category, 
            category_id,
            categories:category_id(id, name),
            created_at, 
            updated_at, 
            is_published
          `
          )
          .eq('author_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        setArticles(data || []);
      } catch (error: any) {
        console.error('Error fetching articles:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load your articles',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [user, navigate, toast]);

  const createDraftArticle = async () => {
    if (!user) return;
    
    setIsCreatingDraft(true);
    
    try {
      // Create a new draft article with minimal content
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: `Draft - ${new Date().toLocaleTimeString()}`,
          content: '',
          author_id: user.id,
          is_published: false,
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Navigate to the edit page for the newly created draft
        navigate(`/article/edit/${data[0].id}`);
      }
    } catch (error: any) {
      console.error('Error creating draft article:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create draft article',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDraft(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Articles</h1>
          <Button onClick={createDraftArticle} disabled={isCreatingDraft}>
            <Plus className="h-4 w-4 mr-2" /> 
            {isCreatingDraft ? 'Creating Draft...' : 'Create New Article'}
          </Button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">You haven't created any articles yet</h2>
            <p className="text-muted-foreground mb-6">
              Start writing and sharing your knowledge with the community
            </p>
            <Button onClick={createDraftArticle} disabled={isCreatingDraft}>
              {isCreatingDraft ? 'Creating Draft...' : 'Create Your First Article'}
            </Button>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of your articles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map(article => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.categories?.name || article.category || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={article.is_published ? 'default' : 'outline'}>
                      {article.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/article/${article.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/article/edit/${article.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
