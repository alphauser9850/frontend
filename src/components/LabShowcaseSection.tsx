import React, { useState, useEffect } from 'react';
import { AuroraText } from './magicui';
import { ChevronLeft, ChevronRight, Network, Layers, Globe } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface Topology {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const LabShowcaseSection: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Topology data based on the files found in /public/topologies
  const topologies: Topology[] = [
    {
      id: 1,
      title: "Switching Campus Lab Topology",
      description: "Complete enterprise campus switching infrastructure with VLANs, STP, and inter-VLAN routing",
      image: "/topologies/Switching Campus Lab Topology.jpeg",
      category: "Campus Network"
    },
    {
      id: 2,
      title: "SD-WAN Deployment",
      description: "Software-Defined WAN topology with vEdge routers, controllers, and orchestration",
      image: "/topologies/SDWAN .jpeg",
      category: "SD-WAN"
    },
    {
      id: 3,
      title: "OSPF Lab Topology",
      description: "Multi-area OSPF configuration with different area types and route summarization",
      image: "/topologies/OSPF Lab Topology.png",
      category: "Routing Protocols"
    },
    {
      id: 4,
      title: "GLBP Implementation",
      description: "Gateway Load Balancing Protocol setup for high availability and load distribution",
      image: "/topologies/Implement GLBP.png",
      category: "High Availability"
    },
    {
      id: 5,
      title: "BGP Lab Topology",
      description: "Border Gateway Protocol configuration with eBGP and iBGP peering relationships",
      image: "/topologies/BGP LAB Topology.jpeg",
      category: "Routing Protocols"
    },
    {
      id: 6,
      title: "Multiarea OSPFv3",
      description: "IPv6 OSPF implementation with multiple areas and advanced features",
      image: "/topologies/1012 Lab - Implement Multiarea OSPFv3- ILMdocx.png",
      category: "IPv6 Routing"
    },
    {
      id: 7,
      title: "InterVLAN Routing",
      description: "Layer 3 switching and VLAN routing implementation with SVIs and routed ports",
      image: "/topologies/_Implement InterVLAN Routing .png",
      category: "Layer 3 Switching"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topologies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [topologies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topologies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topologies.length) % topologies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Campus Network':
      case 'Layer 3 Switching':
        return <Network className="h-4 w-4" />;
      case 'Routing Protocols':
      case 'IPv6 Routing':
        return <Layers className="h-4 w-4" />;
      case 'SD-WAN':
      case 'High Availability':
        return <Globe className="h-4 w-4" />;
      default:
        return <Network className="h-4 w-4" />;
    }
  };

  return (
    <section className="bg-gradient-section py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading-1 font-bold text-text-primary mb-4">
            Hands-on <AuroraText>Cisco Lab Environment</AuroraText>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Practice with real-world network topologies in our Cisco Modeling Labs environment
          </p>
        </div>
        
        {/* Topology Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main carousel container */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-large">
              <div 
                className="flex transition-transform duration-700 ease-in-out h-full" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {topologies.map((topology) => (
                  <div key={topology.id} className="w-full flex-shrink-0 relative">
                    <img 
                      src={topology.image} 
                      alt={topology.title} 
                      className="w-full h-full object-contain bg-white"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-design-primary-accent/20 text-design-primary-accent">
                          {getCategoryIcon(topology.category)}
                          {topology.category}
                        </span>
                      </div>
                      <h3 className="text-heading-2 font-bold text-text-primary mb-3">
                        {topology.title}
                      </h3>
                      <p className="text-body text-text-secondary max-w-2xl">
                        {topology.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 bg-surface/80 backdrop-blur-sm text-text-primary hover:bg-surface border border-border-subtle"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 bg-surface/80 backdrop-blur-sm text-text-primary hover:bg-surface border border-border-subtle"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Slide indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {topologies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentSlide === index 
                      ? "w-8 bg-design-primary-accent" 
                      : "w-2 bg-design-primary-accent/30 hover:bg-design-primary-accent/50"
                  )}
                ></button>
              ))}
            </div>
          </div>
          
          {/* Additional info */}
          <div className="mt-12 text-center">
            <p className="text-body text-text-secondary mb-6">
              These are just a few examples of the lab topologies you'll work with. Our curriculum includes over 50 different lab scenarios covering all aspects of enterprise networking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card-feature text-center">
                <Network className="h-8 w-8 mb-4 mx-auto text-design-primary-accent" />
                <h3 className="text-heading-2 font-semibold mb-2 text-text-primary">Real Cisco Equipment</h3>
                <p className="text-body-small text-text-secondary">
                  Practice with actual Cisco IOS images and virtual instances
                </p>
              </div>
              
              <div className="card-feature text-center">
                <Globe className="h-8 w-8 mb-4 mx-auto text-design-primary-accent" />
                <h3 className="text-heading-2 font-semibold mb-2 text-text-primary">24/7 Remote Access</h3>
                <p className="text-body-small text-text-secondary">
                  Access your lab environment anytime, anywhere
                </p>
              </div>
              
              <div className="card-feature text-center">
                <Layers className="h-8 w-8 mb-4 mx-auto text-design-primary-accent" />
                <h3 className="text-heading-2 font-semibold mb-2 text-text-primary">Guided Learning</h3>
                <p className="text-body-small text-text-secondary">
                  Step-by-step instructions and expert mentorship
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { LabShowcaseSection }; 