
import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "technology", name: "Technology" },
  { id: "health", name: "Health" },
  { id: "education", name: "Education" },
  { id: "culture", name: "Culture" },
  { id: "politics", name: "Politics" },
  { id: "business", name: "Business" },
  { id: "science", name: "Science" },
  { id: "entertainment", name: "Entertainment" },
  { id: "sports", name: "Sports" },
  { id: "travel", name: "Travel" },
  { id: "food", name: "Food" },
];

export const CategoryList = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const isSearchPage = location.pathname.includes('/search');
  
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
          
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              className="rounded-full"
              asChild
            >
              <Link to={isSearchPage 
                ? `/search/category/${cat.id}${preserveSearchParams()}` 
                : `/category/${cat.id}`}
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
