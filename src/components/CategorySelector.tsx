
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: newCategoryName.trim() })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "New category created successfully",
      });
      
      // Update the form with the new category
      onChange(data.name, data.id);
      
      // Reset the UI state
      setNewCategoryName("");
      setCreatingCategory(false);
      
      // Refresh categories list
      fetchCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    }
  };

  // Handle selection of existing category
  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onChange(category.name, category.id);
    }
  };

  if (creatingCategory) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter new category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleCreateCategory}
          size="sm"
          className="shrink-0"
        >
          Add
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCreatingCategory(false)}
          className="shrink-0 p-0 w-8 h-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
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
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setCreatingCategory(true)}
        className="shrink-0"
      >
        <Plus className="h-4 w-4 mr-1" /> New
      </Button>
    </div>
  );
};
