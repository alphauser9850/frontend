import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Award, BookOpen, Code, Users, Play, FileText, Server, Clock, BarChart, CheckCircle, ChevronRight, Layers, Network, Globe, Workflow, Lightbulb, Zap, Mail, Phone, User, ArrowLeft, ArrowRight, Send, MapPin, MessageCircle, Linkedin } from 'lucide-react';
import { AuroraText, Particles, ShineBorder, AnimatedDotPattern, MagicCard, BorderBeam } from '../components/magicui';
import { cn } from '../lib/utils';
import { CCIETimeline } from '../components/CCIETimeline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Accordion from '../components/ui/Accordion';
import { CheckCircle2 } from 'lucide-react';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { CCIEFormData } from '../services/formService';
import SEOHeadings from '../components/SEOHeadings';
import Breadcrumbs from '../components/Breadcrumbs';

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (config: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}

// Sample lab topologies data
const labTopologies = [
  {
    id: 1,
    title: "Enterprise Campus Network",
    description: "Complete enterprise campus design with core, distribution, and access layers",
    image: "/Enterprise.jpg"
  },
  {
    id: 2,
    title: "SD-WAN Deployment",
    description: "Multi-site SD-WAN topology with controllers and edge devices",
    image: "/sd-wan-deploy.jpg"
  },
  {
    id: 3,
    title: "BGP Service Provider",
    description: "Service provider backbone with BGP routing and MPLS services",
    image: "/bgp.jpg"
  },
  {
    id: 4,
    title: "Network Automation Lab",
    description: "Infrastructure automation with Python, Ansible and CI/CD pipelines",
    image: "/nw-auto-lab.jpg"
  },
  {
    id: 5,
    title: "Security Infrastructure",
    description: "Enterprise security architecture with ISE, firewalls and segmentation",
    image: "/security.jpg"
  }
];

// CCIE Syllabus Topics
const networkInfrastructureTopics = [
  "Layer 2 Technologies (VLANs, STP, EtherChannel, LACP)",
  "Layer 3 Technologies (OSPF v2/v3, EIGRP, BGP)",
  "First Hop Redundancy Protocols (HSRP, VRRP, GLBP)",
  "IPv4 and IPv6 Addressing and Routing",
  "Route Redistribution and Path Selection",
  "Network Services (DHCP, DNS, NTP)",
  "Network Management Protocols (SNMP, Syslog, NetFlow)",
  "QoS Implementation and Verification",
  "Network Virtualization (VRF, GRE)",
  "High Availability and Resilience"
];

const softwareDefinedTopics = [
  "Cisco SD-WAN Architecture and Components",
  "SD-WAN Control and Data Plane Operations",
  "SD-WAN Policies and Templates",
  "OMP Routing Protocol",
  "Cisco SD-Access Fabric Architecture",
  "LISP and VXLAN in SD-Access",
  "DNA Center for Automation and Assurance",
  "Policy Implementation in SD-Access",
  "Cisco ACI Concepts and Architecture",
  "Multi-site and Multi-domain SD-WAN"
];

const transportTopics = [
  "MPLS Fundamentals (LDP/TDP)",
  "MPLS VPN (L2VPN/L3VPN)",
  "MPLS Traffic Engineering",
  "VPN Technologies (DMVPN, GETVPN, FlexVPN)",
  "IPsec VPN Implementation and Troubleshooting",
  "Multicast Routing (PIM - ASM, SSM, Bidir)",
  "IGMP/MLD for Multicast Group Management",
  "Multicast Security and Filtering",
  "WAN Optimization Techniques",
  "Traffic Engineering and Path Selection"
];

const securityTopics = [
  "Device Security (Control Plane Policing, Management Plane Protection)",
  "Network Security (ACLs, Zone-Based Firewall)",
  "802.1X Implementation and Troubleshooting",
  "MACsec for Layer 2 Security",
  "Infrastructure Security Best Practices",
  "QoS Implementation for Voice and Video",
  "Python Scripting for Network Automation",
  "REST APIs and API Security",
  "NETCONF/RESTCONF Protocols",
  "YANG Data Models",
  "JSON/XML for Data Representation",
  "Ansible/Puppet for Configuration Management"
];

