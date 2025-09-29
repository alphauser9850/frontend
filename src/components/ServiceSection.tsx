import React from 'react';
import { Briefcase, UserCheck, Server } from 'lucide-react';

const services = [
  {
    icon: <Briefcase size={40} strokeWidth={2.5} className="mx-auto mb-4 text-design-primary-accent" />,
    title: 'Real-World Production Scenarios',
    description: 'Gain hands-on experience by working on labs and challenges based on real enterprise network environments.'
  },
  {
    icon: <UserCheck size={40} strokeWidth={2.5} className="mx-auto mb-4 text-design-primary-accent" />,
    title: 'Expert CCIE-Certified Trainers',
    description: 'Learn directly from industry experts. All our trainers are CCIE certified and bring years of real-world expertise.'
  },
  {
    icon: <Server size={40} strokeWidth={2.5} className="mx-auto mb-4 text-design-primary-accent" />,
    title: '24/7 Customized Lab Access',
    description: 'Practice anytime with our always-on, custom-built labs—accessible 24/7 through our own secure platform.'
  }
];

const ServiceSection: React.FC = () => (
  <section className="bg-gradient-section py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 flex flex-col items-center">
        <img
          src="/ent_golden_icon.png"
          alt="Enterprise Golden Icon"
          className="mx-auto mb-4 w-16 h-16 drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}
        />
        <h2 className="text-heading-1 font-bold text-text-primary mb-2">Invest in your career</h2>
        <p className="text-body text-text-secondary max-w-2xl mx-auto mb-2">
          Master the skills that matter with our comprehensive CCIE training program designed for real-world success.
        </p>
        <p className="text-body-small text-text-secondary max-w-xl mx-auto">
          We're here to support your growth—at your own pace, with expert guidance and a welcoming community. Let's take the next step together.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="card-feature text-center animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-design-primary-accent/10 mb-6">
            {service.icon}
              </div>
              <h3 className="text-heading-2 font-bold mb-4 text-text-primary">{service.title}</h3>
              <p className="text-body-small text-text-secondary">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceSection; 