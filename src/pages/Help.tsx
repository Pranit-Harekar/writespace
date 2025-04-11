import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Help = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{t('help.title')}</h1>

        <Alert className="mb-6">
          <HelpCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {t('help.immediateAssistance')}{' '}
            <span className="font-medium">support@writespace.com</span>
          </AlertDescription>
        </Alert>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('help.faqTitle')}</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="getting-started">
              <AccordionTrigger className="text-lg">
                {t('help.gettingStartedTitle')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">{t('help.gettingStartedDescription')}</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>{t('help.gettingStartedStep1')}</li>
                  <li>{t('help.gettingStartedStep2')}</li>
                  <li>{t('help.gettingStartedStep3')}</li>
                  <li>{t('help.gettingStartedStep4')}</li>
                </ol>
                <p>{t('help.gettingStartedNote')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="writing-articles">
              <AccordionTrigger className="text-lg">
                {t('help.writingArticlesTitle')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">{t('help.writingArticlesDescription')}</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>{t('help.writingArticlesStep1')}</li>
                  <li>{t('help.writingArticlesStep2')}</li>
                  <li>{t('help.writingArticlesStep3')}</li>
                  <li>{t('help.writingArticlesStep4')}</li>
                  <li>{t('help.writingArticlesStep5')}</li>
                  <li>{t('help.writingArticlesStep6')}</li>
                </ol>
                <p>{t('help.writingArticlesNote')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account-settings">
              <AccordionTrigger className="text-lg">
                {t('help.accountSettingsTitle')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">{t('help.accountSettingsDescription')}</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>{t('help.accountSettingsStep1')}</li>
                  <li>{t('help.accountSettingsStep2')}</li>
                  <li>{t('help.accountSettingsStep3')}</li>
                  <li>{t('help.accountSettingsStep4')}</li>
                  <li>{t('help.accountSettingsStep5')}</li>
                </ul>
                <p>{t('help.accountSettingsNote')}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="following">
              <AccordionTrigger className="text-lg">{t('help.followingTitle')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">{t('help.followingDescription')}</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>{t('help.followingStep1')}</li>
                  <li>{t('help.followingStep2')}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multilingual">
              <AccordionTrigger className="text-lg">{t('help.multilingualTitle')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">{t('help.multilingualDescription')}</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>{t('help.multilingualStep1')}</li>
                  <li>{t('help.multilingualStep2')}</li>
                  <li>{t('help.multilingualStep3')}</li>
                  <li>{t('help.multilingualStep4')}</li>
                </ul>
                <p>{t('help.multilingualNote')}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('help.contactSupportTitle')}</h2>
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium text-lg">{t('help.emailSupportTitle')}</h3>
            </div>
            <p className="mb-4 text-muted-foreground">{t('help.emailSupportDescription')}</p>
            <p className="font-medium">support@writespace.com</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Help;
