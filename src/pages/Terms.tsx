import { Header } from '@/components/Header';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('terms.lastUpdated')}</p>

        <section className="mb-8 prose lg:prose-xl">
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.acceptanceOfTermsTitle')}</h2>
          <p className="mb-4">{t('terms.acceptanceOfTermsText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.useLicenseTitle')}</h2>
          <p className="mb-3">{t('terms.useLicenseText')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('terms.modifyOrCopyMaterials')}</li>
            <li>{t('terms.useMaterialsForCommercialPurpose')}</li>
            <li>{t('terms.attemptToReverseEngineer')}</li>
            <li>{t('terms.removeCopyrightNotations')}</li>
            <li>{t('terms.transferMaterialsToAnother')}</li>
          </ul>
          <p className="mb-4">{t('terms.licenseTermination')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.userContentTitle')}</h2>
          <p className="mb-4">{t('terms.userContentText')}</p>
          <p className="mb-4">{t('terms.userContentWarranty')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.prohibitedContentTitle')}</h2>
          <p className="mb-3">{t('terms.prohibitedContentIntro')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('terms.prohibitedContentUnlawful')}</li>
            <li>{t('terms.prohibitedContentIllegalActivities')}</li>
            <li>{t('terms.prohibitedContentInfringesRights')}</li>
            <li>{t('terms.prohibitedContentContainsViruses')}</li>
            <li>{t('terms.prohibitedContentUnauthorizedAdvertising')}</li>
            <li>{t('terms.prohibitedContentMisleadingInformation')}</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.accountTerminationTitle')}</h2>
          <p className="mb-4">{t('terms.accountTerminationText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.limitationOfLiabilityTitle')}</h2>
          <p className="mb-4">{t('terms.limitationOfLiabilityText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.disclaimerTitle')}</h2>
          <p className="mb-4">{t('terms.disclaimerText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.governingLawTitle')}</h2>
          <p className="mb-4">{t('terms.governingLawText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.changesToTermsTitle')}</h2>
          <p className="mb-4">{t('terms.changesToTermsText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('terms.contactUsTitle')}</h2>
          <p className="mb-4">{t('terms.contactUsText')}</p>
          <p className="font-medium">{t('terms.legalEmail')}</p>
        </section>
      </main>
    </div>
  );
};

export default Terms;
