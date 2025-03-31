
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CategorySelectorProps {
  value: string;
  categoryId: string | null;
  onChange: (value: string, categoryId: string | null) => void;
}

interface Category {
  id: string;
  name: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  value,
  categoryId,
  onChange 
}) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the database
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle selection of existing category
  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onChange(category.name, category.id);
    }
  };

  return (
    <div className="w-full">
      <Select 
        value={categoryId || ""} 
        onValueChange={handleSelectCategory}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-2">
        Categories can only be managed through the Supabase admin interface.
      </p>
    </div>
  );
};
