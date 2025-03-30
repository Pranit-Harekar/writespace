
import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticlesList } from '@/components/ArticlesList';
import { CategoryList } from '@/components/CategoryList';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams<{ category: string }>();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mx-auto max-w-4xl">
          {category ? (
            <>
              <h1 className="text-3xl font-bold mb-2 capitalize">{category} Articles</h1>
              <p className="text-muted-foreground mb-6">Browse articles in this category</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Search Results</h1>
              <p className="text-muted-foreground mb-6">
                {query ? `Showing results for: "${query}"` : 'All articles'}
              </p>
            </>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
            <CategoryList />
          </section>

          <ArticlesList
            sectionTitle="Search Results"
            searchQuery={query}
            filterByCategory={category}
            limit={9}
            showViewSwitcher={true}
          />
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
