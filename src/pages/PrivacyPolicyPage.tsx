import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">Privacy Policy</h1>
          <div className="space-y-6 text-foreground">
            <p className="text-lg text-muted-foreground">Welcome to Deshmukh Systems. Your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit or interact with our website www.deshmukhsystems.com.</p>
            <p className="text-muted-foreground">By using our website, you agree to the terms outlined here.</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
              <p>When you use our website, we may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Personal Information:</strong> Such as your name, email address, phone number, educational details, and payment information (if you purchase a course).</li>
                <li><strong className="text-foreground">Non-Personal Information:</strong> Browser type, IP address, device type, pages you visit, time spent on pages, and other analytical data.</li>
                <li><strong className="text-foreground">Cookies and Tracking Technologies:</strong> We use cookies to personalize your experience and analyze website traffic.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p>We use the information we collect for purposes including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide, operate, and improve our educational services and resources</li>
                <li>To process your transactions and manage your accounts</li>
                <li>To send updates, promotions, or other marketing communications</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To maintain security and prevent fraud</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. How We Share Your Information</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Trusted service providers (such as payment processors, analytics services) who assist us in operating the website</li>
                <li>Legal authorities, if required by law or necessary to protect our rights</li>
              </ul>
              <p className="text-muted-foreground">All third parties must comply with strict data protection standards.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Your Data Protection Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access the personal information we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent for marketing emails (unsubscribe anytime)</li>
                <li>Request that we limit or stop processing your personal data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
              <p className="text-muted-foreground">We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Third-Party Links</h2>
              <p className="text-muted-foreground">Our website may contain links to external websites. We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies independently.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Updates to This Privacy Policy</h2>
              <p className="text-muted-foreground">We may update this Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this policy periodically.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <p className="text-primary">📩 Email: sales@deshmukhsystems.com</p>
              <p className="text-primary">🌐 Website: www.deshmukhsystems.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 