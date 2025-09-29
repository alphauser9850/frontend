import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AnimatedDotPattern, BorderBeam } from '../magicui';
import '../magicui/border-beam.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div 
        ref={modalRef}
        className={cn(
          "border-beam-container relative w-full max-w-md bg-background rounded-xl shadow-lg overflow-hidden",
          "border border-border",
          "animate-in fade-in zoom-in-95 duration-300",
          className
        )}
        style={{ 
          maxHeight: '90vh', 
          overflowY: 'auto',
          position: 'relative',
          margin: 'auto'
        }}
      >
        {/* First beam */}
        <BorderBeam
          duration={8}
          size={1200}
          colorFrom="transparent"
          colorTo="rgba(99, 102, 241, 0.9)"
          className="absolute inset-0 z-0"
        />
        
        {/* Second beam with delay and different direction */}
        <BorderBeam
          duration={8}
          delay={4}
          size={1200}
          reverse={true}
          colorFrom="transparent"
          colorTo="rgba(59, 130, 246, 0.9)"
          className="absolute inset-0 z-0"
        />
        
        <div className="absolute inset-0 overflow-hidden">
          <AnimatedDotPattern 
            glow={true}
            width={40}
            height={40}
            cr={1}
            className="absolute inset-0 text-primary/5 opacity-50"
          />
        </div>
        
        <div className="border-beam-content relative p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Modal }; 