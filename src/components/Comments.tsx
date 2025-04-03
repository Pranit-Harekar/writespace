
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Author {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  article_id: string;
  author?: Author;
}

interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchComments();
  }, [articleId]);
  
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('article_comments')
        .select(`
          *,
          author:user_id(
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setComments(data as Comment[] || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error fetching comments',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to comment',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      const newCommentData = {
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim()
      } as any; // Using 'as any' to bypass TypeScript type checking for now
      
      const { data, error } = await supabase
        .from('article_comments')
        .insert(newCommentData)
        .select(`
          *,
          author:user_id(
            username,
            full_name,
            avatar_url
          )
        `)
        .single();
        
      if (error) throw error;
      
      setComments([data as Comment, ...comments]);
      setNewComment('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been published',
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error adding comment',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };
  
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };
  
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };
  
  const updateComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .update({ content: editingContent.trim() })
        .eq('id', commentId)
        .select(`
          *,
          author:user_id(
            username,
            full_name,
            avatar_url
          )
        `)
        .single();
        
      if (error) throw error;
      
      setComments(comments.map(c => c.id === commentId ? (data as Comment) : c));
      setEditingCommentId(null);
      setEditingContent('');
      toast({
        title: 'Comment updated',
        description: 'Your comment has been updated',
      });
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error updating comment',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };
  
  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('article_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      setComments(comments.filter(c => c.id !== commentId));
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been removed',
      });
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error deleting comment',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      
      {user ? (
        <form onSubmit={addComment} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          You need to be logged in to comment on this article.
        </p>
      )}
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="rounded-full w-10 h-10 bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage 
                    src={comment.author?.avatar_url || undefined} 
                    alt={comment.author?.full_name || comment.author?.username || ""}
                  />
                  <AvatarFallback>
                    {(comment.author?.full_name || comment.author?.username || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {comment.author?.full_name || comment.author?.username || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), 'MMM d, yyyy')}
                        {comment.updated_at !== comment.created_at && 
                          " (edited)"}
                      </p>
                    </div>
                    
                    {user && user.id === comment.user_id && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEditing(comment)}
                          className="h-7 w-7"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteComment(comment.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateComment(comment.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm">{comment.content}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
