import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticlesList } from '@/components/ArticlesList';
import { Footer } from '@/components/Footer';

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();

  const formatCategoryName = (category: string) => {
    return category
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
            <h1 className="text-3xl font-bold mb-6">
              {formatCategoryName(category || '')} Articles
            </h1>
            <ArticlesList filterByCategory={category} limit={12} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryView;
