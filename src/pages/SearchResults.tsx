
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticlesList } from '@/components/ArticlesList';
import { ViewMode } from '@/components/ViewSwitcher';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articlesViewMode, setArticlesViewMode] = useState<ViewMode>('grid');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground mb-8">
            Showing results for: <span className="font-medium">{query}</span>
          </p>
          
          <ArticlesList 
            searchQuery={query} 
            limit={9} 
            showViewSwitcher={true} 
            defaultView={articlesViewMode}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
