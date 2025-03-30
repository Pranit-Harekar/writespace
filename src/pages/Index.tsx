
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryList } from "@/components/CategoryList";
import { mockArticles } from "@/data/mockArticles";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  const featuredArticle = mockArticles[0];
  const recentArticles = mockArticles.slice(1);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
            <FeaturedArticle {...featuredArticle} />
          </section>

          <CategoryList />

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
