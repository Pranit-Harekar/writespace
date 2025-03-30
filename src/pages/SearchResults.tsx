
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ArticlesList } from "@/components/ArticlesList";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/components/CategoryList";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Search Results: "{query}"
            </h1>
            <p className="text-muted-foreground mb-6">
              Showing articles matching your search
            </p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
              <CategoryList />
            </div>
            
            {currentLanguage && (
              <div className="mb-6 flex items-center">
                <span className="mr-2">Filtered by language: {currentLanguage}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearLanguageFilter}
                >
                  Clear Filter
                </Button>
              </div>
            )}
            
            <ArticlesList 
              searchQuery={query} 
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
