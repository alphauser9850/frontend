import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Award, BookOpen, Code, Users, Play, FileText, Server, Clock, BarChart, CheckCircle, Layers, Network, Globe, Workflow, ArrowLeft, ArrowRight, Send, MapPin, MessageCircle, Linkedin, CheckCheckIcon } from 'lucide-react';
import { AuroraText, Particles, ShineBorder } from '../components/magicui';
import { cn } from '../lib/utils';
import { CCIETimeline } from '../components/CCIETimeline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { CCIEFormData } from '../services/formService';
import UpecommingCcieTable from './UpcommingCcieTable';
import CCIELabInfrastructure from './CCIELabInfrastructure';
import CCIeDemoMetting from './CcieDemoMetting';
import CCIEExamDetail from './CCIEExamDetail';
import { FAqs } from '../components/ui/Faqs';
import { useThemeStore } from '../store/themeStore';
import CciePricingPage from './ CciePricingPage';
import { Helmet } from 'react-helmet-async';
import CCIESyllabus from '../components/ui/SyllabusAccordion';

// Sample lab topologies data
const labTopologies = [
  {
    id: 1,
    title: "Enterprise Campus Network",
    description: "Complete enterprise campus design with core, distribution, and access layers",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "SD-WAN Deployment",
    description: "Multi-site SD-WAN topology with controllers and edge devices",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "BGP Service Provider",
    description: "Service provider backbone with BGP routing and MPLS services",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Network Automation Lab",
    description: "Infrastructure automation with Python, Ansible and CI/CD pipelines",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Security Infrastructure",
    description: "Enterprise security architecture with ISE, firewalls and segmentation",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }
];



