import React from 'react';
import { AuroraText } from './magicui';
import { Server, Network, Cpu } from 'lucide-react';
import { TerminalMockup } from './TerminalMockup';

const LabShowcaseSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-indigo-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hands-on <AuroraText>Lab Environment</AuroraText>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Practice with real-world network topologies in our Cisco Modeling Labs environment
          </p>
        </div>
        
        <div className="mb-20">
          <TerminalMockup />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group">
            <div className="p-3 rounded-full bg-primary/10 text-primary w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
              <Server className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Professional-grade Simulation</h3>
            <p className="text-white/70">
              Access to Cisco Modeling Labs (CML) with real Cisco IOS images for authentic networking experience.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group">
            <div className="p-3 rounded-full bg-primary/10 text-primary w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
              <Network className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-world Topologies</h3>
            <p className="text-white/70">
              Practice with enterprise-grade network designs that mirror actual production environments.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group">
            <div className="p-3 rounded-full bg-primary/10 text-primary w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
              <Cpu className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dedicated Resources</h3>
            <p className="text-white/70">
              Each student gets dedicated lab resources with 24/7 access throughout the duration of the course.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { LabShowcaseSection }; 