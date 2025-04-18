import { Header } from '@/components/Header';
import { FeaturedArticlesCarousel } from '@/components/FeaturedArticlesCarousel';
import { ArticlesList } from '@/components/ArticlesList';
import { CategoryList } from '@/components/CategoryList';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex flex-col gap-4">
          <section>
            <CategoryList />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <FeaturedArticlesCarousel />
          </section>

          <section className="mb-12">
            <ArticlesList limit={6} showViewSwitcher={true} sectionTitle="Latest Articles" />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
