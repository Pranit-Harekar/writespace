import { Header } from '@/components/Header';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 4, 2025</p>

        <section className="mb-8 prose lg:prose-xl">
          <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            At WriteSpace, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website and
            use our services. Please read this privacy policy carefully. If you do not agree with
            the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">Personal Data</h3>
          <p className="mb-3">
            We may collect personal identification information from users in various ways,
            including, but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>When users register on our site</li>
            <li>When users publish or edit articles</li>
            <li>When users post comments</li>
            <li>When users fill out a form</li>
            <li>
              In connection with other activities, services, features, or resources we make
              available
            </li>
          </ul>
          <p className="mb-4">The personal information we may collect includes:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name</li>
            <li>Email address</li>
            <li>Username</li>
            <li>Profile photo</li>
            <li>Biographical information</li>
            <li>Social media handles</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Non-Personal Data</h3>
          <p className="mb-4">
            We may collect non-personal identification information about users whenever they
            interact with our site. Non-personal identification information may include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Browser name</li>
            <li>Type of device</li>
            <li>Technical information about users' connection to our site</li>
            <li>Usage data such as pages visited, time spent on pages, links clicked</li>
            <li>Language preferences</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-3">
            WriteSpace may collect and use users' personal information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>To personalize user experience</li>
            <li>To improve our website and services</li>
            <li>To enable user-to-user communications</li>
            <li>To send periodic emails</li>
            <li>To process transactions</li>
            <li>To manage user accounts</li>
            <li>To display user content and attribute authorship</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Storage and Security</h2>
          <p className="mb-4">
            We adopt appropriate data collection, storage and processing practices and security
            measures to protect against unauthorized access, alteration, disclosure or destruction
            of your personal information, username, password, transaction information and data
            stored on our site.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sharing Your Personal Information</h2>
          <p className="mb-4">
            We do not sell, trade, or rent users' personal identification information to others. We
            may share generic aggregated demographic information not linked to any personal
            identification information regarding visitors and users with our business partners,
            trusted affiliates and advertisers for the purposes outlined above.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Websites</h2>
          <p className="mb-4">
            Users may find content on our site that links to the sites and services of our partners,
            suppliers, advertisers, sponsors, licensors and other third parties. We do not control
            the content or links that appear on these sites and are not responsible for the
            practices employed by websites linked to or from our site.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access and receive a copy of the personal data we hold about you</li>
            <li>Rectify any personal data held about you that is inaccurate</li>
            <li>Request the deletion of personal data held about you</li>
            <li>Restrict the processing of your personal data</li>
            <li>Request a transfer of your personal data</li>
            <li>Object to the processing of your personal data</li>
            <li>
              Withdraw consent at any time where we are relying on consent to process your personal
              data
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            WriteSpace has the discretion to update this privacy policy at any time. When we do, we
            will revise the updated date at the top of this page. We encourage users to frequently
            check this page for any changes to stay informed about how we are helping to protect the
            personal information we collect.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, the practices of this site, or your
            dealings with this site, please contact us at:
          </p>
          <p className="font-medium">privacy@writespace.com</p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
