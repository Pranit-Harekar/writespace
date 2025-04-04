
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 4, 2025</p>
        
        <section className="mb-8 prose lg:prose-xl">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using WriteSpace, you agree to be bound by these Terms of Service and all applicable
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
            accessing this site.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
          <p className="mb-3">
            Permission is granted to temporarily access the materials on WriteSpace's website for personal,
            non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display;</li>
            <li>Attempt to reverse engineer any software contained on WriteSpace's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="mb-4">
            This license shall automatically terminate if you violate any of these restrictions and may be
            terminated by WriteSpace at any time.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. User Content</h2>
          <p className="mb-4">
            Our service allows you to post, link, store, share and otherwise make available certain information,
            text, graphics, videos, or other material ("Content"). By posting Content on WriteSpace, you grant
            us the right to display, reproduce, and distribute your Content. You retain any and all of your rights
            to any Content you submit, post or display on or through the service and you are responsible for
            protecting those rights.
          </p>
          <p className="mb-4">
            You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it
            and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content
            on or through the service does not violate the privacy rights, publicity rights, copyrights, contract
            rights or any other rights of any person.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Prohibited Content</h2>
          <p className="mb-3">
            You agree not to post Content that:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or invasive of another's privacy;</li>
            <li>Promotes illegal activities or contains hate speech;</li>
            <li>Infringes upon or violates any third party's intellectual property or other rights;</li>
            <li>Contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware;</li>
            <li>Constitutes unauthorized or unsolicited advertising, spam or bulk e-mail ("spamming");</li>
            <li>Contains misleading information or impersonates any person or entity.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Account Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the Terms. Upon termination, your
            right to use the service will immediately cease.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall WriteSpace, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
            to or use of or inability to access or use the service.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Disclaimer</h2>
          <p className="mb-4">
            Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE"
            basis. The service is provided without warranties of any kind, whether express or implied, including,
            but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement
            or course of performance.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of India, without regard
            to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
            revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="font-medium">legal@writespace.com</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
