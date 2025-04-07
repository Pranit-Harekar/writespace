
import React from 'react';
import { Header } from '@/components/Header';
import { FeaturedArticlesCarousel } from '@/components/FeaturedArticlesCarousel';
import { ArticlesList } from '@/components/ArticlesList';
import { CategoryList } from '@/components/CategoryList';
import { Footer } from '@/components/Footer';
import { ViewMode } from '@/components/ViewSwitcher';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <FeaturedArticlesCarousel />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <CategoryList />
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
            </div>
            <ArticlesList 
              limit={6} 
              showViewSwitcher={true}
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
