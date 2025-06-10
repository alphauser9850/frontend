import React, { useState } from 'react';
import { AuroraText, ShineBorder } from './magicui';
import { Mail, Phone, MapPin, Send, User, Briefcase, Calendar, GraduationCap, CheckCircle } from 'lucide-react';
import { ContactFormData } from '../services/formService';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface ContactSectionProps {
  source?: 'home-page' | 'contact-page';
}

const ContactSection: React.FC<ContactSectionProps> = ({ source = 'contact-page' }) => {
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    interest: 'CCNA',
    preferredDate: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Import the form service
      const { submitFormToN8n } = await import('../services/formService');
      
      // Prepare data for n8n using the formData state
      const submissionData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: source
      };
      
      // Add additional fields that aren't in the ContactFormData interface
      const fullSubmissionData = {
        ...submissionData,
        company: formData.company,
        interest: formData.interest,
        preferredDate: formData.preferredDate
      };
      
      // Log the data being submitted for debugging
      console.log('Submitting form data:', fullSubmissionData);
      
      // Submit to n8n
      const result = await submitFormToN8n(submissionData);
      
      if (result.success) {
        console.log('Form submitted successfully');
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          interest: 'CCNA',
          preferredDate: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(
      "py-24 relative overflow-hidden",
      isDarkMode 
        ? "bg-gradient-to-b from-black to-indigo-950/30" 
        : "bg-gradient-to-b from-white to-gray-50"
    )}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Let's <AuroraText>Connect</AuroraText>
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDarkMode ? "text-white/70" : "text-gray-600"
          )}>
            Have questions about our courses or need personalized guidance? Reach out to our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="relative group">
            <ShineBorder className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={cn(
              "rounded-xl p-8 border relative z-10 transition-all duration-300 group-hover:border-transparent",
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm border-white/10" 
                : "bg-white shadow-lg border-gray-100"
            )}>
              <h3 className={cn(
                "text-2xl font-bold mb-6 flex items-center",
                isDarkMode ? "text-white" : "text-gray-900" 
              )}>
                <Send className="h-6 w-6 mr-2 text-primary" />
                Send Us a Message
              </h3>
              
              {isSubmitted ? (
                <div className={cn(
                  "border rounded-lg p-8 text-center",
                  isDarkMode 
                    ? "bg-green-500/20 border-green-500/30" 
                    : "bg-green-50 border-green-200"
                )}>
                  <div className={cn(
                    "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
                    isDarkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
                  )}>
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h4 className={cn(
                    "text-2xl font-semibold mb-3",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>Message Sent!</h4>
                  <p className={isDarkMode ? "text-white/70 mb-4" : "text-gray-600 mb-4"}>
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                  <div className="w-16 h-1 bg-green-500/50 mx-auto rounded-full"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            isDarkMode 
                              ? `bg-white/5 border ${formErrors.name ? 'border-red-400' : 'border-white/10'} text-white` 
                              : `bg-white border ${formErrors.name ? 'border-red-400' : 'border-gray-200'} text-gray-900`
                          )}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contact-email" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            isDarkMode 
                              ? `bg-white/5 border ${formErrors.email ? 'border-red-400' : 'border-white/10'} text-white` 
                              : `bg-white border ${formErrors.email ? 'border-red-400' : 'border-gray-200'} text-gray-900`
                          )}
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contact-phone" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="tel"
                          id="contact-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            isDarkMode 
                              ? "bg-white/5 border border-white/10 text-white" 
                              : "bg-white border border-gray-200 text-gray-900"
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="company" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Company
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            isDarkMode 
                              ? "bg-white/5 border border-white/10 text-white" 
                              : "bg-white border border-gray-200 text-gray-900"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="interest" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Interested In
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GraduationCap className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <select
                          id="interest"
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200 appearance-none",
                            isDarkMode 
                              ? "bg-white/5 border border-white/10 text-white" 
                              : "bg-white border border-gray-200 text-gray-900"
                          )}
                          style={{ 
                            backgroundImage: isDarkMode 
                              ? "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" 
                              : "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundPosition: "right 0.5rem center", 
                            backgroundRepeat: "no-repeat", 
                            backgroundSize: "1.5em 1.5em", 
                            paddingRight: "2.5rem" 
                          }}
                        >
                          <option value="CCNA">CCNA R&S Certification</option>
                          <option value="CCNP">CCNP Certification</option>
                          <option value="CCIE">CCIE Certification</option>
                          <option value="SD-WAN">SD-WAN Certification</option>
                          <option value="SD-ACCESS">SD-ACCESS Certification</option>
                          <option value="Custom">Custom Training</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="preferredDate" className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-white/70" : "text-gray-700"
                      )}>
                        Preferred Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className={isDarkMode ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="date"
                          id="preferredDate"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            isDarkMode 
                              ? "bg-white/5 border border-white/10 text-white [color-scheme:dark]" 
                              : "bg-white border border-gray-200 text-gray-900 [color-scheme:light]"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contact-message" className={cn(
                      "block text-sm font-medium mb-2",
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    )}>
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={cn(
                        "rounded-lg block w-full p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                        isDarkMode 
                          ? `bg-white/5 border ${formErrors.message ? 'border-red-400' : 'border-white/10'} text-white` 
                          : `bg-white border ${formErrors.message ? 'border-red-400' : 'border-gray-200'} text-gray-900`
                      )}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center",
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-primary/20'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className={cn(
            "rounded-xl p-8 border h-full relative",
            isDarkMode 
              ? "bg-white/5 backdrop-blur-sm border-white/10" 
              : "bg-white shadow-lg border-gray-100"
          )}>
            <h3 className={cn(
              "text-2xl font-bold mb-6",
              isDarkMode ? "text-white" : "text-gray-900" 
            )}>
              Contact Information
            </h3>
            
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="ml-4">
                <h4 className={cn(
                  "text-xl font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>Our Location</h4>
                <p className={cn(
                  "text-gray-700",
                  isDarkMode ? "text-white/70" : "text-gray-600"
                )}> 
                  India 
                    
                  </p>
              </div>
            </div><br/>
            
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="ml-4">
                <h4 className={cn(
                  "text-xl font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>Email Us</h4>
                <p className={cn(
                  "text-gray-700",
                  isDarkMode ? "text-white/70" : "text-gray-600"
                )}>
                    support@ccielab.net
                  </p>
              </div>
            </div><br/>
            
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="ml-4">
                <h4 className={cn(
                  "text-xl font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>Call Us</h4>
                <p className={cn(
                  "text-gray-700",
                  isDarkMode ? "text-white/70" : "text-gray-600"
                )}>
                    +91 7972852821
                  </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/20 to-indigo-600/20 rounded-xl border border-white/10">
              <h4 className={cn(
                "text-xl font-bold mb-3",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Quick Response Guarantee</h4>
              <p className={cn(
                "text-gray-700",
                isDarkMode ? "text-white/70" : "text-gray-600"
              )}>
                We aim to respond to all inquiries within 24 hours. Our team is dedicated to providing you with the information and support you need to advance your networking career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactSection }; 