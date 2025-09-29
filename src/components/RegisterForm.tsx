import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { AuroraText } from './magicui';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLoginClick }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error: signUpError } = await signUp(email, password, fullName);
      
      if (signUpError) {
        setError(signUpError.message || 'Failed to create account. Please try again.');
        return;
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AuroraText className="text-2xl font-bold">Create Account</AuroraText>
        <p className="text-muted-foreground mt-2">Join our community of network engineers</p>
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{' '}
        <button 
          onClick={onLoginClick} 
          className="text-primary hover:underline font-medium"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export { RegisterForm }; 