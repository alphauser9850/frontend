import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Server, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Particles } from '../components/magicui';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.success('Signed in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Dark background */}
      <div className="absolute inset-0 bg-black z-0"></div>
      
      {/* Particles background */}
      <Particles
        className="absolute inset-0 z-10"
        quantity={100}
        staticity={30}
        color="#6366f1"
        size={0.6}
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-20">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Server className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to CCIE LAB
        </h2>
        <p className="mt-2 text-center text-sm text-white/70">
          Or{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/90">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-20">
        <div className="bg-white/5 backdrop-blur-sm py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm placeholder-white/40 focus:outline-none focus:ring-primary focus:border-primary/50 sm:text-sm text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md shadow-sm placeholder-white/40 focus:outline-none focus:ring-primary focus:border-primary/50 sm:text-sm text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;