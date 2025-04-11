import { Header } from '@/components/Header';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('privacy.lastUpdated')}</p>

        <section className="mb-8 prose lg:prose-xl">
          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.introduction')}</h2>
          <p className="mb-4">{t('privacy.introductionText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.informationWeCollect')}</h2>
          <h3 className="text-xl font-semibold mb-3">{t('privacy.personalData')}</h3>
          <p className="mb-3">{t('privacy.personalDataIntro')}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t('privacy.personalDataListItem1')}</li>
            <li>{t('privacy.personalDataListItem2')}</li>
            <li>{t('privacy.personalDataListItem3')}</li>
            <li>{t('privacy.personalDataListItem4')}</li>
            <li>{t('privacy.personalDataListItem5')}</li>
          </ul>
          <p className="mb-4">{t('privacy.personalInformationWeCollect')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('privacy.name')}</li>
            <li>{t('privacy.emailAddress')}</li>
            <li>{t('privacy.username')}</li>
            <li>{t('privacy.profilePhoto')}</li>
            <li>{t('privacy.biographicalInformation')}</li>
            <li>{t('privacy.socialMediaHandles')}</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">{t('privacy.nonPersonalData')}</h3>
          <p className="mb-4">{t('privacy.nonPersonalDataIntro')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('privacy.browserName')}</li>
            <li>{t('privacy.typeOfDevice')}</li>
            <li>{t('privacy.technicalInformation')}</li>
            <li>{t('privacy.usageData')}</li>
            <li>{t('privacy.languagePreferences')}</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.howWeUseYourInformation')}</h2>
          <p className="mb-3">{t('privacy.howWeUseYourInformationIntro')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('privacy.toPersonalizeUserExperience')}</li>
            <li>{t('privacy.toImproveOurWebsite')}</li>
            <li>{t('privacy.toEnableUserCommunications')}</li>
            <li>{t('privacy.toSendPeriodicEmails')}</li>
            <li>{t('privacy.toProcessTransactions')}</li>
            <li>{t('privacy.toManageUserAccounts')}</li>
            <li>{t('privacy.toDisplayUserContent')}</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.dataStorageAndSecurity')}</h2>
          <p className="mb-4">{t('privacy.dataStorageAndSecurityText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            {t('privacy.sharingYourPersonalInformation')}
          </h2>
          <p className="mb-4">{t('privacy.sharingYourPersonalInformationText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.thirdPartyWebsites')}</h2>
          <p className="mb-4">{t('privacy.thirdPartyWebsitesText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.yourRights')}</h2>
          <p className="mb-3">{t('privacy.youHaveTheRightTo')}</p>
          <ul className="list-disc pl-6 mb-6">
            <li>{t('privacy.accessAndReceiveData')}</li>
            <li>{t('privacy.rectifyInaccurateData')}</li>
            <li>{t('privacy.requestDeletionOfData')}</li>
            <li>{t('privacy.restrictProcessingOfData')}</li>
            <li>{t('privacy.requestTransferOfData')}</li>
            <li>{t('privacy.objectToProcessingOfData')}</li>
            <li>{t('privacy.withdrawConsent')}</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.changesToPrivacyPolicy')}</h2>
          <p className="mb-4">{t('privacy.changesToPrivacyPolicyText')}</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">{t('privacy.contactUs')}</h2>
          <p className="mb-4">{t('privacy.contactUsText')}</p>
          <p className="font-medium">{t('privacy.privacyEmail')}</p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
