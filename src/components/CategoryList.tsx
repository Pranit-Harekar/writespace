
import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

export const CategoryList = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const isSearchPage = location.pathname.includes('/search');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true });
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const preserveSearchParams = () => {
    if (isSearchPage) {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('q');
      return query ? `?q=${query}` : '';
    }
    return '';
  };

  return (
    <div className="my-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          <Button 
            variant={!category ? "default" : "outline"} 
            className="rounded-full" 
            asChild
          >
            <Link to={isSearchPage ? `/search${preserveSearchParams()}` : "/"}>All</Link>
          </Button>
          
          {!isLoading && categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.name.toLowerCase() ? "default" : "outline"}
              className="rounded-full"
              asChild
            >
              <Link to={isSearchPage 
                ? `/search/category/${cat.name.toLowerCase()}${preserveSearchParams()}` 
                : `/search/category/${cat.name.toLowerCase()}`}
              >
                {cat.name}
              </Link>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
