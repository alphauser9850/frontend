import { useThemeStore } from '../store/themeStore';
import { AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the duration of your certification courses?",
    answer: "Most certification tracks range from 4 to 12 weeks, depending on the complexity and your learning pace."
  },
  {
    question: "Do I get lab access with every course?",
    answer: "Yes, all our courses come with 24/7 remote lab access to help you practice what you learn."
  },
  {
    question: "Are the instructors certified professionals?",
    answer: "Absolutely. All instructors are industry-certified and have real-world experience."
  },
  {
    question: "Do you offer career support after the course?",
    answer: "Yes, we offer resume building, mock interviews, and job referrals for top performers."
  }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "border-b py-4 cursor-pointer transition-all",
        isDarkMode ? "border-white/10" : "border-gray-200"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-800")}>
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 transform transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
        />
      </div>
      {isOpen && (
        <p className={cn("mt-2 text-sm", isDarkMode ? "text-white/70" : "text-gray-600")}>
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <section className={cn(
      "py-24",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={cn("text-3xl md:text-4xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
            Frequently Asked <AuroraText>Questions</AuroraText>
          </h2>
          <p className={cn("mt-4 text-lg", isDarkMode ? "text-white/70" : "text-gray-600")}>
            Get answers to the most common questions about our certification programs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
