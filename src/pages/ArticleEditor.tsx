
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ChevronLeft, Save, Trash2, Eye, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type ArticleFormValues = {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  language: string;
  featured_image: string;
  read_time: number;
  is_published: boolean;
};

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const isEditing = Boolean(id);

  const form = useForm<ArticleFormValues>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      language: "en",
      featured_image: "",
      read_time: 5,
      is_published: false,
    },
  });

  // Fetch article if editing
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Check if current user is the author
        if (data.author_id !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this article",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        form.reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || "",
          category: data.category || "",
          language: data.language,
          featured_image: data.featured_image || "",
          read_time: data.read_time || 5,
          is_published: data.is_published || false,
        });
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate, toast, form]);

  const onSubmit = async (values: ArticleFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create or edit articles",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const articleData = {
        ...values,
        author_id: user.id,
        published_at: values.is_published ? new Date().toISOString() : null,
      };

      let response;
      
      if (isEditing) {
        // Update existing article
        response = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);
      } else {
        // Create new article
        response = await supabase
          .from("articles")
          .insert(articleData)
          .select();
      }

      if (response.error) throw response.error;

      toast({
        title: isEditing ? "Article updated" : "Article created",
        description: `Your article has been ${isEditing ? "updated" : "created"} successfully`,
      });

      if (!isEditing && response.data) {
        // Navigate to the newly created article
        navigate(`/article/edit/${response.data[0].id}`);
      }
    } catch (error: any) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} article`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;
    
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "Your article has been deleted successfully",
      });
      
      navigate("/my-articles");
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          
          <div className="flex gap-2">
            {isEditing && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Article" : "Create New Article"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Technology, Health" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a URL to an image for your article
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="5" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief summary of your article" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed in article previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your article content here..." 
                          rows={15}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Article</FormLabel>
                        <FormDescription>
                          When enabled, your article will be visible to all users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticleEditor;
