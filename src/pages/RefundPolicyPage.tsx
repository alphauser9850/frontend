import React from 'react';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">Refund & Cancellation Policy</h1>
          <div className="space-y-6 text-foreground">
            <p className="text-lg text-muted-foreground">At CCIE LAB, we are committed to delivering top-quality education and training services. To maintain transparency and fairness, this refund and cancellation policy outlines the terms under which refunds may be granted.</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Refund Eligibility</h2>
              <p className="text-muted-foreground">We do not offer refunds simply based on a change of mind after payment. Refunds will only be considered under specific conditions, such as:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>If the student has attended two days of classes in a weekday batch and is genuinely dissatisfied with the training program, along with providing valid and reasonable feedback.</li>
                <li>Any other refund requests will be reviewed on a case-by-case basis by our team, and approved only if found valid.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Refund Process</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Request Submission:</strong> Email your refund request to support@ccielab.net with the reason, proof of purchase, and any relevant details.</li>
                <li><strong className="text-foreground">Review:</strong> Our support team will assess your request within 7 business days.</li>
                <li><strong className="text-foreground">Resolution:</strong> If approved, the refund will be processed within 30 business days via the original payment method. If declined, an explanation will be provided.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Exclusions</h2>
              <p className="text-muted-foreground">Refunds are not applicable for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Services already consumed or partially completed</li>
                <li>Customized or tailor-made training programs</li>
                <li>Courses purchased under promotional or discounted rates</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Non-Transferability</h2>
              <p className="text-muted-foreground">All courses and services are intended solely for the individual or entity that made the purchase. Transfers are not allowed unless explicitly authorized by Deshmukh Systems.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Credit Option</h2>
              <p className="text-muted-foreground">In some cases, we may offer credit towards future courses instead of a refund, based on the situation and at our sole discretion.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Dispute Resolution</h2>
              <p className="text-muted-foreground">We aim to resolve all service-related disputes promptly and fairly. Students are encouraged to reach out directly to our support team before seeking other means of resolution.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Governing Law</h2>
              <p className="text-muted-foreground">This policy is governed by the laws of the jurisdiction where CCIE LAB is registered.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Delays in Refunds</h2>
              <p className="text-muted-foreground">If you have not received an approved refund within the stated period, please check with your bank or card provider, as processing times may vary.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Policy Updates</h2>
              <p className="text-muted-foreground">CCIE LAB reserves the right to amend this policy at any time. Updates will be posted on our website to ensure transparency.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p>If you have any questions regarding this policy:</p>
              <p className="text-primary">Email: support@ccielab.net</p>
              <p className="text-primary">Website: www.ccielab.net</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage; 