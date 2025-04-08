
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FilterOptions } from '@/services/myArticlesService';
import { Search, X } from 'lucide-react';

interface ArticlesFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export const ArticlesFilter: React.FC<ArticlesFilterProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [title, setTitle] = useState(initialFilters.title || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [status, setStatus] = useState<'published' | 'draft' | ''>(
    initialFilters.status || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: FilterOptions = {};
    
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (status) filters.status = status as 'published' | 'draft';
    
    onFilterChange(filters);
  };

  const handleReset = () => {
    setTitle('');
    setCategory('');
    setStatus('');
    onFilterChange({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-card p-4 rounded-lg border">
      <h3 className="font-medium">Filter Articles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <div className="relative">
            <Input
              id="title"
              placeholder="Search by title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Input
            id="category"
            placeholder="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select 
            value={status} 
            onValueChange={(value) => setStatus(value as 'published' | 'draft' | '')}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          className="flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
};
