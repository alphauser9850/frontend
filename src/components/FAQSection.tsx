import { useThemeStore } from '../store/themeStore';
import { AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How are the courses delivered?",
    answer: "Our courses are delivered through live interactive sessions, combining expert-led theory and extensive hands-on lab practice to ensure a real-world learning experience."
  },
  {
    question: "Will I get access to labs?",
    answer: "Yes! Every student gets dedicated access to our labs. We believe true mastery comes from practicing concepts,not just studying them"
  },
  {
    question: "Are the instructors certified professionals?",
    answer: "Yes, all our instructors are CISCO-certified professionals with real-world experience. They don't just teach — they mentor"
  },
  {
    question: "Do you offer career support after the course?",
    answer: "Definitely. We offer career guidance, interview preparation, and mentorship even after your course ends, helping you succeed beyond just certifications."
  },
  {
    question: "Are there any prerequisites for joining?",
    answer: "While some advanced programs may need prior knowledge, we offer beginner to expert-level training paths. You can start where you are and grow with us."
  },
  {
    question: "How is your training different from others?",
    answer: "We focus on practical learning, real-time troubleshooting, project-based training, and a personal mentorship approach — not just theory or slides."
  },
  {
    question: "Can I practice labs after the course timing?",
    answer: "Yes, lab access is flexible . You can continue practicing outside class hours based on your schedule and availability."
  },
  {
    question: "Do you offer certification exam guidance?",
    answer: "Of course! We guide you through the entire certification process — right from preparation strategies to mock exams and final readiness assessments."
  },
  {
    question: "What happens if I miss a session?",
    answer: "No worries — you can access the session recordings, and our support team is always there to help you catch up on any missed topics."
  },
  {
    question: "I have taken a break from my work of 1 year to pursue CCIE, will there be a problem in interviews that I will face?",
    answer: "Taking a year to prepare for CCIE wont hurt your job prospects—if you clearly present it as a strategic investment in your skills. Emphasize the depth of knowledge and commitment you have gained to position it as career advancing move."
  },
    {
    question: "Are weekend classes available?",
    answer: "No. Only Weekday classes are available(MON - THU)."
  },
  {
    question: "How can I register for the training?",
    answer: "Feel free to reach out to us at +91 7972852821 or support@ccielab.net. You can also share your details through our contact form — we'll get back to you shortly with all the information you need."
  },
  {
    question: "Are there any installment options for the payment? In that case, what are the late fee charges?",
    answer: "Actually we offer 3 installment options. There will be no extra charges for late payment, but they will be not permitted to the classes if amount is not paid in time."
  },
  {
    question: " What are the payment modes available?",
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
