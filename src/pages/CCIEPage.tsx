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
    
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-black z-0"></div>
        
        <Particles
          className="absolute inset-0 z-10"
          quantity={50}
          staticity={50}
          color="#6366f1"
          size={0.5}
        />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/ent_golden_icon.png" 
                  alt=" CCIE Enterprise Infrastructure " 
                  className="h-16 object-contain"
                />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                CCIE Enterprise Infrastructure Training
              </h1>
              
              <p className="text-xl text-white/80 mb-8 max-w-xl">
                Master advanced enterprise networking skills and earn the most prestigious certification in the industry with our comprehensive training program.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ShineBorder>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium text-lg">
                    Join Waitlist
                  </button>
                </ShineBorder>
                
                <button className="px-8 py-3 rounded-full font-medium text-lg border border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Request Information</h3>
              {formSubmitted ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Request Submitted!</h4>
                  <p className="text-white/80 mb-4">
                    Thank you for your interest in our CCIE program. Our team will contact you shortly with more information.
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                      placeholder="john.doe@example.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                      placeholder="+91 7972852821"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">Your Message</label>
                    <textarea 
                      id="message" 
                      rows={3}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                      placeholder="I'm interested in learning more about the CCIE program..."
                      required
                      value={formData.message}
                      onChange={handleInputChange}
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
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Lab Video Section - Moved right after hero section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Lab Demonstration
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>See Our CCIE Lab Environment in  Action</AuroraText></h2>
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
      </section>
      
      {/* Course Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Course Highlights
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>Comprehensive CCIE Enterprise Training Experience</AuroraText></h2>
            <p className="text-muted-foreground">
              Everything you need to master enterprise networking and pass your CCIE Enterprise Infrastructure Exam.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative overflow-hidden">
                <Card className="h-full relative overflow-hidden" withBeam={true}>
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
                    <p className="text-muted-foreground">
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
              <img src="/ent_golden_icon.png" alt="CCIE Enterprise Logo" className="h-10 w-auto" />
              <h2 className="text-3xl font-bold"><AuroraText>Your CCIE Enterprise Infrastructure Journey</AuroraText></h2>
            </div>
            <p className="text-muted-foreground">
              Follow this structured path to achieve your CCIE EI certification.
            </p>
          </div>
          
          <CCIETimeline />
        </div>
      </section>
      
      {/* Training Program Details */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Training Program
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>Comprehensive CCIE Enterprise Infrastructure Training</AuroraText></h2>
            <p className="text-muted-foreground">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
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
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Comprehensive Curriculum
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>CCIE Enterprise Infrastructure Syllabus Overview</AuroraText></h2>
            <p className="text-muted-foreground">
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
      
      {/* Instructors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Meet Your Instructor
            </span>
            <h2 className="text-3xl font-bold mb-4"><AuroraText>Learn from Industry Expert</AuroraText></h2>
            <p className="text-muted-foreground">
              Your instructor is an active CCIE professional with years of real-world experience.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <BorderBeamWrapper beamColor="blue" duration={8}>
              <div className="flex flex-col md:flex-row gap-6 items-center bg-background border border-border rounded-xl p-6 transition-all hover:shadow-md">
                <img 
                  src={instructors[0].image}
                  alt={instructors[0].name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{instructors[0].name}</h3>
                  <p className="text-primary font-medium mb-2">{instructors[0].role}</p>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {instructors[0].certification}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {instructors[0].experience} industry experience
                    </p>
                  </div>
                  <a 
                    href={instructors[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </BorderBeamWrapper>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
        Success Stories
      </span>
      <h2 className="text-3xl font-bold mb-4">
        <AuroraText>Our Students' Achievements</AuroraText>
      </h2>
      <p className="text-muted-foreground">
        Hear from our successful CCIE candidates who have achieved their goals with our training program.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {successStories.map((story, index) => (
        <div key={index} className="bg-background border border-border rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={story.image}
              alt={story.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h3 className="text-lg font-bold">{story.name}</h3>
              <p className="text-sm text-muted-foreground">{story.role}</p>
            </div>
          </div>
          <p className="text-muted-foreground italic">"{story.quote}"</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQ Section */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
       Have Questions? We’ve Got Answers 
      </span>
      <h2 className="text-3xl font-bold mb-4">
        <AuroraText> Frequently Asked Questions</AuroraText>
      </h2>
      <p className="text-muted-foreground">
        Find answers to the most common questions about our CCIE Enterprise Infrastructure program.
      </p>
    </div>

    <div className="max-w-4xl mx-auto">
      <Accordion>
        <Accordion.Item title="What is the duration of the CCIE training program?" defaultOpen={true}>
          <p className="text-muted-foreground">
            The training program typically lasts for 90 days, with daily 60-90 Minutes lab sessions and additional self-paced learning resources.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Do I need prior experience to enroll in the CCIE program?">
          <p className="text-muted-foreground">
            we offer beginner to expert-level training paths. You can start where you are and grow with us.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What kind of support is provided during the training?">
          <p className="text-muted-foreground">
            You will have access to instructor-led sessions, a private study group, and a ticketing system for resolving queries.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Is the lab environment accessible remotely?">
          <p className="text-muted-foreground">
            Yes, the lab environment is accessible 24/7 from anywhere, allowing you to practice at your convenience.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What happens if I miss a session?">
          <p className="text-muted-foreground">
            All sessions are recorded, and you will have access to the recordings to catch up on missed content.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What topics are covered in the CCIE EI course curriculum?">
          <p className="text-muted-foreground">
            The curriculum includes Layer 2/3 technologies, routing (OSPF, BGP), MPLS, SD-WAN, network automation, security, and troubleshooting real-world enterprise scenarios.
          </p>
        </Accordion.Item>
        <Accordion.Item title="How is the CCIE EI lab exam structured, and what does it test?">
          <p className="text-muted-foreground">
           The 8-hour lab exam has two modules: Design (3 hours) and Deploy, Operate, Optimize (5 hours), testing your ability to plan and manage complex networks hands-on.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What study materials and resources do you provide for exam preparation?">
          <p className="text-muted-foreground">
            We provide video tutorials, workbooks, 24/7 virtual lab access, and mock exams aligned with the latest CCIE EI exam blueprint.
          </p>
        </Accordion.Item>
        <Accordion.Item title="Do you offer practice labs or mock exams for hands-on experience?">
          <p className="text-muted-foreground">
            Yes, you get unlimited access to virtual labs and mock exams that replicate the real lab environment to build your skills and confidence.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What is the difference between the CCIE EI written exam and the lab exam?">
          <p className="text-muted-foreground">
           The written exam (ENCOR 350-401) tests theoretical knowledge, while the lab exam evaluates practical skills in configuring and troubleshooting networks.
          </p>
        </Accordion.Item>
        <Accordion.Item title="What are the career benefits of obtaining the CCIE EI certification?">
          <p className="text-muted-foreground">
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
      </section>
    </div>
  );
};


export default CCIEPage; 