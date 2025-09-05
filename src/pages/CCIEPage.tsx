import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Award, BookOpen, Code, Users, Play, FileText, Server, Clock, BarChart, CheckCircle, ChevronRight, Layers, Network, Globe, Workflow, Lightbulb, Zap, Mail, Phone, User, ArrowLeft, ArrowRight, Send, MapPin, MessageCircle, Linkedin, X, Crown } from 'lucide-react';
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
import { ContactSection } from '../components/ContactSection';

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

// PayPal button initialization component
const PayPalScript = () => {
  useEffect(() => {
    // Wait for PayPal SDK to load (it's now in the HTML head)
    const initializePayPalButtons = () => {
      if (window.paypal) {
        // Initialize first tier button with exact format from testing
        paypal.HostedButtons({
          hostedButtonId: "Y78PA4NPGWZ6L",
          return: "https://ent.ccielab.net",
          notifyUrl: "https://ent.ccielab.net/lab-purchase"
        }).render("#paypal-container-Y78PA4NPGWZ6L");
        
        // Initialize second tier button with return and notify URLs
        window.paypal.HostedButtons({
          hostedButtonId: "AR5H8PC8UQXME",
          return: "https://ent.ccielab.net",
          notifyUrl: "https://ent.ccielab.net/lab-purchase"
        }).render("#paypal-container-AR5H8PC8UQXME");
        
        // Initialize third tier button with return and notify URLs
        window.paypal.HostedButtons({
          hostedButtonId: "BLY5FB35CKTY6",
          return: "https://ent.ccielab.net",
          notifyUrl: "https://ent.ccielab.net/lab-purchase"
        }).render("#paypal-container-BLY5FB35CKTY6");
      } else {
        // Retry if PayPal SDK hasn't loaded yet
        setTimeout(initializePayPalButtons, 100);
      }
    };

    // Start initialization
    initializePayPalButtons();
  }, []);

  return null;
};

const CCIEPage: React.FC = () => {
  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
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
  

  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        title="CCIE Enterprise Infrastructure v1.1 Training | CCIELab.Net - Expert CCIE Certification"
        description="Master advanced enterprise networking skills and earn the most prestigious certification in the industry with our comprehensive CCIE Enterprise Infrastructure training program. 24/7 lab access, expert instructors, and proven success rates."
        canonicalUrl="https://www.ccielab.net/training/ccie-enterprise-infrastructure"
        h1Text="CCIE Enterprise Infrastructure Training v1.1"
        h1ClassName="sr-only"
        keywords="CCIE Enterprise Infrastructure, CCIE training, CCIE certification, enterprise networking, Cisco training, CCIE lab practice, networking certification"
        image="/ccie-ei.jpg"
        type="course"
        section="CCIE Training"
        tags={["CCIE", "Enterprise Infrastructure", "Cisco", "Networking", "Certification", "Training"]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "CCIE Enterprise Infrastructure Training v1.1",
          "description": "Master advanced enterprise networking skills and earn the most prestigious certification in the industry with our comprehensive CCIE Enterprise Infrastructure training program.",
          "url": "https://www.ccielab.net/training/ccie-enterprise-infrastructure",
          "provider": {
            "@type": "Organization",
            "name": "CCIE LAB",
            "url": "https://www.ccielab.net"
          },
          "courseMode": "online",
          "educationalLevel": "advanced",
          "inLanguage": "en-US",
          "offers": {
            "@type": "Offer",
            "category": "CCIE Training",
            "description": "Comprehensive CCIE Enterprise Infrastructure training program"
          }
        }}
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

      {/* Enhanced Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-background via-surface-variant/30 to-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Training Packages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              <AuroraText>CCIE Enterprise Training Pricing</AuroraText>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Choose the perfect training package that fits your learning goals and budget. 
              All packages include lifetime access and expert support.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Basic Package */}
            <div className="relative group">
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <Server className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Only CCIE Labs</h3>
                  <div className="text-4xl font-bold text-primary mb-2">$1,499</div>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">3 Weeks Duration</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">50 Hours Bootcamp</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Workbook with Solutions</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">24/7 Technical Support</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Lifetime LMS Access</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Completion Certificate</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-text-secondary text-center">Cisco Blueprint Topics</span>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-center">
                  <div id="paypal-container-Y78PA4NPGWZ6L" className="w-full max-w-xs [&>div]:text-center [&>div]:flex [&>div]:justify-center [&>div>div]:text-center [&>div>div]:flex [&>div>div]:justify-center [&_button]:text-center [&_button]:flex [&_button]:justify-center [&_button]:items-center"></div>
                </div>
              </div>
            </div>

            {/* Standard Package */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-background/90 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-8 mt-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl mb-4">
                    <Layers className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Full CCIE Training</h3>
                  <div className="text-4xl font-bold text-primary mb-2">$2,499</div>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">6 Weeks Duration</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">80 Hours Bootcamp</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Workbook with Solutions</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">24/7 Technical Support</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Lifetime LMS Access</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Completion Certificate</span>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-center">
                  <div id="paypal-container-AR5H8PC8UQXME" className="w-full max-w-xs [&>div]:text-center [&>div]:flex [&>div]:justify-center [&>div>div]:text-center [&>div>div]:flex [&>div>div]:justify-center [&_button]:text-center [&_button]:flex [&_button]:justify-center [&_button]:items-center"></div>
                </div>
              </div>
            </div>

            {/* Premium Package */}
            <div className="relative group">
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 flex flex-col">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-primary/20 rounded-2xl mb-4">
                    <Crown className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Premium CCIE Training</h3>
                  <div className="text-4xl font-bold text-primary mb-2">$3,499</div>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">9 Weeks Duration</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">100 Hours Bootcamp</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Scratch to CCIE Blueprint</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">All Materials Included</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Priority Support Access</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Full Track Recordings</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Full EVE-NG Access</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary text-center">Lab Access Until Exam Pass</span>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-center">
                  <div id="paypal-container-BLY5FB35CKTY6" className="w-full max-w-xs [&>div]:text-center [&>div]:flex [&>div]:justify-center [&>div>div]:text-center [&>div>div]:flex [&>div>div]:justify-center [&_button]:text-center [&_button]:flex [&_button]:justify-center [&_button]:items-center"></div>
                </div>
              </div>
            </div>
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
          
          <ContactSection source="ccie-page" />
        </div>
      </section>
    </div>
  );
};

export default CCIEPage; 