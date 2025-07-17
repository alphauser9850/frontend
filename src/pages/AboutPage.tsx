import React, { useState } from 'react';
import { Sparkles, Award, BookOpen, Code, Users, Play, FileText, Server, Clock, BarChart, CheckCircle, ChevronRight, Layers, Network, Globe, Workflow, Lightbulb, Zap, Mail, Phone, User, ArrowLeft, ArrowRight, Send, MapPin, MessageCircle, Linkedin, Heart, Target, Shield, Briefcase } from 'lucide-react';
import { AuroraText, Particles, ShineBorder, AnimatedDotPattern, MagicCard, BorderBeam } from '../components/magicui';
import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { submitFormToN8n, AboutFormData } from '../services/formService';
import { ContactSection } from '../components/ContactSection';

const AboutPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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
    setIsSubmitting(true);
    
    try {
      // Prepare data for n8n
      const submissionData: AboutFormData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        source: 'about-page'
      };
      
      // Submit to n8n
      const result = await submitFormToN8n(submissionData);
      
      if (result.success) {
        setFormSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Company values
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Passion for Learning",
      description: "We believe in fostering a lifelong love for learning and continuous improvement in the networking field."
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Excellence in Education",
      description: "We are committed to providing the highest quality training materials and learning experiences."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Student-Centered Approach",
      description: "Our training programs are designed with the student's success as our primary focus."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Integrity & Ethics",
      description: "We uphold the highest standards of professional integrity in all our educational offerings."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Industry Relevance",
      description: "Our curriculum is continuously updated to reflect the latest industry trends and technologies."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Global Perspective",
      description: "We embrace diversity and prepare our students for success in the global networking community."
    }
  ];

  // Team members
  const teamMembers = [
    {
      name: "Saif Deshmukh",
      role: "Founder & Lead Instructor",
      bio: "CCIE Enterprise Infrastructure expert with over 10 years of experience in network design, implementation, and training.",
      image: "/ccielab.png",
      linkedin: "https://www.linkedin.com/in/deshmukh-saif/"
    },
    {
      name: "Priya Sharma",
      role: "Technical Director",
      bio: "Specializes in network automation and programmability with extensive experience in enterprise network transformations.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      linkedin: "https://linkedin.com/"
    },
    {
      name: "Michael Chen",
      role: "Curriculum Developer",
      bio: "Former Cisco TAC engineer with deep expertise in troubleshooting complex network issues and creating practical lab scenarios.",
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      linkedin: "https://linkedin.com/"
    }
  ];

  return (
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
              <AuroraText>About CCIE LAB</AuroraText>
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              Empowering network professionals with world-class training and certification preparation since 2015.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                Our Story
              </span>
              <h2 className="text-3xl font-bold mb-6">
                <AuroraText>From Passion to Purpose</AuroraText>
              </h2>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CCIE LAB was founded in 2015 by a team of CCIE-certified network engineers with a passion for teaching and mentoring. What began as informal training sessions for colleagues quickly evolved into a comprehensive training program.
                </p>
                <p>
                  Our journey started with a simple mission: to make high-quality Cisco certification training accessible, engaging, and effective. Over the years, we've expanded our offerings while maintaining our commitment to excellence and student success.
                </p>
                <p>
                  Today, CCIE LAB is recognized as a premier provider of CCIE Enterprise Infrastructure training, with thousands of successful students across the globe. Our innovative approach combines rigorous technical training with practical hands-on experience.
                </p>
              </div>
            </div>
            
            <BorderBeamWrapper beamColor="blue" duration={8}>
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-auto"
                />
              </div>
            </BorderBeamWrapper>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold mb-6">
              <AuroraText>Why We Do What We Do</AuroraText>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <BorderBeamWrapper beamColor="purple" duration={7}>
              <div className="bg-background border border-border rounded-xl p-8 text-center">
                <p className="text-xl italic mb-6">
                  "Our mission is to transform passionate network engineers into certified experts through immersive, practical training that bridges the gap between theoretical knowledge and real-world application."
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Excellence</h3>
                    <p className="text-sm text-muted-foreground">
                      Committed to the highest standards in technical education
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      Continuously improving our teaching methods and materials
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Building a global network of skilled professionals
                    </p>
                  </div>
                </div>
              </div>
            </BorderBeamWrapper>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              Our Values
            </span>
            <h2 className="text-3xl font-bold mb-6">
              <AuroraText>Principles That Guide Us</AuroraText>
            </h2>
            <p className="text-muted-foreground">
              These core values shape our approach to education and define our company culture.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="relative overflow-hidden">
                <Card className="h-full relative overflow-hidden" withBeam={true}>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {value.icon}
                        </div>
                        {value.title}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                  Get in Touch
                </span>
                <h2 className="text-3xl font-bold mb-6">
                  <AuroraText>Contact Us</AuroraText>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Have questions about our training programs or need more information? We'd love to hear from you.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email Us</h3>
                      <p className="text-muted-foreground">support@ccielab.net</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Call Us</h3>
                      <p className="text-muted-foreground">+1 760 858 0505</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Visit Us</h3>
                      <p className="text-muted-foreground">
                        2175 Goodyear Ave. Ste 110 Ventura CA 93003<br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <BorderBeamWrapper beamColor="indigo" duration={8}>
                <div className="bg-background border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                  {formSubmitted ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                      <p className="text-muted-foreground mb-4">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                        <input 
                          type="text" 
                          id="subject" 
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Inquiry about CCIE training"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message</label>
                        <textarea 
                          id="message" 
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </BorderBeamWrapper>
            </div>
          </div>
        </div>
      </section>
      <ContactSection source="home-page" />
    </div>
  );
};

export default AboutPage; 