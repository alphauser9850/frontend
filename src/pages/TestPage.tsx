import React, { useState } from 'react';
import { BorderBeam } from '../components/magicui';
import { BorderBeamWrapper } from '../components/ui/BorderBeamWrapper';
import { Modal } from '../components/ui/Modal';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

const TestPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center">BorderBeam Effect Test</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Test Card 1 */}
          <div className="relative overflow-hidden rounded-xl border border-border p-6 bg-background">
            <h2 className="text-xl font-bold mb-4">Direct BorderBeam Implementation</h2>
            <p className="text-muted-foreground mb-4">
              This card uses the BorderBeam component directly.
            </p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => setShowLoginModal(true)}
            >
              Open Login Modal
            </button>
            
            {/* Enhanced BorderBeam with smooth transition */}
            <BorderBeam
              duration={8}
              size={1200}
              colorFrom="transparent"
              colorTo="rgba(99, 102, 241, 0.9)"
              className="absolute inset-0 z-0"
            />
          </div>
          
          {/* Test Card 2 */}
          <BorderBeamWrapper beamColor="purple" duration={8}>
            <div className="p-6 bg-background">
              <h2 className="text-xl font-bold mb-4">BorderBeamWrapper Implementation</h2>
              <p className="text-muted-foreground mb-4">
                This card uses the BorderBeamWrapper component.
              </p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                onClick={() => setShowRegisterModal(true)}
              >
                Open Register Modal
              </button>
            </div>
          </BorderBeamWrapper>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Color Variations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['blue', 'purple', 'green', 'yellow', 'pink', 'indigo'].map((color) => (
              <BorderBeamWrapper 
                key={color} 
                beamColor={color as any} 
                duration={8}
              >
                <div className="p-4 bg-background text-center">
                  <h3 className="font-medium capitalize">{color}</h3>
                </div>
              </BorderBeamWrapper>
            ))}
          </div>
        </div>
        
        {/* Additional test section with different animation patterns */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Animation Patterns</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl border border-border p-6 bg-background">
              <h2 className="text-xl font-bold mb-4">Standard Direction</h2>
              <p className="text-muted-foreground mb-4">
                This card uses the default animation direction.
              </p>
              
              <BorderBeam
                duration={8}
                size={1200}
                colorFrom="transparent"
                colorTo="rgba(99, 102, 241, 1.0)"
                className="absolute inset-0 z-0"
              />
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-border p-6 bg-background">
              <h2 className="text-xl font-bold mb-4">Reverse Direction</h2>
              <p className="text-muted-foreground mb-4">
                This card uses the reverse animation direction.
              </p>
              
              <BorderBeam
                duration={8}
                size={1200}
                reverse={true}
                colorFrom="transparent"
                colorTo="rgba(236, 72, 153, 0.9)"
                className="absolute inset-0 z-0"
              />
            </div>
          </div>
        </div>
        
        {/* Dual beam test section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Dual Beam Effect</h2>
          <div className="relative overflow-hidden rounded-xl border border-border p-6 bg-background">
            <h2 className="text-xl font-bold mb-4">Opposing Directions</h2>
            <p className="text-muted-foreground mb-4">
              This card uses two beams moving in opposite directions - just like the modal.
            </p>
            
            <BorderBeam
              duration={8}
              size={1200}
              colorFrom="transparent"
              colorTo="rgba(99, 102, 241, 0.9)"
              className="absolute inset-0 z-0"
            />
            
            <BorderBeam
              duration={8}
              delay={4}
              size={1200}
              reverse={true}
              colorFrom="transparent"
              colorTo="rgba(236, 72, 153, 0.9)"
              className="absolute inset-0 z-0"
            />
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login to Your Account"
      >
        <LoginForm 
          onSuccess={() => setShowLoginModal(false)} 
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>
      
      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create Your Account"
      >
        <RegisterForm 
          onSuccess={() => setShowRegisterModal(false)}
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>
    </div>
  );
};

export default TestPage; 