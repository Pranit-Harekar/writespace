
import React from "react";
import { Header } from "@/components/Header";
import { FeaturedArticleSection } from "@/components/FeaturedArticleSection";
import { ArticlesList } from "@/components/ArticlesList";
import { CategoryList } from "@/components/CategoryList";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <FeaturedArticleSection />
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <CategoryList />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <ArticlesList limit={6} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
