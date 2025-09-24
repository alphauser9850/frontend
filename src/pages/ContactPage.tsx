import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  User, 
  MessageCircle, 
  Clock, 
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AuroraText, Particles, ShineBorder, BorderBeam } from '../components/magicui';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { submitFormToN8n, ContactFormData } from '../services/formService';
import { cn } from '../lib/utils';

// Contact information
const contactInfo = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Us",
    description: "Get in touch via email",
    value: "info@ccielab.net",
    link: "mailto:info@ccielab.net",
    color: "text-blue-500"
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Call Us",
    description: "Speak with our team",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567",
    color: "text-green-500"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Visit Us",
    description: "Online platform available 24/7",
    value: "ccielab.net",
    link: "https://ccielab.net",
    color: "text-purple-500"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Response Time",
    description: "We typically respond within 24 hours",
    value: "24 hours",
    color: "text-orange-500"
  }
];

// FAQ data for contact-related questions
const contactFAQ = [
  {
    question: "How quickly will I receive a response?",
    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please include 'URGENT' in your subject line."
  },
  {
    question: "What information should I include in my message?",
    answer: "Please include your name, contact information, specific course or service you're interested in, and any relevant details about your experience level or requirements."
  },
  {
    question: "Do you offer support for existing students?",
    answer: "Yes! Current students can contact us for technical support, course guidance, or any questions about their learning journey."
  },
  {
    question: "Can I schedule a consultation call?",
    answer: "Absolutely! We offer free consultation calls to discuss your learning goals and recommend the best path forward. Just mention this in your message."
  }
];

const ContactPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    countryCode: '+1'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Function to detect if text contains links
  const containsLinks = (text: string): boolean => {
    const linkPatterns = [
      /https?:\/\/[^\s]+/gi,           // HTTP/HTTPS URLs
      /www\.[^\s]+/gi,                  // WWW URLs
      /[^\s]+\.[a-z]{2,}/gi,           // Domain patterns
      /bit\.ly\/[^\s]+/gi,              // Bit.ly links
      /t\.co\/[^\s]+/gi,                // Twitter links
      /goo\.gl\/[^\s]+/gi,              // Google links
      /tinyurl\.com\/[^\s]+/gi,         // TinyURL links
      /[^\s]+\.com\/[^\s]*/gi,          // .com URLs
      /[^\s]+\.org\/[^\s]*/gi,          // .org URLs
      /[^\s]+\.net\/[^\s]*/gi,          // .net URLs
      /[^\s]+\.io\/[^\s]*/gi,           // .io URLs
      /[^\s]+\.co\/[^\s]*/gi,           // .co URLs
      /ftp:\/\/[^\s]+/gi,               // FTP URLs
      /mailto:[^\s]+/gi,                // Mailto links
      /tel:[^\s]+/gi,                   // Tel links
      /file:\/\/[^\s]+/gi               // File links
    ];
    
    return linkPatterns.some(pattern => pattern.test(text));
  };

  // Function to prevent link input
  const preventLinks = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Check if the new value contains links
    if (containsLinks(value)) {
      e.preventDefault();
      // Remove the link and show warning
      const cleanValue = value.replace(/https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,}|bit\.ly\/[^\s]+|t\.co\/[^\s]+|goo\.gl\/[^\s]+|tinyurl\.com\/[^\s]+|[^\s]+\.(com|org|net|io|co)\/[^\s]*|ftp:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|file:\/\/[^\s]+/gi, '');
      
      setFormData(prev => ({ ...prev, [id]: cleanValue }));
      
      // Show error message
      setErrors(prev => ({
        ...prev,
        [id]: 'Links are not allowed in this field'
      }));
      
      return false;
    }
    
    return true;
  };

  // Function to handle paste events and prevent links
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const pastedText = e.clipboardData.getData('text');
    
    // Check if pasted text contains links
    if (containsLinks(pastedText)) {
      // Show error message
      const { id } = e.currentTarget;
      setErrors(prev => ({
        ...prev,
        [id]: 'Links are not allowed in this field'
      }));
      
      // Optionally show a toast or alert
      alert('Links are not allowed in this field. Please remove any URLs before pasting.');
      return;
    }
    
    // If no links, allow the paste by manually setting the value
    const { id, value } = e.currentTarget;
    const newValue = value + pastedText;
    
    // Update the form data
    setFormData(prev => ({ ...prev, [id]: newValue }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    // For text inputs and textareas, check for links
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (!preventLinks(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)) {
        return; // Stop processing if links were detected
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        countryCode: formData.countryCode,
        source: 'contact-page'
      };
      
      const result = await submitFormToN8n(submissionData);
      
      if (result.success) {
        setFormSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          countryCode: '+1'
        });
        setErrors({});
      } else {
        setErrors({ submit: 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Get in Touch with CCIE Lab</title>
        <meta name="description" content="Have questions about CCIE training or enrollment? Contact CCIE Lab today. Our support team is here to assist you with course details, queries, and scheduling." />
         
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Contact Us | Get in Touch with CCIE Lab" />
        <meta property="og:description" content="Have questions about CCIE training or enrollment? Contact CCIE Lab today. Our support team is here to assist you with course details, queries, and scheduling." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ccielab.net/contact" />
        <link rel="canonical" href="https://ccielab.net/contact" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact CCIE LAB",
            "description": "Contact our team for Cisco certification training and support",
            "url": "https://ccielab.net/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "CCIE LAB",
              "email": "info@ccielab.net",
              "telephone": "+1 (555) 123-4567",
              "url": "https://ccielab.net"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen pt-20 bg-background">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-black z-0"></div>
          
          <Particles
            className="absolute inset-0 z-10"
            quantity={50}
            staticity={50}
            color="#6366f1"
            size={0.5}
          />
          
          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                <AuroraText>Contact Us</AuroraText>
              </h1>
              
              <p className="text-xl text-white/80 mb-8">
                Get in touch with our CCIE-certified instructors for personalized guidance and support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <BorderBeamWrapper key={index} beamColor="blue" duration={8}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <CardHeader className="text-center">
                      <div className={cn("mx-auto mb-4 p-3 rounded-full bg-muted", info.color)}>
                        {info.icon}
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-2">{info.description}</p>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-primary hover:underline font-medium"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </CardContent>
                  </Card>
                </BorderBeamWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="space-y-8">
                  <div>
                    <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                      Get In Touch
                    </span>
                    <h2 className="text-3xl font-bold mb-4">
                      <AuroraText>Send Us a Message</AuroraText>
                    </h2>
                    <p className="text-muted-foreground">
                      Have questions about our training programs? Need guidance on your certification journey? 
                      We're here to help you succeed.
                    </p>
                  </div>

                  {formSubmitted ? (
                    <BorderBeamWrapper beamColor="green" duration={8}>
                      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                              <h3 className="font-semibold text-green-800 dark:text-green-200">
                                Message Sent Successfully!
                              </h3>
                              <p className="text-green-600 dark:text-green-300">
                                Thank you for reaching out. We'll get back to you within 24 hours.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </BorderBeamWrapper>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onPaste={handlePaste}
                            className={cn(
                              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                              errors.name ? "border-red-500" : "border-border"
                            )}
                            placeholder="Enter your full name"
                            aria-describedby={errors.name ? "name-error" : undefined}
                          />
                          {errors.name && (
                            <p id="name-error" className="mt-1 text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onPaste={handlePaste}
                            className={cn(
                              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                              errors.email ? "border-red-500" : "border-border"
                            )}
                            placeholder="Enter your email address"
                            aria-describedby={errors.email ? "email-error" : undefined}
                          />
                          {errors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="countryCode" className="block text-sm font-medium mb-2">
                            Country Code
                          </label>
                          <select
                            id="countryCode"
                            value={formData.countryCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          >
                            <option value="+1">+1 (US/Canada)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+49">+49 (Germany)</option>
                            <option value="+33">+33 (France)</option>
                            <option value="+81">+81 (Japan)</option>
                            <option value="+86">+86 (China)</option>
                            <option value="+55">+55 (Brazil)</option>
                            <option value="+52">+52 (Mexico)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onPaste={handlePaste}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onPaste={handlePaste}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                            errors.subject ? "border-red-500" : "border-border"
                          )}
                          placeholder="What is this regarding?"
                          aria-describedby={errors.subject ? "subject-error" : undefined}
                        />
                        {errors.subject && (
                          <p id="subject-error" className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          onPaste={handlePaste}
                          rows={6}
                          className={cn(
                            "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none",
                            errors.message ? "border-red-500" : "border-border"
                          )}
                          placeholder="Tell us about your inquiry, certification goals, or any questions you have..."
                          aria-describedby={errors.message ? "message-error" : undefined}
                        />
                        {errors.message && (
                          <p id="message-error" className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {errors.submit && (
                        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg">
                          <p className="text-red-600 dark:text-red-300 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {errors.submit}
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* FAQ Section */}
                <div className="space-y-8">
                  <div>
                    <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                      FAQ
                    </span>
                    <h2 className="text-3xl font-bold mb-4">
                      <AuroraText>Frequently Asked Questions</AuroraText>
                    </h2>
                    <p className="text-muted-foreground">
                      Find quick answers to common questions about contacting our team.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {contactFAQ.map((faq, index) => (
                      <BorderBeamWrapper key={index} beamColor="purple" duration={8}>
                        <Card className="transition-all duration-300 hover:shadow-md">
                          <CardHeader>
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </CardContent>
                        </Card>
                      </BorderBeamWrapper>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map/Additional Info Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                <AuroraText>Ready to Start Your Journey?</AuroraText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of network professionals who have transformed their careers with our expert training.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <BorderBeamWrapper beamColor="green" duration={8}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold mb-2">Expert Instructors</h3>
                      <p className="text-muted-foreground">Learn from CCIE-certified professionals with real-world experience.</p>
                    </CardContent>
                  </Card>
                </BorderBeamWrapper>

                <BorderBeamWrapper beamColor="blue" duration={8}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold mb-2">24/7 Support</h3>
                      <p className="text-muted-foreground">Get help whenever you need it with our comprehensive support system.</p>
                    </CardContent>
                  </Card>
                </BorderBeamWrapper>

                <BorderBeamWrapper beamColor="purple" duration={8}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold mb-2">Global Community</h3>
                      <p className="text-muted-foreground">Connect with network professionals from around the world.</p>
                    </CardContent>
                  </Card>
                </BorderBeamWrapper>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage; 