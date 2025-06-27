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
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/deshmukh-logo.png" alt="CCIE Lab Logo" className="h-10 w-10 rounded-xl object-contain bg-white p-1 shadow" />
              <span className="font-bold text-xl">
                <AuroraText>CCIE LAB</AuroraText>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Creating transformative online CCIE training experiences that empower network engineers to excel.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.youtube.com/@deshmukhsystems" 
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
                href="https://www.instagram.com/deshmukhsystems" 
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
                <Link to="/test" className="text-muted-foreground hover:text-primary transition-colors">
                  Test Page
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
