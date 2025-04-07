
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticlesList } from '@/components/ArticlesList';

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 capitalize">{category}</h1>
          <p className="text-muted-foreground mb-8">Browse all articles in this category</p>
          
          <ArticlesList 
            filterByCategory={category} 
            limit={9} 
            showViewSwitcher={true} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryView;