const CCIEPage: React.FC = () => {
  // State for carousel
  const { isDarkMode } = useThemeStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    try {
      // Import the form service
      const { submitFormToN8n } = await import('../services/formService');

      // Prepare data for n8n using the formData state
      const submissionData: CCIEFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: 'ccie-page'
      };

      // Submit to n8n
      const result = await submitFormToN8n(submissionData);

      if (result.success) {
        setFormSubmitted(true);
        // Reset form fields
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    try {
      // Import the form service
      const { submitFormToN8n } = await import('../services/formService');

      // Prepare data for n8n using the contactFormData state
      const submissionData: CCIEFormData = {
        firstName: contactFormData.firstName,
        lastName: contactFormData.lastName,
        name: `${contactFormData.firstName} ${contactFormData.lastName}`.trim(),
        email: contactFormData.email,
        phone: contactFormData.phone,
        message: contactFormData.message,
        source: 'ccie-page-contact'
      };

      // Submit to n8n
      const result = await submitFormToN8n(submissionData);

      if (result.success) {
        // Show success message
        alert('Thank you for your message! We will contact you soon.');
        // Reset form
        setContactFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === labTopologies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? labTopologies.length - 1 : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Course instructors
  const instructors = [
    {
      name: "Saif Deshmukh",
      role: "Lead CCIE Instructor",
      certification: "CCIE® Enterprise Infrastructure v1.1 Instructor",
      experience: "10+ years",
      description: "CCIE-certified instructor (#67714) with deep expertise in SD-WAN, SD-Access & automation, delivering practical, lab-focused training for certification success.",
      image: "/saif_deshmukh.jpg",
      linkedin: "https://www.linkedin.com/in/deshmukh-saif/",
      highlights: [
        "CCIE-certified expert in Enterprise Infrastructure v1.1",
        "Strong expertise in SD-WAN, SD-Access, IPv6, and Network Automation",
        "Skilled in designing, deploying, and securing enterprise networks",
        "Hands-on experience with Versa SD-WAN, Viptela, Juniper EX switches, and SRX firewalls",
        "Known for delivering detailed, practical, and lab-driven training",
        "Proven track record of helping aspirants succeed in CCNP & CCIE certifications"
      ]
    }
  ];
  // Course features
  const features = [
    {
      icon: <Play className="h-6 w-6 text-primary" />,
      title: " Access to Live Recorded Videos",
      description: "Access comprehensive recorded sessions covering all CCIE Enterprise Infrastructure topics. Review complex concepts anytime, anywhere with lifetime access to expert-led training content."
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Virtual Lab Environment",
      description: "Practice on real Cisco equipment remotely 24/7. Book lab sessions in 1-hour increments with pre-configured topologies matching actual CCIE exam scenarios for hands-on experience."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Downloadable Resources",
      description: "Get detailed study guides, configuration templates, cheat sheets, and workbooks. Everything you need for offline study including network diagrams and troubleshooting references."
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Mock Exams",
      description: "Test your knowledge with realistic CCIE lab simulations. Timed practice sessions with detailed feedback help you identify weak areas and build confidence before the actual exam."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Self-Study Toolkit",
      description: "Comprehensive learning materials including video tutorials, practice labs, documentation, and study schedules. Self-paced learning resources to supplement live training sessions."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Instructor Support",
      description: "Get direct access to CCIE #67714 expert Mr. Saif Deshmukh. Email support, messaging, and dedicated hours for doubt resolution throughout your certification journey."
    },
  ];

  // Success stories
  const successStories = [
    {
      name: "Michael Chen",
      role: "Network Engineer at Fortune 500",
      quote: "The labs and practice scenarios were instrumental in my exam success. I passed on my first attempt!",
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Jessica Patel",
      role: "Senior Infrastructure Engineer",
      quote: "The depth of content and instructor support made all the difference. Highly recommended for serious CCIE candidates.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
  ];

  // Course modules
  const courseModules = [
    {
      title: "Enterprise Network Architecture",
      icon: <Network className="h-5 w-5" />,
      topics: ["Campus LAN Design", "Enterprise WAN Design", "Network Virtualization", "High Availability Design"]
    },
    {
      title: "Advanced Routing & Switching",
      icon: <Layers className="h-5 w-5" />,
      topics: ["EIGRP, OSPF & BGP", "MPLS & Segment Routing", "Multicast", "QoS Implementation"]
    },
    {
      title: "Software-Defined Networking",
      icon: <Workflow className="h-5 w-5" />,
      topics: ["SD-WAN", "SD-Access", "Cisco DNA Center", "Programmable Fabric"]
    },
    {
      title: "Network Services & Security",
      icon: <Globe className="h-5 w-5" />,
      topics: ["Network Security", "Device Hardening", "AAA & ISE", "Network Assurance"]
    }
  ];
  const batches = [
    {
      startDate: "November 15, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "9 AM - 1 PM (IST)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "November 15, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "7:30 PM -11:30 PM (PST)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "November 15, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "3:30 AM -7:30 AM (GMT)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "November 15, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "10:30 PM - 2:30 AM(EST)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "6 PM - 11 PM (EST)",
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "3 PM - 8 PM (PST)", 
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "11 PM - 4 AM (GMT)", 
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "4:30 AM - 9:30 AM (IST)",
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time:" 2 PM - 6 PM (GMT)", 
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "9 AM - 1 PM (EST)",
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time:  "6 AM - 10 AM (PST)", 
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "7:30 PM - 11:30 PM (IST)",
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      duration: "3 Weeks",
      time: "6 PM - 10 PM (PST)",
      seats: " 20 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      time:  "9 PM - 1 AM (EST)",
      duration: "3 Weeks",
      seats: " 20 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      time: "2 AM - 6 AM (GMT)", 
      duration: "3 Weeks",
      seats: " 20 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      time: "7:30 AM - 11:30 AM (IST)",
      duration: "3 Weeks",
      seats: " 20 seats",
      type: "part-time",
    },

  ];
  const WrittenExam = [
    { aspect: "Exam Code", details: "350-401 ENCOR" },
    { aspect: "Duration", details: "120 minutes (2 hours)" },
    { aspect: "Question Count ", details: "90-110 questions" },
    { aspect: "Question Types", details: "Multiple choice, drag-and-drop, fillin-the-blank, testlet" },
    { aspect: "Passing Score ", details: "Variable (typically 800-850 out of 1000)" },
    { aspect: "Cost", details: "$400 USD" },
    { aspect: "Languages", details: "English, Japanese" },
    { aspect: "Delivery Method ", details: "Pearson VUE testing centers or online proctoring" },
    { aspect: "Validity", details: "3 years from pass date" },
  ];
  const LabExam = [
    { aspect: "Exam Code", details: "CCIE Enterprise Infrastructure v1.1 Lab" },
    { aspect: "Duration", details: "8 hours" },
    { aspect: "Exam Format", details: "Module 1 – Design (3 hours), Module 2 – Deploy, Operate and Optimize (5 hours)" },
    { aspect: "Exam Type", details: "Hands-on practical lab examination" },
    { aspect: "Tasks ", details: "Configuration, troubleshooting, optimization scenarios" },
    { aspect: "Technologies Tested ", details: "Dual stack solutions (IPv4 and IPv6), SD-Access, automation" },
    { aspect: "Cost", details: "$1,600 USD (Cisco facilities) / $1,900 USD (Mobile lab locations) " },
    { aspect: "Retake Policy", details: "Must wait 30 days between attempts" },
    { aspect: "Validity", details: "3 years from pass date" },
  ];

  const pricingPlans = [
    {
      tierName: "Fast Track",
      tierSubtitle: "Basic training + labs for a quick start",
     startDate: [
        { date: "November 15, 2025", time: ["9 AM - 1 PM (IST)", "7:30 PM -11:30 PM (PST)", "3:30 AM -7:30 AM (GMT)", "10:30 PM - 2:30 AM(EST)"] },
        { date: "December 2, 2025", time: ["6 PM - 11 PM (EST)", "3 PM - 8 PM (PST)", "11 PM - 4 AM (GMT)", "4:30 AM - 9:30 AM (IST)"] },
        {
          date: "December 16, 2025", time: ["2 PM - 6 PM (GMT) ",
            "9 AM - 1 PM (EST) ",
            "6 AM - 10 AM (PST)",
            "7:30 PM - 11:30 PM (IST)"]
        },

        {
          date: "January 6, 2026", time: ["6 PM - 10 PM (PST)",
            "9 PM - 1 AM (EST)",
            "2 AM - 6 AM (GMT)",
            "7:30 AM - 11:30 AM (IST)"]
        }
      ],
      price: "$1,299",
      pricePeriod: "Starter Pack",
      duration: "2 Weeks",
      durationBadge: "Duration: 2 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>24 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>32 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Instructor Support via Email",
        "Certificate of Completion"
      ],
      buttonText: "Get Started",
      buttonClass: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      tierName: "Pro Track",
      tierSubtitle: "Extended labs + full materials + instructor support",
      startDate: [
        { date: "November 15, 2025", time: ["9 AM - 1 PM (IST)", "7:30 PM -11:30 PM (PST)", "3:30 AM -7:30 AM (GMT)", "10:30 PM - 2:30 AM(EST)"] },
        { date: "December 2, 2025", time: ["6 PM - 11 PM (EST)", "3 PM - 8 PM (PST)", "11 PM - 4 AM (GMT)", "4:30 AM - 9:30 AM (IST)"] },
        {
          date: "December 16, 2025", time: ["2 PM - 6 PM (GMT) ",
            "9 AM - 1 PM (EST) ",
            "6 AM - 10 AM (PST)",
            "7:30 PM - 11:30 PM (IST)"]
        },

        {
          date: "January 6, 2026", time: ["6 PM - 10 PM (PST)",
            "9 PM - 1 AM (EST)",
            "2 AM - 6 AM (GMT)",
            "7:30 AM - 11:30 AM (IST)"]
        }
      ],
      price: "$1,999",
      pricePeriod: "Advanced Pack (Most Popular)",
      duration: "6 Weeks",
      durationBadge: "Duration: 6 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>48 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>64 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Full Instructor Support (Email + Messaging + 5 hours of support calls)",
        "Certificate with Exam Readiness Rating"
      ],
      buttonText: "Choose Professional",
      buttonClass: "bg-gradient-to-r from-red-500 to-red-700",
      popular: true
    },
    {
      tierName: "Master Track",
      tierSubtitle: "Intensive training + deep labs + full mentoring",
    startDate: [
        { date: "November 15, 2025", time: ["9 AM - 1 PM (IST)", "7:30 PM -11:30 PM (PST)", "3:30 AM -7:30 AM (GMT)", "10:30 PM - 2:30 AM(EST)"] },
        { date: "December 2, 2025", time: ["6 PM - 11 PM (EST)", "3 PM - 8 PM (PST)", "11 PM - 4 AM (GMT)", "4:30 AM - 9:30 AM (IST)"] },
        {
          date: "December 16, 2025", time: ["2 PM - 6 PM (GMT) ",
            "9 AM - 1 PM (EST) ",
            "6 AM - 10 AM (PST)",
            "7:30 PM - 11:30 PM (IST)"]
        },

        {
          date: "January 6, 2026", time: ["6 PM - 10 PM (PST)",
            "9 PM - 1 AM (EST)",
            "2 AM - 6 AM (GMT)",
            "7:30 AM - 11:30 AM (IST)"]
        }
      ],
      price: "$2,499",
      pricePeriod: "Expert Pack",
      duration: "9 Weeks",
      durationBadge: "Duration: 9 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>96 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>128 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "1:1 mentorship + 20 hours of support calls",
        "Certificate with Exam Readiness Rating + Personalised improvement notes"
      ],
      buttonText: "Go Master Track",
      buttonClass: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    }
  ];
  const faqData = [
    {
      question: "What prerequisites do I need?",
      answer: "Basic networking knowledge (CCNA level) is recommended. We provide a pre-assessment to help determine your readiness."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes! You can upgrade to a higher tier at any time. We'll credit your previous payment toward the new plan."
    },
    {
      question: "What if I fail the CCIE exam?",
      answer: "Pro Track and Master Track students get continued support for additional attempts. We also provide personalized remediation plans."
    },
    {
      question: "Are payment plans available?",
      answer: "Yes! Pro Track and Master Track both offer 3 equal installment payment plans with 0% interest for your convenience."
    },
    {
      question: "What equipment do I need?",
      answer: "All lab equipment is provided remotely. You only need a reliable internet connection and a computer capable of running remote desktop sessions."
    }
  ];

  return (
    <>
      <Helmet>
        <title>CCIE Enterprise Infrastructure v1.1 Training & Certification | CCIELab.Net</title>
        <meta name="description" content="CCIE Enterprise Infrastructure Training v1.1 with 24/7 Hands-on Lab Practices, CCIE Certified Instructors with Proven Expertise and Interactive Bootcamps." />
        <meta property="og:title" content="CCIE Enterprise Infrastructure v1.1 Training & Certification | CCIELab.Net| CCIELab.Net" />
        <meta property="og:description" content="CCIE Enterprise Infrastructure Training v1.1 with 24/7 Hands-on Lab Practices, CCIE Certified Instructors with Proven Expertise and Interactive Bootcamps." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen pt-0 bg-background">
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
           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 items-center gap-12">
  {/* Left column (text) */}
  <div>
    <div className="flex items-center gap-2 mb-6">
      <img
        src="/ent_golden_icon.png"
        alt="CCIE Logo"
        className="h-16 object-contain"
      />
    </div>

    <h1 className="text-4xl md:text-4xl font-bold mb-6 text-white max-w-5xl">
      CCIE Enterprise Infrastructure Training v1.1
    </h1>

    <p className="text-base md:text-lg text-white/90 mb-8 max-w-lg text-justify">
      Become a CCIE Enterprise Infrastructure Expert. Our program is designed
      to help you pass the CCIE Enterprise Infrastructure exam faster, smarter,
      and with the right tools and resources.
    </p>

    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-3 text-white/90">
        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
        <span>24/7 access to fully equipped lab environments</span>
      </div>
      <div className="flex items-center gap-3 text-white/90">
        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
        <span>Realistic exam simulations and troubleshooting exercises</span>
      </div>
      <div className="flex items-center gap-3 text-white/90">
        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
        <span>
          Personalised mentorship from certified experts with real-world
          training
        </span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ShineBorder>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium text-lg">
          Join Waitlist
        </button>
      </ShineBorder>

      <button
        onClick={() => {
          const pricingSection = document.getElementById("pricing-plans");
          if (pricingSection) {
            pricingSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
        className="px-8 py-3 rounded-full font-medium text-lg border border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
      >
        Learn More
      </button>
    </div>
  </div>

  {/* Right column (video) */}
  <div className="flex justify-center">
    <div className="w-full max-w-lg relative z-30">
      <div className="relative w-full h-64 aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/kYpiyjWV3cY"
          title="CCIE Enterprise Infrastructure Lab Demonstration"
          className="w-full h-full relative z-30"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
</div>

          </div>
        </section>

        {/* Lab Video Section - Moved right after hero section */}
        {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
              Lab Demonstration
            </span>
            <h3 className="text-3xl font-bold mb-4"><AuroraText>See Our Lab Environment in Action</AuroraText></h3>
            <p className="text-muted-foreground">
              Watch this video to get a glimpse of our state-of-the-art CCIE Enterprise Infrastructure lab environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <BorderBeamWrapper beamColor="blue" duration={8}>
              <div className="rounded-xl shadow-lg">
                <div className="relative pb-[56.25%] h-0 overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/kYpiyjWV3cY"
                    title="CCIE Enterprise Infrastructure Lab Demonstration"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </BorderBeamWrapper>

            <BorderBeamWrapper beamColor="purple" duration={7}>
              <div className="bg-background border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  About Our Lab Environment
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our state-of-the-art lab environment provides you with hands-on experience using the latest Cisco equipment and software.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Real Cisco hardware and virtual instances</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Remote access 24/7 from anywhere</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Preconfigured topologies for practice</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Automated saving and loading of configs</span>
                  </div>
                </div>
              </div>
            </BorderBeamWrapper>
          </div>
        </div>
      </section> */}
        {/* Course Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Our CCIE Course Highlights
              </span>
              <h3 className="text-3xl font-bold mb-4"><AuroraText>Comprehensive Learning Experience</AuroraText></h3>
              <p className="text-muted-foreground">
                Everything you need to master enterprise networking and pass your CCIE certification.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="relative overflow-hidden">
                  <Card className="h-full relative overflow-hidden" withBeam={true}>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-3 ">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {feature.icon}
                          </div>
                          <h3> {feature.title} </h3>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground ">
                        {feature.description}
                      </p>

                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  CCIE Training Pricing Plans*/}
        <section id="pricing-plans" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                CCIE Training Pricing Plans
              </span>
              <h2 className="text-3xl font-bold mb-4"><AuroraText>CCIE Training Program</AuroraText></h2>
              <p className="text-muted-foreground">
                Choose the perfect training plan to achieve your CCIE certification goals
              </p>
            </div>
            <CciePricingPage pricingPlans={pricingPlans} />
          </div>
        </section>



        {/*   Pricing Plans*/}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">

              <h2 className="text-3xl font-bold mb-4"><AuroraText> Upcoming CCIE EI Classes</AuroraText></h2>
            </div>
            <UpecommingCcieTable batches={batches} />
          </div>
        </section>

        {/* Instructors */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Meet Your Instructor
              </span>
              <h2 className="text-3xl font-bold mb-4"><AuroraText>Instructor Details:</AuroraText></h2>
              <p className="text-muted-foreground">
                Your instructor is an active CCIE professional with years of real-world experience.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Image Section - Modern Square Design */}
                <div className="md:col-span-5 relative group">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={instructors[0].image}
                      alt={instructors[0].name}
                      className="w-full h-72 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Certification Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-white">
                          CCIE #67714
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 left-6 right-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="grid gap-4 text-center">
                      <div>
                        <div className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
                          Mr. Saif Deshmukh
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {instructors[0].experience} Industry Experience
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <BorderBeamWrapper
                  beamColor="blue"
                  duration={8}
                  className="md:col-span-7 pt-8 md:pt-0 border"
                >
                  <div className="bg-background border-border rounded-xl p-8 transition-all hover:shadow-md">
                    {/* Header with Gradient */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {instructors[0].name}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {instructors[0].role}
                        </span>
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {instructors[0].experience}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {instructors[0].description}
                      </p>
                    </div>

                    {/* Expertise Highlights */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Core Expertise & Specializations
                      </h4>
                      <div className="grid lg:grid-cols-2 gap-3">
                        {instructors[0].highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 group"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mt-0.5">
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                </BorderBeamWrapper>
              </div>
            </div>

          </div>
        </section>


        {/* Complete CCIE Enterprise Syllabus */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Core CCIE Enterprise Infrastructure Topics
              </span>
              <h2 className="text-3xl font-bold mb-4"><AuroraText>CCIE Enterprise Infrastructure Syllabus Overview</AuroraText></h2>
              <p className="text-muted-foreground">
                Our curriculum covers all exam domains with in-depth practical labs and theory.

              </p>
              <p className='text-justify'>
                <strong>Exam Description:  </strong>  The CCIE Enterprise Infrastructure (v1.1) Lab Exam is an eight-hour, hands-on
                exam that requires that a candidate plan, design, operate, and optimize dual-stack solutions (IPv4
                and IPv6) for complex enterprise networks.
                Candidates are expected to program and automate the network within their exam, as per exam
                topics below.
                The following topics are general guidelines for the content likely to be included on the exam. Your
                knowledge, skills, and abilities on these topics will be tested throughout the entire network lifecycle,
                unless explicitly specified otherwise within this document.
              </p>
            </div>
            <CCIESyllabus />

          </div>
        </section>

        {/* Certification Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Certification Path
              </span>
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src="/ent_golden_icon.png" alt="CCIE Enterprise Logo" className="h-10 w-auto" />
                <h2 className="text-3xl font-bold"><AuroraText>Your CCIE Enterprise Infrastructure Journey </AuroraText></h2>
              </div>
              <p className="text-muted-foreground">
                Follow this structured path to achieve your CCIE Enterprise Infrastructure certification.
              </p>
            </div>

            <CCIETimeline />
          </div>
        </section>

        {/* Lab Topologies Carousel */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Sample Topologies
              </span>
              <h2 className="text-3xl font-bold mb-4"><AuroraText>Explore Our CCIE Lab Topologies</AuroraText></h2>
              <p className="text-muted-foreground">
                Get familiar with the diverse network topologies you'll work with during your CCIE Enterprise Infrastructure training.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Carousel container */}
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {labTopologies.map((topology) => (
                      <div key={topology.id} className="w-full flex-shrink-0">
                        <div className="relative h-[400px]">
                          <img
                            src={topology.image}
                            alt={topology.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{topology.title}</h3>
                            <p className="text-white/80">{topology.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-4 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>

                {/* Indicators */}
                <div className="flex justify-center mt-4 gap-2">
                  {labTopologies.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
                        }`}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  These are just a few examples of the lab topologies you'll work with. Our curriculum includes over 50 different lab scenarios covering all aspects of the CCIE Enterprise Infrastructure exam.
                </p>
                {/* <button className="inline-flex items-center gap-2 text-primary hover:underline">
                <span>View All Lab Topologies</span>
                <ChevronRight className="h-4 w-4" />
              </button> */}
              </div>
            </div>
          </div>
        </section>

        {/* CCIE Lab Infrastructure */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm md:text-lg font-medium mb-3">
                Comprehensive Curriculum
              </span>
              <h2 className="text-3xl font-bold mb-4"><AuroraText>CCIE Lab Infrastructure</AuroraText></h2>
              <p className="text-muted-foreground">
                At our CCIE Enterprise Infrastructure program, hands-on practice is key.
              </p>
            </div>
            <CCIELabInfrastructure />
          </div>

        </section>
        {/* who should */}
        <section className="py-16 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/40">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <AuroraText>Who Should Take This Course?</AuroraText>
              </h2>
            </div>

            <div className="grid gap-6 md:gap-8 ">
              {[
                "Network professionals aiming for expert-level validation",
                "CCNP-certified engineers ready to level up",
                "Solution architects and senior network engineers",
                "IT professionals looking to move into higher salary brackets",
              ].map((item, idx) => (
                <div
                  key={idx}

                  className={cn(
                    "border flex items-start gap-4 p-5 md:p-5 rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-300",
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-gray-200"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCheckIcon className="h-4 w-4 text-blue-500 -mt-0.5 flex-shrink-0" />
                  </div>
                  <p className="text-md md:text-base  text-left mt-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* learning outcome */}

        <section className="py-16 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/40 ">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-12 ">
              <h2 className="text-3xl font-bold mb-6 pb-2">
                <AuroraText>Learning Outcomes</AuroraText>
              </h2>
            </div>
            <div className="grid gap-6 md:gap-8 ">
              {[
                "End-to-end enterprise network design & deployment skills",
                "Proficiency in OSPF, BGP, QoS, Multicast",
                "Automation using Python",
                "Advanced troubleshooting and documentation skills",
                "SD-WAN and Catalyst Center management expertise"
              ].map((item, idx) => (
                <div
                  key={idx}

                  className={cn(
                    "border flex items-start gap-4 p-5 md:p-5 rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-300",
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-gray-200"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCheckIcon className="h-4 w-4 text-blue-500 -mt-0.5 flex-shrink-0" />
                  </div>
                  <p className="text-md md:text-base  text-left mt-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Call */}
        <CCIeDemoMetting />
        {/* Exam Details */}
        {/* <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4"><AuroraText> CCIE Enterprise Infrastructure v1.1 Exam Details </AuroraText></h2>
            <p className="text-muted-foreground">
              The CCIE Enterprise Infrastructure v1.1 follows a two-part system: 350-401 ENCOR written
              exam and 8-hour hands-on lab. Candidates must pass the written prerequisite before
              attempting the lab exam that validates expert-level enterprise networking skills.
            </p>
          </div>
          <h3 className="text-xl font-bold">Written Exam:</h3>
          <CCIEExamDetail
            data={WrittenExam}
          />
          <h3 className="text-xl font-bold mt-6">Lab Exam Details:</h3>
          <CCIEExamDetail
            data={LabExam}
          />
          <p className="text-muted-foreground">
            CCIE EI certification is the industry's most prestigious networking credential, providing 25-40%
            average salary increases and opening doors to senior network engineer, architect, and
            consultant roles. The 3-year certification requires renewal through 40 continuing education
            credits or re-examination, maintaining professional status as a Cisco Certified Internetwork
            Expert (CCIE).
          </p>
        </div>
      </section> */}
        {/* Frequently Asked Questions */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">

              <h2 className="text-3xl font-bold mb-4"><AuroraText>Frequently Asked Questions</AuroraText></h2>
            </div>
            <FAqs>
              {faqData.map((faq, index) => (
                <FAqs.Item key={index} title={faq.question}>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </FAqs.Item>
              ))}
            </FAqs>
          </div>
        </section>

        {/* Training Program Details                                        ---------------extra */}
        {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Training Program
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>Comprehensive CCIE Training</AuroraText></h2>
            <p className="text-muted-foreground">
              Our structured training program is designed to prepare you for success in the CCIE Enterprise Infrastructure certification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BorderBeamWrapper beamColor="indigo" duration={7}>
              <div className="bg-background border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg">
                <div className="p-1 bg-gradient-to-r from-primary/80 to-purple-600/80">
                  <div className="bg-background p-6 rounded-t-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Technology Labs</h3>
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Daily 2 hours, 90 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Total: 180+ hours</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Hands-on practice with dedicated lab environments. Choose your preferred time slot for daily practice sessions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">24/7 access to lab environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Instructor support via ticketing system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Comprehensive workbooks and guides</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Flexible scheduling options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BorderBeamWrapper>

            <BorderBeamWrapper beamColor="blue" duration={8}>
              <div className="bg-background border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg">
                <div className="p-1 bg-gradient-to-r from-blue-600/80 to-primary/80">
                  <div className="bg-background p-6 rounded-t-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">CCIE Bootcamp</h3>
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">9-day intensive training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">100+ rack hours</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Immersive bootcamp designed for aspiring CCIE candidates, offering comprehensive preparation for the lab exam.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Expert-led training sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Real-world scenario practice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Post-bootcamp lab access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Support until exam attempt</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BorderBeamWrapper>

            <BorderBeamWrapper beamColor="purple" duration={9}>
              <div className="bg-background border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg">
                <div className="p-1 bg-gradient-to-r from-purple-600/80 to-blue-600/80">
                  <div className="bg-background p-6 rounded-t-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Sample Demo Labs</h3>
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Free access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Try before you commit</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Experience our training methodology with free sample labs covering key CCIE Enterprise topics.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">BGP configuration and troubleshooting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">OSPF and EIGRP implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">SD-WAN basic configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Network automation introduction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </BorderBeamWrapper>
          </div>
        </div>
      </section> */}






        {/* Contact Form Section */}
        {/* <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black z-0"></div>

        <Particles
          className="absolute inset-0 z-10"
          quantity={50}
          staticity={50}
          color="#6366f1"
          size={0.5}
        />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              <AuroraText>Talk to Us</AuroraText>
            </h2>

            <p className="text-xl text-white/80 mb-8">
              Have questions about our CCIE Enterprise program? We're here to help you succeed.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a
                href="mailto:sales@deshmukhsystems.com"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <Mail className="h-4 w-4" />
                sales@deshmukhsystems.com
              </a>
              <a
                href="tel:+917972852821"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 7972852821
              </a>
            </div>
          </div>

          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactFirstName" className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                  <input
                    type="text"
                    id="contactFirstName"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    placeholder="John"
                    required
                    value={contactFormData.firstName}
                    onChange={handleContactInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="contactLastName" className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="contactLastName"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    placeholder="Doe"
                    required
                    value={contactFormData.lastName}
                    onChange={handleContactInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  id="contactEmail"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  placeholder="john.doe@example.com"
                  required
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="contactPhone"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  placeholder="+91 7972852821"
                  value={contactFormData.phone}
                  onChange={handleContactInputChange}
                />
              </div>
              <div>
                <label htmlFor="contactMessage" className="block text-sm font-medium text-white/80 mb-1">Your Message</label>
                <textarea
                  id="contactMessage"
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  placeholder="I'm interested in learning more about the CCIE program..."
                  required
                  value={contactFormData.message}
                  onChange={handleContactInputChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                disabled={isFormSubmitting}
              >
                {isFormSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </section> */}
      </div >
    </>
  );
};

export default CCIEPage; 