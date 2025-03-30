import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ArticlesList } from '@/components/ArticlesList';
import { CategoryList } from '@/components/CategoryList';

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold mb-2 capitalize">{category} Articles</h1>
          <p className="text-muted-foreground mb-6">Browse articles in this category</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
            <CategoryList />
          </section>

          <ArticlesList
            sectionTitle="Recent Articles"
            filterByCategory={category}
            limit={9}
            showViewSwitcher={true}
          />
        </div>
      </main>
    </div>
  );
};

export default CategoryView;
