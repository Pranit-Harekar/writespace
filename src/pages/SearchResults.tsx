
import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ArticlesList } from "@/components/ArticlesList";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/components/CategoryList";
import { LANGUAGES } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams<{ category: string }>();
  const query = searchParams.get("q") || "";
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);

  // Reset language filter
  const clearLanguageFilter = () => {
    setCurrentLanguage(null);
  };
  
  // Apply language filter
  const applyLanguageFilter = (language: string) => {
    setCurrentLanguage(language);
  };

  // Format the category name for display
  const formatCategoryName = (categoryParam: string) => {
    return categoryParam
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-8">
            {category ? (
              <h1 className="text-3xl font-bold mb-2">
                {formatCategoryName(category)} Articles
                {query && ` matching "${query}"`}
              </h1>
            ) : (
              <h1 className="text-3xl font-bold mb-2">
                Search Results: "{query}"
              </h1>
            )}
            
            <p className="text-muted-foreground mb-6">
              {category 
                ? "Browse articles in this category" 
                : "Showing articles matching your search"}
            </p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
              <CategoryList />
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Language</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <Badge 
                    key={code}
                    variant={currentLanguage === code ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => applyLanguageFilter(code)}
                  >
                    {lang.name}
                  </Badge>
                ))}
                {currentLanguage && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearLanguageFilter}
                    className="ml-2"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
            
            <ArticlesList 
              searchQuery={query} 
              filterByCategory={category}
              filterByLanguage={currentLanguage}
              limit={12} 
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
