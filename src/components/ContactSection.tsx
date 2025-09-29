import React, { useState, useEffect } from 'react';
import { AuroraText, ShineBorder } from './magicui';
import { Mail, Phone, MapPin, Send, User, CheckCircle } from 'lucide-react';
import { ContactFormData } from '../services/formService';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface ContactSectionProps {
  source?: 'home-page' | 'ccie-page';
}

const ContactSection: React.FC<ContactSectionProps> = ({ source = 'home-page' }) => {
  const { isDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeClass = mounted && isDarkMode;
  const countryOptions = [
    { code: '+1', name: 'United States' },
    { code: '+93', name: 'Afghanistan' },
    { code: '+355', name: 'Albania' },
    { code: '+213', name: 'Algeria' },
    { code: '+376', name: 'Andorra' },
    { code: '+244', name: 'Angola' },
    { code: '+1-268', name: 'Antigua and Barbuda' },
    { code: '+54', name: 'Argentina' },
    { code: '+374', name: 'Armenia' },
    { code: '+61', name: 'Australia' },
    { code: '+43', name: 'Austria' },
    { code: '+994', name: 'Azerbaijan' },
    { code: '+1-242', name: 'Bahamas' },
    { code: '+973', name: 'Bahrain' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+1-246', name: 'Barbados' },
    { code: '+375', name: 'Belarus' },
    { code: '+32', name: 'Belgium' },
    { code: '+501', name: 'Belize' },
    { code: '+229', name: 'Benin' },
    { code: '+1-441', name: 'Bermuda' },
    { code: '+975', name: 'Bhutan' },
    { code: '+591', name: 'Bolivia' },
    { code: '+387', name: 'Bosnia and Herzegovina' },
    { code: '+267', name: 'Botswana' },
    { code: '+55', name: 'Brazil' },
    { code: '+246', name: 'British Indian Ocean Territory' },
    { code: '+1-284', name: 'British Virgin Islands' },
    { code: '+673', name: 'Brunei' },
    { code: '+359', name: 'Bulgaria' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+257', name: 'Burundi' },
    { code: '+855', name: 'Cambodia' },
    { code: '+237', name: 'Cameroon' },
    { code: '+1', name: 'Canada' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+1-345', name: 'Cayman Islands' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+235', name: 'Chad' },
    { code: '+56', name: 'Chile' },
    { code: '+86', name: 'China' },
    { code: '+61', name: 'Christmas Island' },
    { code: '+61', name: 'Cocos Islands' },
    { code: '+57', name: 'Colombia' },
    { code: '+269', name: 'Comoros' },
    { code: '+682', name: 'Cook Islands' },
    { code: '+506', name: 'Costa Rica' },
    { code: '+385', name: 'Croatia' },
    { code: '+53', name: 'Cuba' },
    { code: '+599', name: 'Curacao' },
    { code: '+357', name: 'Cyprus' },
    { code: '+420', name: 'Czech Republic' },
    { code: '+243', name: 'Democratic Republic of the Congo' },
    { code: '+45', name: 'Denmark' },
    { code: '+253', name: 'Djibouti' },
    { code: '+1-767', name: 'Dominica' },
    { code: '+1-809', name: 'Dominican Republic' },
    { code: '+670', name: 'East Timor' },
    { code: '+593', name: 'Ecuador' },
    { code: '+20', name: 'Egypt' },
    { code: '+503', name: 'El Salvador' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+291', name: 'Eritrea' },
    { code: '+372', name: 'Estonia' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+500', name: 'Falkland Islands' },
    { code: '+298', name: 'Faroe Islands' },
    { code: '+679', name: 'Fiji' },
    { code: '+358', name: 'Finland' },
    { code: '+33', name: 'France' },
    { code: '+594', name: 'French Guiana' },
    { code: '+689', name: 'French Polynesia' },
    { code: '+241', name: 'Gabon' },
    { code: '+220', name: 'Gambia' },
    { code: '+995', name: 'Georgia' },
    { code: '+49', name: 'Germany' },
    { code: '+233', name: 'Ghana' },
    { code: '+350', name: 'Gibraltar' },
    { code: '+30', name: 'Greece' },
    { code: '+299', name: 'Greenland' },
    { code: '+1-473', name: 'Grenada' },
    { code: '+590', name: 'Guadeloupe' },
    { code: '+1-671', name: 'Guam' },
    { code: '+502', name: 'Guatemala' },
    { code: '+44-1481', name: 'Guernsey' },
    { code: '+224', name: 'Guinea' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+592', name: 'Guyana' },
    { code: '+509', name: 'Haiti' },
    { code: '+504', name: 'Honduras' },
    { code: '+852', name: 'Hong Kong' },
    { code: '+36', name: 'Hungary' },
    { code: '+354', name: 'Iceland' },
    { code: '+91', name: 'India' },
    { code: '+62', name: 'Indonesia' },
    { code: '+98', name: 'Iran' },
    { code: '+964', name: 'Iraq' },
    { code: '+353', name: 'Ireland' },
    { code: '+44-1624', name: 'Isle of Man' },
    { code: '+972', name: 'Israel' },
    { code: '+39', name: 'Italy' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+1-876', name: 'Jamaica' },
    { code: '+81', name: 'Japan' },
    { code: '+44-1534', name: 'Jersey' },
    { code: '+962', name: 'Jordan' },
    { code: '+7', name: 'Kazakhstan' },
    { code: '+254', name: 'Kenya' },
    { code: '+686', name: 'Kiribati' },
    { code: '+383', name: 'Kosovo' },
    { code: '+965', name: 'Kuwait' },
    { code: '+996', name: 'Kyrgyzstan' },
    { code: '+856', name: 'Laos' },
    { code: '+371', name: 'Latvia' },
    { code: '+961', name: 'Lebanon' },
    { code: '+266', name: 'Lesotho' },
    { code: '+231', name: 'Liberia' },
    { code: '+218', name: 'Libya' },
    { code: '+423', name: 'Liechtenstein' },
    { code: '+370', name: 'Lithuania' },
    { code: '+352', name: 'Luxembourg' },
    { code: '+853', name: 'Macau' },
    { code: '+389', name: 'Macedonia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+265', name: 'Malawi' },
    { code: '+60', name: 'Malaysia' },
    { code: '+960', name: 'Maldives' },
    { code: '+223', name: 'Mali' },
    { code: '+356', name: 'Malta' },
    { code: '+692', name: 'Marshall Islands' },
    { code: '+596', name: 'Martinique' },
    { code: '+222', name: 'Mauritania' },
    { code: '+230', name: 'Mauritius' },
    { code: '+262', name: 'Mayotte' },
    { code: '+52', name: 'Mexico' },
    { code: '+691', name: 'Micronesia' },
    { code: '+373', name: 'Moldova' },
    { code: '+377', name: 'Monaco' },
    { code: '+976', name: 'Mongolia' },
    { code: '+382', name: 'Montenegro' },
    { code: '+1-664', name: 'Montserrat' },
    { code: '+212', name: 'Morocco' },
    { code: '+258', name: 'Mozambique' },
    { code: '+95', name: 'Myanmar' },
    { code: '+264', name: 'Namibia' },
    { code: '+674', name: 'Nauru' },
    { code: '+977', name: 'Nepal' },
    { code: '+31', name: 'Netherlands' },
    { code: '+599', name: 'Netherlands Antilles' },
    { code: '+687', name: 'New Caledonia' },
    { code: '+64', name: 'New Zealand' },
    { code: '+505', name: 'Nicaragua' },
    { code: '+227', name: 'Niger' },
    { code: '+234', name: 'Nigeria' },
    { code: '+683', name: 'Niue' },
    { code: '+672', name: 'Norfolk Island' },
    { code: '+850', name: 'North Korea' },
    { code: '+1-670', name: 'Northern Mariana Islands' },
    { code: '+47', name: 'Norway' },
    { code: '+968', name: 'Oman' },
    { code: '+92', name: 'Pakistan' },
    { code: '+680', name: 'Palau' },
    { code: '+970', name: 'Palestine' },
    { code: '+507', name: 'Panama' },
    { code: '+675', name: 'Papua New Guinea' },
    { code: '+595', name: 'Paraguay' },
    { code: '+51', name: 'Peru' },
    { code: '+63', name: 'Philippines' },
    { code: '+48', name: 'Poland' },
    { code: '+351', name: 'Portugal' },
    { code: '+1-787', name: 'Puerto Rico' },
    { code: '+974', name: 'Qatar' },
    { code: '+242', name: 'Republic of the Congo' },
    { code: '+262', name: 'Reunion' },
    { code: '+40', name: 'Romania' },
    { code: '+7', name: 'Russia' },
    { code: '+250', name: 'Rwanda' },
    { code: '+590', name: 'Saint Barthelemy' },
    { code: '+290', name: 'Saint Helena' },
    { code: '+1-869', name: 'Saint Kitts and Nevis' },
    { code: '+1-758', name: 'Saint Lucia' },
    { code: '+590', name: 'Saint Martin' },
    { code: '+508', name: 'Saint Pierre and Miquelon' },
    { code: '+1-784', name: 'Saint Vincent and the Grenadines' },
    { code: '+685', name: 'Samoa' },
    { code: '+378', name: 'San Marino' },
    { code: '+239', name: 'Sao Tome and Principe' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+221', name: 'Senegal' },
    { code: '+381', name: 'Serbia' },
    { code: '+248', name: 'Seychelles' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+65', name: 'Singapore' },
    { code: '+1-721', name: 'Sint Maarten' },
    { code: '+421', name: 'Slovakia' },
    { code: '+386', name: 'Slovenia' },
    { code: '+677', name: 'Solomon Islands' },
    { code: '+252', name: 'Somalia' },
    { code: '+27', name: 'South Africa' },
    { code: '+82', name: 'South Korea' },
    { code: '+211', name: 'South Sudan' },
    { code: '+34', name: 'Spain' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+249', name: 'Sudan' },
    { code: '+597', name: 'Suriname' },
    { code: '+47', name: 'Svalbard and Jan Mayen' },
    { code: '+268', name: 'Swaziland' },
    { code: '+46', name: 'Sweden' },
    { code: '+41', name: 'Switzerland' },
    { code: '+963', name: 'Syria' },
    { code: '+886', name: 'Taiwan' },
    { code: '+992', name: 'Tajikistan' },
    { code: '+255', name: 'Tanzania' },
    { code: '+66', name: 'Thailand' },
    { code: '+228', name: 'Togo' },
    { code: '+690', name: 'Tokelau' },
    { code: '+676', name: 'Tonga' },
    { code: '+1-868', name: 'Trinidad and Tobago' },
    { code: '+216', name: 'Tunisia' },
    { code: '+90', name: 'Turkey' },
    { code: '+993', name: 'Turkmenistan' },
    { code: '+1-649', name: 'Turks and Caicos Islands' },
    { code: '+688', name: 'Tuvalu' },
    { code: '+256', name: 'Uganda' },
    { code: '+380', name: 'Ukraine' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+1', name: 'United States' },
    { code: '+598', name: 'Uruguay' },
    { code: '+998', name: 'Uzbekistan' },
    { code: '+678', name: 'Vanuatu' },
    { code: '+379', name: 'Vatican' },
    { code: '+58', name: 'Venezuela' },
    { code: '+84', name: 'Vietnam' },
    { code: '+1-284', name: 'Virgin Islands, British' },
    { code: '+1-340', name: 'Virgin Islands, U.S.' },
    { code: '+681', name: 'Wallis and Futuna' },
    { code: '+212', name: 'Western Sahara' },
    { code: '+967', name: 'Yemen' },
    { code: '+260', name: 'Zambia' },
    { code: '+263', name: 'Zimbabwe' }
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: countryOptions[0].name,
    message: ''
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { submitFormToN8n } = await import('../services/formService');
      const submissionData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source
      };
      await submitFormToN8n(submissionData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: countryOptions[0].name,
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    const { name, value } = e.target;
    
    // Check if the new value contains links
    if (containsLinks(value)) {
      e.preventDefault();
      // Remove the link and show warning
      const cleanValue = value.replace(/https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,}|bit\.ly\/[^\s]+|t\.co\/[^\s]+|goo\.gl\/[^\s]+|tinyurl\.com\/[^\s]+|[^\s]+\.(com|org|net|io|co)\/[^\s]*|ftp:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|file:\/\/[^\s]+/gi, '');
      
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      
      // Show error message
      setFormErrors(prev => ({
        ...prev,
        [name]: 'Links are not allowed in this field'
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
      const { name } = e.currentTarget;
      setFormErrors(prev => ({
        ...prev,
        [name]: 'Links are not allowed in this field'
      }));

      // Optionally show a toast or alert
      alert('Links are not allowed in this field. Please remove any URLs before pasting.');
      return;
    }

    // If no links, allow the paste by manually setting the value
    const { name, value } = e.currentTarget;
    const newValue = value + pastedText;

    // Update the form data
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For text inputs and textareas, check for links

    if ((e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && name != 'email') {
      if (!preventLinks(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)) {
        return; // Stop processing if links were detected
      }
    }

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    const countryObj = countryOptions.find(c => c.name === country);
    setFormData(prev => ({ ...prev, country }));
    if (countryObj) {
      setSelectedCountryCode(countryObj.code);
      // If phone doesn't start with the new code, update it
      setFormData(prev => ({
        ...prev,
        phone: prev.phone.replace(/^\+\d+\s*/, countryObj.code + ' ')
      }));
    }
  };



  return (
    <section
      className={cn(
        "py-24 relative overflow-hidden contactForm",
        themeClass ? "bg-gradient-to-b from-black to-indigo-950/30" : "bg-gradient-to-b from-white to-gray-50"
      )}
    >
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", themeClass ? "text-white" : "text-gray-900")}>
            Let’s <AuroraText>Connect</AuroraText>
          </h2>
          <p className={cn("text-lg max-w-2xl mx-auto", themeClass ? "text-white/70" : "text-gray-600")}>
            Have questions about our courses or need personalized guidance? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative group">
            <ShineBorder className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div
              className={cn(
                "rounded-xl p-8 border relative z-10 transition-all duration-300 group-hover:border-transparent",
                themeClass ? "bg-white/5 backdrop-blur-sm border-white/10" : "bg-white shadow-lg border-gray-100"
              )}
            >
              <h3 className={cn("text-2xl font-bold mb-6 flex items-center", themeClass ? "text-white" : "text-gray-900")}>
                <Send className="h-6 w-6 mr-2 text-primary" />
                Send Us a Message
              </h3>

              {isSubmitted ? (
                <div className={cn("border rounded-lg p-8 text-center", themeClass ? "bg-green-500/20 border-green-500/30" : "bg-green-50 border-green-200")}>
                  <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full mb-4", themeClass ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600")}>
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h4 className={cn("text-2xl font-semibold mb-3", themeClass ? "text-white" : "text-gray-900")}>Message Sent!</h4>
                  <p className={themeClass ? "text-white/70 mb-4" : "text-gray-600 mb-4"}>
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
                        themeClass ? "text-white/70" : "text-gray-700"
                      )}>
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={themeClass ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onPaste={handlePaste}
                          required
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            themeClass
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
                        themeClass ? "text-white/70" : "text-gray-700"
                      )}>
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={themeClass ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onPaste={handlePaste}
                          required
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            themeClass
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
                      <label htmlFor="country" className={cn(
                        "block text-sm font-medium mb-2",
                        themeClass ? "text-white/70" : "text-gray-700"
                      )}>
                        Country
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleCountryChange}
                          className={cn(
                            "rounded-lg block w-full p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200 appearance-none",
                            themeClass
                              ? "bg-white/5 border border-white/10 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          )}
                        >
                          {countryOptions.map((country, i) => (
                            <option key={i} value={country.name}>{country.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className={cn(
                        "block text-sm font-medium mb-2",
                        themeClass ? "text-white/70" : "text-gray-700"
                      )}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className={themeClass ? "h-5 w-5 text-white/40" : "h-5 w-5 text-gray-400"} />
                        </div>
                        <input
                          type="tel"
                          id="contact-phone"
                          name="phone"
                          value={formData.phone.startsWith(selectedCountryCode) ? formData.phone : selectedCountryCode + ' ' + formData.phone.replace(/^\+\d+\s*/, '')}
                          onChange={handleChange}
                          onPaste={handlePaste}
                          className={cn(
                            "rounded-lg block w-full pl-10 p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                            themeClass
                              ? "bg-white/5 border border-white/200 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={cn(
                      "block text-sm font-medium mb-2",
                      themeClass ? "text-white/70" : "text-gray-700"
                    )}>
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onPaste={handlePaste}
                      required
                      rows={5}
                      className={cn(
                        "rounded-lg block w-full p-2.5 focus:ring-primary focus:border-primary/50 outline-none transition-colors duration-200",
                        themeClass
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

          <div className={cn("rounded-xl p-8 border h-full relative", themeClass ? "bg-white/5 backdrop-blur-sm border-white/10" : "bg-white shadow-lg border-gray-100")}>
            <h3 className={cn("text-2xl font-bold mb-6", themeClass ? "text-white" : "text-gray-900")}>Contact Information</h3>
                        <div className="flex items-start">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="ml-4">
                <h4 className={cn(
                  "text-xl font-bold mb-2",
                  themeClass ? "text-white" : "text-gray-900"
                )}>Our Location</h4>
                <p className={cn(
                  "text-gray-700",
                  themeClass ? "text-white/70" : "text-gray-600"
                )}> 
                  2175 Goodyear Ave. Ste 110 Ventura CA 93003
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
                  themeClass ? "text-white" : "text-gray-900"
                )}>Email Us</h4>
                <p className={cn(
                  "text-gray-700",
                  themeClass ? "text-white/70" : "text-gray-600"
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
                  themeClass ? "text-white" : "text-gray-900"
                )}>Call Us</h4>
                <p className={cn(
                  "text-gray-700",
                  themeClass ? "text-white/70" : "text-gray-600"
                )}>
                    +1 760 858 0505
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/20 to-indigo-600/20 rounded-xl border border-white/10">
              <h4 className={cn(
                "text-xl font-bold mb-3",
                themeClass ? "text-white" : "text-gray-900"
              )}>Quick Response Guarantee</h4>
              <p className={cn(
                "text-gray-700",
                themeClass ? "text-white/70" : "text-gray-600"
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
