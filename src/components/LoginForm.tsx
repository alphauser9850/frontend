import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { AuroraText } from './magicui';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  // Function to detect if text contains links
  const containsLinks = (text: string): boolean => {
    const linkPatterns = [
      /https?:\/\/[^\s]+/gi,           // HTTP/HTTPS URLs
      /www\.[^\s]+/gi,                  // WWW URLs
      /[^\s]+\.[a-z]{2,}/gi,           // Domain patterns
      /bit\.ly\/[^\s]+/gi,              // Bit.ly links
      /t\.co\/[^\s]+/gi,                // Twitter links
      /goo\.gl\/[^\s]+/gi,              // Google links
      /tinyurl\.com\/[^\s]+/gi,         // TinyURL links
      /[^\s]+\.com\/[^\s]*/gi,          // .com URLs
      /[^\s]+\.org\/[^\s]*/gi,          // .org URLs
      /[^\s]+\.net\/[^\s]*/gi,          // .net URLs
      /[^\s]+\.io\/[^\s]*/gi,           // .io URLs
      /[^\s]+\.co\/[^\s]*/gi,           // .co URLs
      /ftp:\/\/[^\s]+/gi,               // FTP URLs
      /mailto:[^\s]+/gi,                // Mailto links
      /tel:[^\s]+/gi,                   // Tel links
      /file:\/\/[^\s]+/gi               // File links
    ];
    
    return linkPatterns.some(pattern => pattern.test(text));
  };

  // Function to prevent link input
  const preventLinks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Check if the new value contains links
    if (containsLinks(value)) {
      e.preventDefault();
      // Remove the link and show warning
      const cleanValue = value.replace(/https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,}|bit\.ly\/[^\s]+|t\.co\/[^\s]+|goo\.gl\/[^\s]+|tinyurl\.com\/[^\s]+|[^\s]+\.(com|org|net|io|co)\/[^\s]*|ftp:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|file:\/\/[^\s]+/gi, '');
      
      // Update the appropriate state based on the field
      if (e.target.id === 'email') {
        setEmail(cleanValue);
      } else if (e.target.id === 'password') {
        setPassword(cleanValue);
      }
      
      // Show error message
      setError('Links are not allowed in this field');
      
      return false;
    }
    
    return true;
  };

  // Function to handle paste events and prevent links
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const pastedText = e.clipboardData.getData('text');
    
    // Check if pasted text contains links
    if (containsLinks(pastedText)) {
      // Show error message
      setError('Links are not allowed in this field. Please remove any URLs before pasting.');
      return;
    }
    
    // If no links, allow the paste by manually setting the value
    const { id, value } = e.currentTarget;
    const newValue = value + pastedText;
    
    // Update the appropriate state based on the field
    if (id === 'email') {
      setEmail(newValue);
    } else if (id === 'password') {
      setPassword(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, this would be an actual API call
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError('Invalid email or password. Please try again.');
        return;
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AuroraText className="text-2xl font-bold">Welcome Back</AuroraText>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              if (preventLinks(e)) {
                setEmail(e.target.value);
              }
            }}
            onPaste={handlePaste}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                if (preventLinks(e)) {
                  setPassword(e.target.value);
                }
              }}
              onPaste={handlePaste}
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
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <button 
          onClick={onRegisterClick} 
          className="text-primary hover:underline font-medium"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export { LoginForm }; 