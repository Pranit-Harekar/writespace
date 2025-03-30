import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>

        <Alert className="mb-6">
          <HelpCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Need immediate assistance? Contact us at{' '}
            <span className="font-medium">support@writespace.com</span>
          </AlertDescription>
        </Alert>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="getting-started">
              <AccordionTrigger className="text-lg">
                Getting Started with WriteSpace
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">To get started with WriteSpace:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Create an account using your email</li>
                  <li>Complete your profile by adding a bio and profile picture</li>
                  <li>Start writing your first article or explore content</li>
                </ol>
                <p>Our editor has built-in tools for formatting to make writing easier.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="writing-articles">
              <AccordionTrigger className="text-lg">
                How to Write and Publish Articles
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">To create and publish an article:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Click the "New Article" button in the header</li>
                  <li>Write your title and content using our rich text editor</li>
                  <li>Add a cover image to make your article stand out</li>
                  <li>Select categories and tags to help readers find your content</li>
                  <li>Click "Publish" when you're ready to share</li>
                </ol>
                <p>You can save drafts and come back to them later before publishing.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account-settings">
              <AccordionTrigger className="text-lg">Managing Your Account</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">You can manage your account settings from your profile page:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Update your profile information (name, bio, photo)</li>
                  <li>Change your password or email address</li>
                  <li>Adjust notification preferences</li>
                  <li>Link social media accounts</li>
                </ul>
                <p>
                  To delete your account, go to Profile &gt; Settings &gt; Account &gt; Delete
                  Account.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="following">
              <AccordionTrigger className="text-lg">Following Writers and Topics</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">
                  Personalize your feed by following your favorite writers and topics:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Follow writers by visiting their profile and clicking the "Follow" button</li>
                  <li>Follow topics by clicking on category tags and selecting "Follow"</li>
                  <li>Your home feed will prioritize content from writers and topics you follow</li>
                  <li>Receive notifications when writers you follow publish new articles</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium text-lg">Email Support</h3>
            </div>
            <p className="mb-4 text-muted-foreground">
              For any questions not covered in our help documentation, please contact our support
              team. We aim to respond to all inquiries within 24 hours.
            </p>
            <p className="font-medium">support@writespace.com</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Help;
