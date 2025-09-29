import React from 'react';
import { AuroraText, ShineBorder } from './magicui';
import { Marquee } from './Marquee';
import { Star, Quote, User } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageSrc?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  role, 
  company, 
  content, 
  rating,
  imageSrc 
}) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="relative group">
      <ShineBorder className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="card-feature w-80 mx-4 flex flex-col h-full relative z-10 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
        <div className="flex items-center mb-4">
          {imageSrc ? (
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-design-primary-accent/30">
              <img src={imageSrc} alt={`${name} - ${role} at ${company} - CCIE Lab Testimonial`} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-design-primary-accent/10 flex items-center justify-center border-2 border-design-primary-accent/30">
              <User className="h-6 w-6 text-design-primary-accent" />
            </div>
          )}
          <div className="ml-3">
            <h3 className="text-text-primary font-semibold">{name}</h3>
            <p className="text-text-secondary text-sm">{role}, {company}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`} 
            />
          ))}
        </div>
        
        <div className="relative mb-4">
          <p className="text-text-secondary text-sm flex-grow pl-4">
            {content}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="h-1 w-16 bg-gradient-to-r from-design-primary-accent/50 to-design-text-accent/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const testimonials = [
    {
      name: "Gizmon",
      role: "Network Architect",
      company: "TechSolutions Inc",
      content: "The CCIE bootcamp was intense but incredibly rewarding. The hands-on labs were particularly valuable, and I passed my exam on the first attempt!",
      rating: 5,
      imageSrc: "/Gizmon.jpg"
    },
    {
      name: "Frederick",
      role: "Network Engineer",
      company: "Micronics consulting limited",
      content: "The SD-WAN course provided me with practical knowledge that I could immediately apply in my job. The instructors were knowledgeable and supportive.",
      rating: 5,
      imageSrc: "/fredrick.jpg"
    },
    {
      name: "Amit Kumar",
      role: "IT Manager",
      company: "Fintech Solutions",
      content: "I enrolled my entire team in the CCNP program, and the results have been outstanding. The lab environment is top-notch, and the support is excellent.",
      rating: 4,
      imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Neha Gupta",
      role: "Systems Engineer",
      company: "CloudTech Services",
      content: "The CCNA course was comprehensive and well-structured. The instructors made complex concepts easy to understand with real-world examples.",
      rating: 5,
      imageSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Vikram Singh",
      role: "Network Administrator",
      company: "DataCore Systems",
      content: "The SD-ACCESS certification program gave me the skills I needed to advance in my career. The lab exercises were practical and relevant.",
      rating: 5,
      imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Ananya Reddy",
      role: "IT Consultant",
      company: "Tech Advisors",
      content: "I've taken courses from several providers, but CCIE LAB stands out for their quality of instruction and hands-on approach to learning.",
      rating: 4,
      imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Rajesh Verma",
      role: "Security Specialist",
      company: "SecureNet",
      content: "The CCIE Security track was challenging but incredibly valuable. The instructors' expertise and 24/7 lab access made all the difference.",
      rating: 5,
      imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Sanjay Mehta",
      role: "Infrastructure Manager",
      company: "Enterprise Solutions",
      content: "Our company has been sending employees to CCIE LAB for years. The ROI on their training programs is exceptional.",
      rating: 5,
      imageSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="bg-gradient-section py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-design-primary-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-design-text-accent/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-heading-1 font-bold text-text-primary mb-4">
            What Our <AuroraText>Students</AuroraText> Say
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Hear from professionals who have transformed their careers with our certification programs
          </p>
        </div>
        </div>
        
       {/* <div className="overflow-hidden py-4">
          <Marquee pauseOnHover={true} className="py-4" speed={30}>
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <TestimonialCard 
                key={index}dear
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </Marquee>
          
          <Marquee reverse={true} pauseOnHover={true} className="py-4" speed={30}>
            {testimonials.slice(4).map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </Marquee>
        </div>*/}

        {/*changes*/}
        <div className="hidden md:block">
          <Marquee pauseOnHover={true} className="py-4" speed={30}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`${testimonial.name}-${index}`}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </Marquee>

          {/*
        <><div className="flex flex-col md:flex-row justify-center gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                imageSrc={testimonial.imageSrc} />
            ))} 
          </div>  }*/}
          {/*changes ended */}
          <div className="mt-16 text-center">
              <div className="card-announcement inline-block rounded-full px-6 py-3">
                <p className="text-text-secondary text-sm">
                  Join over <span className="text-design-primary-accent font-semibold">2,500+</span> professionals who have advanced their careers with our certification programs
                </p>
              </div>
            </div>{/*</>*/}
      </div>
    </section>
  );
};

export { TestimonialsSection };