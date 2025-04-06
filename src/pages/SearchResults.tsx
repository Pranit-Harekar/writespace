import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticlesList } from '@/components/ArticlesList';
import { Footer } from '@/components/Footer';
import { CategoryList } from '@/components/CategoryList';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams<{ category: string }>();
  const query = searchParams.get('q') || '';

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
              <h1 className="text-3xl font-bold mb-2">Search Results: "{query}"</h1>
            )}

            <p className="text-muted-foreground mb-6">
              {category
                ? 'Browse articles in this category'
                : 'Showing articles matching your search'}
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
              <CategoryList />
            </div>

            <ArticlesList searchQuery={query} filterByCategory={category} limit={12} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