// Add PayPal script to the head
const PayPalScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=BAAdToKbFkJbyWK-JAV7_bvAgJ7mUr0sekMHjXwbLbdzY6HM-suhGKGr0wUcR5e8EvmGk5h2bwRp7VTiE0&components=hosted-buttons&enable-funding=venmo&currency=USD";
    script.async = true;
    document.body.appendChild(script);

    // Initialize PayPal button after script loads
    script.onload = () => {
      if (window.paypal) {
        window.paypal.HostedButtons({
          hostedButtonId: "QFMPV6AJEZH42",
        }).render("#paypal-container-QFMPV6AJEZH42");
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

const CCIEPage: React.FC = () => {
  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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
        source: 'course-page'
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
        source: 'course-page'
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
      certification: "CCIE Enterprise Infrastructure",
      experience: "10+ years",
      image: "/saif_deshmukh.png",
      linkedin: "https://www.linkedin.com/in/deshmukh-saif/"
    }
  ];
  
  // Course features
  const features = [
    { 
      icon: <Play className="h-6 w-6 text-primary" />, 
      title: "100+ Hours of Video Content", 
      description: "Comprehensive video lectures covering all CCIE Enterprise domains" 
    },
    { 
      icon: <Server className="h-6 w-6 text-primary" />, 
      title: "Virtual Lab Environment", 
      description: "24/7 access to Cisco devices for hands-on practice" 
    },
    { 
      icon: <FileText className="h-6 w-6 text-primary" />, 
      title: "Downloadable Resources", 
      description: "Detailed workbooks, configuration guides, and cheat sheets" 
    },
    { 
      icon: <Code className="h-6 w-6 text-primary" />, 
      title: "Practice Exam Simulator", 
      description: "Realistic exam questions with detailed explanations" 
    },
    { 
      icon: <Users className="h-6 w-6 text-primary" />, 
      title: "Community Support", 
      description: "Private study group with instructor-led sessions" 
    },
    { 
      icon: <Clock className="h-6 w-6 text-primary" />, 
      title: "1-Year+ Access", 
      description: "Extended access to support your certification journey" 
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

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Optimized Headings */}
      <SEOHeadings
        title="CCIE Enterprise Infrastructure v1.1 Training"
        description="Master advanced enterprise networking skills and earn the most prestigious certification in the industry with our comprehensive CCIE Enterprise Infrastructure training program."
        canonicalUrl="https://www.ccielab.net/training/ccie-enterprise-infrastructure"
        h1Text="CCIE Enterprise Infrastructure Training v1.1"
        h1ClassName="sr-only"
      />
      
      {/* Add PayPal script component */}
      <PayPalScript />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: 'CCIE Enterprise Infrastructure' }
        ]} />
      <section className="relative pt-32 pb-32 min-h-[60vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/ccie-ei.jpg)' }}>
        <div className="absolute inset-0 bg-surface/90"></div>
          <div className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center text-center">
          <h2 className="text-hero font-bold mb-6 text-text-primary">
            CCIE Enterprise Infrastructure Training v1.1
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-xl mx-auto">
            Master advanced enterprise networking skills and earn the most prestigious certification in the industry with our comprehensive training program.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Join Waitlist
            </button>
          </div>
        </div>
        </section>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-surface-variant">
        <div className="container mx-auto px-4">
          <h2 className="text-heading-1 font-bold text-center mb-12 text-text-primary">Pricing Model - 1</h2>
          
          {/* Debug Message */}
          <div className="text-center mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
            DEBUG: Pricing tables should be visible below
          </div>
          
          {/* First Pricing Table - Duration and Bootcamp */}
          <div className="overflow-x-auto mb-12">
            <table className="min-w-full border border-border rounded-xl bg-background text-left shadow-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-text-primary">Feature</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-text-primary">Only CCIE Labs ($1,499)</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-text-primary">Full CCIE Training ($2,499)</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-text-primary">Premium CCIE Training ($3,499)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b border-border text-text-primary">Duration of the Course</td>
                  <td className="px-6 py-4 border-b border-border text-text-primary">3 Weeks</td>
                  <td className="px-6 py-4 border-b border-border text-text-primary">6 Weeks</td>
                  <td className="px-6 py-4 border-b border-border text-text-primary">9 Weeks</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-text-primary">Bootcamp (Full 2 Weeks, 10 Business Days or Weekends Only Model)</td>
                  <td className="px-6 py-4 text-text-primary">50 Hours</td>
                  <td className="px-6 py-4 text-text-primary">80 Hours</td>
                  <td className="px-6 py-4 text-text-primary">100 Hours</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Second Pricing Table - Comprehensive Features */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border rounded-xl bg-background text-left shadow-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-text-primary">Feature</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-center text-text-primary">Instructor Support</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-center text-text-primary">Limited</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-center text-text-primary">Till Exam Date</th>
                  <th className="px-6 py-4 font-bold text-lg border-b border-border text-center text-text-primary">Till & Post Exam</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">CCNA Include</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">CCNP Include</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Dumps</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Advanced Set</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Workbook with Solutions</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Cisco Blue Print Topics</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">No (Only Labs)</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">No (Only Labs)</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Scratch to CCIE</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Materials</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Technical Support (24x7)</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Priority Access</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Live Recordings</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-blue-500 font-bold">Limited to Bootcamp</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-blue-500 font-bold">Limited to Bootcamp</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Full Training Access</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Full Track (Lifetime)</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">LMS Access</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Life Time Access</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Life Time Access</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Life Time Access</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Life Time Access</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">EVE-NG + Physical Devices</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">Limited</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">Limited</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">Yes (Full)</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Completion Certificate</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b border-border font-semibold text-text-primary">Lab Access Until Exam Cleared</td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-red-500 font-bold">✗</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 border-b border-border text-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-text-primary">Design Guide</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-blue-500 font-bold">Few</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-blue-500 font-bold">Few</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-500 font-bold">More</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-500 font-bold">Extra</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Course Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Course Highlights
            </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary"><AuroraText>Comprehensive CCIE Enterprise Training Experience</AuroraText></h2>
            <p className="text-text-secondary">
              Everything you need to master enterprise networking and pass your CCIE Enterprise Infrastructure Exam.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative overflow-hidden">
                <Card className="h-full relative overflow-hidden card-feature" withBeam={true}>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Certification Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Certification Path
            </span>
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/ent_golden_icon.png" alt="CCIE Enterprise Infrastructure Logo" className="h-10 w-auto" />
              <h2 className="text-heading-1 font-bold text-text-primary"><AuroraText>Your CCIE Enterprise Infrastructure Journey</AuroraText></h2>
            </div>
            <p className="text-text-secondary">
              Follow this structured path to achieve your CCIE EI certification.
            </p>
          </div>
          
          <CCIETimeline />
        </div>
      </section>
      
      {/* Training Program Details */}
      <section className="py-20 bg-surface-variant">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Training Program
            </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary"><AuroraText>Comprehensive CCIE Enterprise Infrastructure Training</AuroraText></h2>
            <p className="text-text-secondary">
              Our structured training program is designed to prepare you for success in the CCIE EI certification.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Technology Lab */}
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
            
            {/* Bootcamp */}
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
                      <span className="text-sm font-medium">2-Week intensive training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">200+ rack hours</span>
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
            
            {/* Sample Labs */}
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
      </section>
      
      {/* Lab Topologies Carousel */}
      <section className="py-20 bg-surface-variant">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Sample Topologies
            </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary"><AuroraText>Explore Our CCIE Lab Topologies</AuroraText></h2>
            <p className="text-text-secondary">
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
                          alt={`${topology.title} Topology - CCIE Enterprise Infrastructure Lab`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-heading-2 font-bold mb-2">{topology.title}</h3>
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
                className="absolute top-1/2 left-4 -translate-y-1/2 h-10 w-10 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-text-primary hover:bg-surface-variant transition-colors z-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 h-10 w-10 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-text-primary hover:bg-surface-variant transition-colors z-10"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              
              {/* Indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {labTopologies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-text-secondary mb-4">
                These are just a few examples of the lab topologies you'll work with. Our curriculum includes over 50 different lab scenarios covering all aspects of the CCIE Enterprise Infrastructure exam.
              </p>
              <button className="inline-flex items-center gap-2 text-primary hover:underline">
                <span>View All Lab Topologies</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Complete CCIE Enterprise Syllabus */}
      <section className="py-20 bg-surface-variant">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Comprehensive Curriculum
            </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary"><AuroraText>CCIE Enterprise Infrastructure Syllabus Overview</AuroraText></h2>
            <p className="text-text-secondary">
              Our curriculum covers all exam domains with in-depth practical labs and theory.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion>
              <Accordion.Item title="Network Infrastructure (30%)" defaultOpen={true}>
                <ul className="space-y-3">
                  {networkInfrastructureTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Item>
              
              <Accordion.Item title="Software Defined Infrastructure (25%)">
                <ul className="space-y-3">
                  {softwareDefinedTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Item>
              
              <Accordion.Item title="Transport Technologies and Solutions (20%)">
                <ul className="space-y-3">
                  {transportTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Item>
              
              <Accordion.Item title="Infrastructure Security and Services (25%)">
                <ul className="space-y-3">
                  {securityTopics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-surface-variant">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
        Success Stories
      </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary">
        <AuroraText>Our Students' Achievements</AuroraText>
      </h2>
            <p className="text-text-secondary">
        Hear from our successful CCIE candidates who have achieved their goals with our training program.
      </p>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      {successStories.map((story, index) => (
              <div key={index} className="bg-surface border border-border rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={story.image}
              alt={`${story.name} - ${story.role} - CCIE Lab Success Story`}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
                    <h3 className="text-lg font-bold text-text-primary">{story.name}</h3>
                    <p className="text-sm text-text-secondary">{story.role}</p>
            </div>
          </div>
                <p className="text-text-secondary italic">"{story.quote}"</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQ Section */}
      <section className="py-20 bg-surface-variant">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Frequently Asked Questions
      </span>
            <h2 className="text-heading-1 font-bold mb-4 text-text-primary">
              <AuroraText>CCIE Enterprise FAQ</AuroraText>
      </h2>
            <p className="text-text-secondary">
              Find answers to common questions about the CCIE Enterprise Infrastructure program.
      </p>
    </div>
    <div className="max-w-4xl mx-auto">
      <Accordion>
        <Accordion.Item title="What is the duration of the CCIE training program?" defaultOpen={true}>
                <p className="text-text-secondary">
            The training program typically lasts for 90 days, with daily 60-90 Minutes lab sessions and additional self-paced learning resources.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Do I need prior experience to enroll in the CCIE program?">
                <p className="text-text-secondary">
            we offer beginner to expert-level training paths. You can start where you are and grow with us.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What kind of support is provided during the training?">
                <p className="text-text-secondary">
            You will have access to instructor-led sessions, a private study group, and a ticketing system for resolving queries.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Is the lab environment accessible remotely?">
                <p className="text-text-secondary">
            Yes, the lab environment is accessible 24/7 from anywhere, allowing you to practice at your convenience.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What happens if I miss a session?">
                <p className="text-text-secondary">
            All sessions are recorded, and you will have access to the recordings to catch up on missed content.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What topics are covered in the CCIE EI course curriculum?">
                <p className="text-text-secondary">
            The curriculum includes Layer 2/3 technologies, routing (OSPF, BGP), MPLS, SD-WAN, network automation, security, and troubleshooting real-world enterprise scenarios.
          </p>
        </Accordion.Item>
        <Accordion.Item title="How is the CCIE EI lab exam structured, and what does it test?">
                <p className="text-text-secondary">
           The 8-hour lab exam has two modules: Design (3 hours) and Deploy, Operate, Optimize (5 hours), testing your ability to plan and manage complex networks hands-on.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What study materials and resources do you provide for exam preparation?">
                <p className="text-text-secondary">
            We provide video tutorials, workbooks, 24/7 virtual lab access, and mock exams aligned with the latest CCIE EI exam blueprint.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Do you offer practice labs or mock exams for hands-on experience?">
                <p className="text-text-secondary">
            Yes, you get unlimited access to virtual labs and mock exams that replicate the real lab environment to build your skills and confidence.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What is the difference between the CCIE EI written exam and the lab exam?">
                <p className="text-text-secondary">
           The written exam (ENCOR 350-401) tests theoretical knowledge, while the lab exam evaluates practical skills in configuring and troubleshooting networks.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What are the career benefits of obtaining the CCIE EI certification?">
                <p className="text-text-secondary">
            The curriculum includes Layer 2/3 technologies, routing (OSPF, BGP), MPLS, SDt qualifies you for senior roles like Network Architect or Engineer, boosting your credibility and earning potential in the networking field.
          </p>
        </Accordion.Item>
      </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 relative overflow-hidden">
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
                href="mailto:support@ccielab.net" 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@ccielab.net
              </a>
              <a 
                href="tel:+917972852821" 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +1 760 858 0505
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
                  placeholder="+1 760 858 0505"
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
      </section>
    </div>
  );
};

export default CCIEPage; 