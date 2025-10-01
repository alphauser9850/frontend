import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Award, BookOpen, Code, Users, Play, FileText, Server, Clock, BarChart, CheckCircle,  Layers, Network, Globe, Workflow, ArrowLeft, ArrowRight, Send, MapPin, MessageCircle, Linkedin, CheckCheckIcon } from 'lucide-react';
import { AuroraText, Particles, ShineBorder } from '../components/magicui';
import { cn } from '../lib/utils';
import { CCIETimeline } from '../components/CCIETimeline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { CCIEFormData } from '../services/formService';
import UpecommingCcieTable from './UpcommingCcieTable';
import CCIELabInfrastructure from './CCIELabInfrastructure';
import CCIeDemoMetting from './CcieDemoMetting';
import CCIEExamDetail from './CCIEExamDetail';
import { FAqs } from '../components/ui/Faqs';
import { useThemeStore } from '../store/themeStore';
import CciePricingPage from './CciePricingPage';
import { Helmet } from 'react-helmet-async';
import CCIESyllabus from '../components/ui/SyllabusAccordion';


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
      time: "IST (9 AM- 1 PM)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "EST (6 PM- 11 PM)",
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "GMT (2PM - 6PM)",
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      time: "PST (6 PM- 10 PM)",
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
      price: "$1,299",
      pricePeriod: "Starter Pack",
      durationBadge: "Duration: 2 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>24 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>32 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Instructor Support via Email ",
        "Certificate of Completion"
      ],
      buttonText: "Get Started",
      buttonClass: "bg-gradient-to-r from-blue-500 to-blue-700",
      paymentOptions: "💳 Credit Card | 🏦 Bank Transfer"
    },
    {
      tierName: "Pro Track",
      tierSubtitle: "Extended labs + full materials + instructor support",
      price: "$1,999",
      pricePeriod: "Advanced Pack(Most Popular)",
      durationBadge: "Duration: 6 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>48hours</span> instructor-led training ",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>64 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Full Instructor Support (Email + Messaging + 5 hours of support calls)",
        "Certificate with Exam Readiness Rating",
      ],
      buttonText: "Choose Professional",
      buttonClass: "bg-gradient-to-r from-red-500 to-red-700",
      paymentOptions: "💳 Credit Card | 🏦 Bank Transfer | 📅 One Time Payment Or 3 Equal Installments",
      popular: true
    },
    {
      tierName: "Master Track",
      tierSubtitle: "Intensive training + deep labs + full mentoring",
      price: "$2,499",
      pricePeriod: "Expert Pack",
      durationBadge: "Duration: 9 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>96 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>128 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit", ,
        "1:1 mentorship + 20 hours of support calls",
        "Certificate with Exam Readiness Rating + Personalised improvement notes"
      ],
      buttonText: "Go Master Track",
      buttonClass: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      paymentOptions: "💳 One-time payment OR 3 equal installments<br>Credit Card | Bank Transfer"
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

  const features = [
    {
      icon: <Play className="h-6 w-6 text-primary" />,
      title: "6 months to 1 Year access to Live Recordings*",
      description: "Comprehensive Class lectures covering all CCIE Enterprise Infrastructure Classes"
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
const networkInfrastructureTopics = [
  "Switch Administration (MAC address table, Errdisable recovery, L2 MTU)",
  "Layer 2 Protocols (CDP, LLDP, UDLD)",
  "VLAN Technologies (Access/Trunk ports, Native VLAN, VLAN pruning, Voice VLAN)",
  "EtherChannel (LACP, Static, L2/L3, Load balancing, MEC use cases)",
  "Spanning Tree Protocol (PVST+, Rapid-PVST+, MST, PortFast, BPDU Guard, Loop Guard, Root Guard)",
  "Routing Concepts (Admin Distance, Static Routing, Policy-Based Routing, VRF-Lite, Route Leaking, Filtering, Redistribution, Authentication, BFD, L3 MTU)",
  "EIGRP (Adjacencies, Best Path Selection, Metrics, Operations, Topology Table, Packet Types, SIA, Named Mode, Scalability/Optimization)",
  "OSPFv2/v3 (Adjacencies, AF Support, Area Types, Path Preference, Operations, GTSM, Optimization/Scalability, LSA Throttling, SPF tuning)",
  "BGP (IBGP/EBGP Peerings, Templates, Dynamic Neighbors, AS Numbers, Path Selection, Policy Control, Attribute Manipulation, Route Reflectors, Aggregation, Soft Reconfig, Route Refresh)",
  "Multicast (IGMPv2/v3, IGMP Snooping, PIM Sparse Mode, Auto-RP, BSR, Anycast RP, SSM, RP Mapping, MSDP, Multipath)"
];

const softwareDefinedTopics = [
  "Cisco SD-Access (Underlay – manual, LAN automation, PnP, Device Discovery, Extended Nodes)",
  "SD-Access Overlay (LISP, BGP Control Planes, VXLAN, TrustSec Policy Plane, L2 Flooding, Multicast)",
  "Fabric Design (Single-Site, Multi-Site, Fabric-in-a-Box)",
  "Fabric Deployment (Host Onboarding, Auth Templates, Port Config, Border Priorities, Device Additions)",
  "Fabric Border Handoff (SDA/SD-WAN/IP Transit Integration, Peer Device, L2 Border Handoff)",
  "Segmentation (Macro via VN, Micro via SGT/SGACL)",
  "Cisco SD-WAN (Controller Architecture – vManage, vBond, vSmart)",
  "SD-WAN Underlay (WAN Edge Cloud/Hardware Deployments, Configurations, TLOC Extension)",
  "OMP (Attributes, IPsec Key Management, Route Aggregation, Redistribution, SDA Integration)",
  "Configuration Templates (CLI, Feature, Device Templates)",
  "Policies (Centralized Data/Control/Application-Aware, Localized ACL/Route Policies)"
];

const transportTopics = [
  "GRE Tunnels (Static Point-to-Point)",
  "MPLS Operations (Label Stack, LSR, LSP, LDP, MPLS Ping, Traceroute)",
  "MPLS L3VPN (PE-CE Routing with BGP, MP-BGP VPNv4/v6)",
  "DMVPN (Phase 3, Dual Hub, NHRP, IPsec/IKEv2 with PSK)"
];

const securityAndServicesTopics = [
  "Device Security (Control Plane Policing/Protection, AAA)",
  "Switch Security (VACL/PACL, Storm Control, DHCP Snooping/Opt82, IP Source Guard, DAI, Port Security)",
  "Router Security (IPv4/IPv6 ACLs, uRPF, IPv6 Filters)",
  "IPv6 Infrastructure Security (RA Guard, DHCP Guard, Binding Table, Device Tracking, ND Inspection, Source Guard)",
  "System Management (Console/VTY, SSH/SCP, RESTCONF, NETCONF, SNMP v2c/v3, Syslog/Debugs)",
  "QoS (DiffServ Architecture, Classification, NBAR, DSCP Marking, Policing/Shaping, Congestion Mgmt, HQoS, MQC)",
  "Network Services (HSRP, VRRP, IPv6 RS/RA Redundancy, NTP, PTP, DHCPv4/v6, NAT/PAT – Static/Dynamic/Policy/VRF-aware)",
  "Network Optimization (IP SLA, Object Tracking, Flexible NetFlow)",
  "Network Operations (SPAN, RSPAN, ERSPAN, Embedded Packet Capture, Packet Trace, Conditional Debugger)",
  "Infrastructure Automation & Programmability (JSON, XML, YAML, Jinja, EEM Applets, Guest Shell, Python, vManage API, DNA Center API, Model-Driven Telemetry)"
];




const CCIEPage: React.FC = () => {

   const { isDarkMode } = useThemeStore();

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
      title: "1 Year Access to Live Recording:",
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
      time: "IST (9 AM- 1 PM)",
      duration: "4 Weeks",
      seats: "8 seats",
      type: "part-time",
    },
    {
      startDate: "December 2, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "EST (6 PM- 11 PM)",
      duration: "4 Weeks",
      seats: "12 seats",
      type: "full-time",
    },
    {
      startDate: "December 16, 2025",
      instructor: "Mr. Saif Deshmukh",
      time: "GMT (2PM - 6PM)",
      duration: "4 Weeks",
      seats: "15 seats",
      type: "part-time",
    },
    {
      startDate: "January 6, 2026",
      instructor: "Mr. Saif Deshmukh",
      time: "PST (6 PM- 10 PM)",
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
      price: "$1,299",
      pricePeriod: "Starter Pack",
      duration: "2 Weeks",
      durationBadge: "Duration: 2 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>24 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>32 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Instructor Support via Email ",
        "Certificate of Completion"
      ],
      buttonText: "Get Started",
      buttonClass: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      tierName: "Pro Track",
      tierSubtitle: "Extended labs + full materials + instructor support",
      price: "$1,999",
      pricePeriod: "Advanced Pack(Most Popular)",
      duration: " 6 Weeks",
      durationBadge: "Duration: 6 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>48hours</span> instructor-led training ",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>64 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit",
        "Full Instructor Support (Email + Messaging + 5 hours of support calls)",
        "Certificate with Exam Readiness Rating",
      ],
      buttonText: "Choose Professional",
      buttonClass: "bg-gradient-to-r from-red-500 to-red-700",
      popular: true
    },
    {
      tierName: "Master Track",
      tierSubtitle: "Intensive training + deep labs + full mentoring",
      price: "$2,499",
      pricePeriod: "Expert Pack",
      duration: " 9 Weeks",
      durationBadge: "Duration: 9 Weeks",
      features: [
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>96 hours</span> instructor-led training",
        "<span class='bg-blue-100 text-blue-700 px-1 rounded'>128 hours</span> hands-on lab access",
        "Mock Exams",
        "Self Study Toolkit", ,
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/ent_golden_icon.png"
                  alt="CCIE Logo"
                  className="h-16 object-contain"
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                CCIE Enterprise Infrastructure Training v1.1
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-xl">
                Become a CCIE Enterprise Infrastructure Expert. Our program is designed to help you pass the
                CCIE Enterprise Infrastructure exam faster, smarter, and with the right tools and resources.
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
                  <span>Personalised mentorship from certified experts with real-world training</span>
                </div>
              </div>
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



            <div className="flex items-center justify-center gap-2 mb-6">
              {/* {isDarkMode ? (
                <img
                  src="/EI_Black.png"
                  alt="CCIE Logo Dark"
                  className="h-52 md:h-68 lg:h-64 object-contain"
                />
              ) : (
                <img
                  src="/EI_white.png"
                  alt="CCIE Logo Light"
                  className="h-40 md:h-48 lg:h-56 object-contain"
                />
              )} */}
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
          </div>
        </div>
      </section>
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
       {/*  CCIE Training Pricing Plans*/}
      <section className="py-20">
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

          <div className="max-w-4xl mx-auto">
            <BorderBeamWrapper beamColor="blue" duration={8}>
              <div className="flex flex-col md:flex-row gap-8 items-start bg-background border border-border rounded-xl p-8 transition-all hover:shadow-md">
                <div className="flex-shrink-0">
                  <img
                    src={instructors[0].image}
                    alt={instructors[0].name}
                    className="w-56 h-56 rounded-full object-cover border-4 border-primary/20 bg-white"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{instructors[0].name}</h3>
                  <p className="text-primary font-medium mb-3">{instructors[0].role}</p>
                  <p className="text-muted-foreground mb-4">{instructors[0].description}</p>

                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <p className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {instructors[0].certification}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {instructors[0].experience} industry experience
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground">Key Highlights:</h4>
                    <ul className="space-y-2">
                      {instructors[0].highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
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
           <CCIeDemoMetting />
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

      </div>
            </>
)
}

export default CCIEPage; 