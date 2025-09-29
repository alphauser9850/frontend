import { useThemeStore } from '../store/themeStore';
import { AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How are the CCIE courses delivered?",
    answer: "Our courses are delivered through live interactive sessions, combining expert-led theory and extensive hands-on lab practice to ensure a real-world learning experience."
  },
  {
    question: "Will I get CCIE lab access?",
    answer: "Yes! Every student gets dedicated access to our labs. We believe true mastery comes from practicing concepts,not just studying them"
  },
  {
    question: "Are the instructors CCIE certified professionals?",
    answer: "Yes, all our instructors are CISCO-certified professionals with real-world experience. They don't just teach — they mentor"
  },
  {
    question: "Do you provide career support?",
    answer: "Definitely. We offer career guidance, interview preparation, and mentorship even after your course ends, helping you succeed beyond just certifications."
  },
  {
    question: "Are there any prerequisites to join this CCIE Training program?",
    answer: "While some advanced programs may need prior knowledge, we offer beginner to expert-level training paths. You can start where you are and grow with us."
  },
  {
    question: "What makes your CCIE training unique?",
    answer: "We focus on practical learning, real-time troubleshooting, project-based training, and a personal mentorship approach — not just theory or slides."
  },
  {
    question: "Can I access labs after class hours?",
    answer: "Yes, lab access is flexible . You can continue practicing outside class hours based on your schedule and availability."
  },
  {
    question: "Do you guide for CCIE certification exams?",
    answer: "Of course! We guide you through the entire certification process — right from preparation strategies to mock exams and final readiness assessments."
  },
  {
    question: "What if I miss a session?",
    answer: "No worries — you can access the session recordings, and our support team is always there to help you catch up on any missed topics."
  },
  {
    question: "Will a career break affect my chances after CCIE?",
    answer: "Taking a year to prepare for CCIE wont hurt your job prospects—if you clearly present it as a strategic investment in your skills. Emphasize the depth of knowledge and commitment you have gained to position it as career advancing move."
  },
    {
    question: "Do you have weekend classes?",
    answer: "No. Only Weekday classes are available(MON - THU)."
  },
  {
    question: "How can I register this CCIE Certification Program?",
    answer: "Feel free to reach out to us at +91 7972852821 or support@ccielab.net. You can also share your details through our contact form — we'll get back to you shortly with all the information you need."
  },
   {
    question: "Do you offer installment payment options?",
    answer: "Actually we offer 3 installment options. "
  },
  {
    question: "What are the late fee charges?",
    answer: "There will be no extra charges for late payment, but they will be not permitted to the classes if amount is not paid in time."
  },
  {
    question: "Which payment modes are available?",
    answer: "We accept payments using methods such as net banking, NEFT/RTGS, Credit/Debit cards, PayPal, UPI."
  }

];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border-b border-border-subtle py-4 cursor-pointer transition-all hover:bg-surface-variant/50 rounded-lg px-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-text-primary">
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 transform transition-transform duration-300 text-text-secondary",
            isOpen ? "rotate-180" : ""
          )}
        />
      </div>
      {isOpen && (
        <p className="mt-2 text-sm text-text-secondary">
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => {
  return (
    <section className="bg-gradient-section py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-heading-1 font-bold text-text-primary">
            Frequently Asked <AuroraText>Questions</AuroraText>
          </h2>
          <p className="mt-4 text-body text-text-secondary">
            Get answers to the most common questions about our certification programs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
