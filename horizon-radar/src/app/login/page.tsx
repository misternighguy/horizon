'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // For now, let's use a simple check - any valid email in our database will work
    // In a real app, you'd check passwords too
    try {
      // Get users from database
      const users = JSON.parse(localStorage.getItem('horizon_radar_users') || '[]');
      console.log('🔍 Found users in database:', users);
      console.log('🔍 Looking for email:', email);
      
      const user = users.find((u: { email: string }) => u.email === email);
      console.log('🔍 Found user:', user);
      
      if (user) {
        // Set session
        localStorage.setItem('userSession', user.username);
        setIsLoggedIn(true);
        setUserEmail(email);
        setIsLoading(false);
        
        // Redirect to profile after successful login
        setTimeout(() => {
          window.location.href = '/profile';
        }, 500);
      } else {
        alert('User not found. Please check your email or create an account.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  // Show authenticated user dashboard
  if (isLoggedIn) {
    return (
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 z-0 bg-black/40" />
        
        <div className="relative z-20">
          <Header />
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full px-4 -mt-20">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-[rgb(var(--color-horizon-green))] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a2 2 0 002-2V8z"/>
                </svg>
              </div>
              
              <h1 className="text-4xl font-medium text-white mb-4">You are already logged in!</h1>
              
              <div className="space-y-3">
                <Link
                  href="/profile"
                  className="block w-full bg-[rgb(var(--color-horizon-green))] text-black font-medium py-3 px-6 rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all"
                >
                  View Profile
                </Link>
                
                <Link
                  href="/"
                  className="block w-full bg-white/10 border border-white/20 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/20 transition-all"
                >
                  Return Home
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/20 transition-all"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 z-0 bg-black/40" />
      
      <div className="relative z-20">
        <Header />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full px-4 -mt-20">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-medium text-white mb-2">
                Welcome to Horizon Radar
              </h1>
              <p className="text-white/70">
                Sign in to access premium research content
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[rgb(var(--color-horizon-green))] text-black font-medium py-4 px-6 rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-white/70">
                <div className="w-2 h-2 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
                <span className="text-sm">Access premium research content</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <div className="w-2 h-2 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
                <span className="text-sm">Save favorite protocols</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <div className="w-2 h-2 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
                <span className="text-sm">Get personalized insights</span>
              </div>
            </div>

            {/* Terms & Conditions Link */}
            <div className="mt-6 text-center">
              <Link
                href="/terms"
                className="inline-flex items-center space-x-2 text-white/50 hover:text-white/70 text-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Read Terms & Conditions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
