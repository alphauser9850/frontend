import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">Terms and Conditions</h1>
          <div className="space-y-6 text-foreground">
            <p className="text-lg text-muted-foreground">These Terms and Conditions govern the use of services provided by CCIE LAB. By enrolling in our courses and using our website, you agree to comply with these terms.</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Enrollment and Payment</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Enrollment:</strong> To join any course, you must complete the registration form and make full payment. Enrollment will be confirmed once payment is received.</li>
                <li><strong className="text-foreground">Payment:</strong> We accept payments through credit card, debit card, UPI, and online banking. Please ensure that your payment information is accurate and current.</li>
                <li><strong className="text-foreground">Confirmation:</strong> Once your payment is confirmed, you will receive an email containing course details and access instructions.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Cancellation and Refund</h2>
              <p><strong className="text-foreground">Refund Eligibility:</strong></p>
              <p className="text-muted-foreground">We do not offer refunds simply based on a change of mind after payment. Refunds will only be considered under specific conditions, such as:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>If the student has attended two days of classes in a weekday batch and is genuinely dissatisfied with the training program, along with providing valid and reasonable feedback.</li>
                <li>Any other refund requests will be reviewed on a case-by-case basis by our team, and approved only if found valid.</li>
              </ul>
              <p className="mt-4"><strong className="text-foreground">Procedure:</strong> To request a refund, email us at support@ccielab.net with your payment details and reason for the refund. Eligible refunds will be processed within 30 business days.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
              <p className="text-muted-foreground">All content, including videos, documents, and software, provided by CCIE LAB is protected by intellectual property laws. These materials are intended solely for personal educational use and may not be copied, shared, or modified without prior written permission.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">User Conduct</h2>
              <p className="text-muted-foreground">We expect all users to maintain professionalism and respect in all interactions. Any misconduct, including harassment, discrimination, or disruption, may result in termination of access without a refund.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Liability</h2>
              <p className="text-muted-foreground">CCIE LAB is not responsible for any direct, indirect, incidental, or consequential damages resulting from the use of our services. This includes data loss or interruptions to your learning experience.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
              <p className="text-muted-foreground">We reserve the right to update or change these Terms and Conditions at any time. Updates will be posted on our website. Continued use of our services indicates acceptance of any changes.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Governing Law</h2>
              <p className="text-muted-foreground">These terms are governed by the laws applicable in the jurisdiction where CCIE LAB is registered. Any disputes will be resolved under the exclusive jurisdiction of the courts in this jurisdiction.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
              <p>For any queries regarding these Terms and Conditions, please contact us:</p>
              <p className="text-primary">Email: support@ccielab.net</p>
              <p className="text-primary">Phone: +917972852821</p>
            </section>

            <div className="mt-8 space-y-4 text-muted-foreground">
              <p>By proceeding with your enrollment or purchase, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
              <p>Thank you for choosing CCIE LAB for your learning journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 