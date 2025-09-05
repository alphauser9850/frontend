import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Youtube, Linkedin, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { AuroraText } from './magicui';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                {/* Square overlay backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-purple-600/25 to-blue-600/25 rounded-xl blur-lg scale-110 group-hover:scale-125 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-pink-500/20 to-yellow-400/20 rounded-xl blur-xl scale-115 group-hover:scale-130 transition-all duration-700"></div>
                
                {/* Main logo container - square */}
                <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/25 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {/* Logo image - natural square */}
                  <img 
                    src="/ccielab.net logo.jpeg" 
                    alt="CCIELAB.NET Logo" 
                    className="h-12 w-12 object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  {/* Square animated borders */}
                  <div className="absolute inset-0 rounded-xl border border-primary/30 group-hover:border-primary/60 transition-all duration-300"></div>
                  <div className="absolute inset-1 rounded-lg border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-500"></div>
                  
                  {/* Square glow effects */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Enhanced text */}
              <div className="flex flex-col">
                <span className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
                  <AuroraText>CCIELAB.NET</AuroraText>
                </span>
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  Advanced CCIE Training
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6">
              Creating transformative online CCIE training experiences that empower network engineers to excel.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.youtube.com/@ccielab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/105885899/admin/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/ccielab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/Deshmuk955803" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses/ccie" className="text-muted-foreground hover:text-primary transition-colors">
                  CCIE Enterprise
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>


              
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="space-y-2">
              <h3 className="font-medium">Contact Us</h3>
              <a href="mailto:support@ccielab.net" className="text-muted-foreground hover:text-primary transition-colors">
                support@ccielab.net
              </a>
              <p className="text-muted-foreground">
                +1 760 858 0505
              </p>
              <p className="text-muted-foreground">
                2175 Goodyear Ave. Ste 110 Ventura CA 93003
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} CCIE LAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer }; 
