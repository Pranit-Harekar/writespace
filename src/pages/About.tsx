import { Header } from '@/components/Header';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>

        <section className="mb-8 prose lg:prose-xl">
          <p className="text-lg mb-4">{t('about.description')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.storyTitle')}</h2>
          <p className="mb-4">{t('about.storyDescription')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.missionTitle')}</h2>
          <p className="mb-4">{t('about.missionDescription')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">{t('about.missionPoint1')}</li>
            <li className="mb-2">{t('about.missionPoint2')}</li>
            <li className="mb-2">{t('about.missionPoint3')}</li>
            <li className="mb-2">{t('about.missionPoint4')}</li>
            <li className="mb-2">{t('about.missionPoint5')}</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.teamTitle')}</h2>
          <p className="mb-4">{t('about.teamDescription')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.joinTitle')}</h2>
          <p className="mb-4">{t('about.joinDescription')}</p>
        </section>
      </main>
    </div>
  );
};

export default About;
