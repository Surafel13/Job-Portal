import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import illustrationSrc from '../assets/Screenshot 2026-03-12 1202472.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };


  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Left - Illustration / Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-blue-50 items-center justify-center">
        <img
          src={illustrationSrc}
          alt="Job search illustration - person with magnifying glass looking at briefcases"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-10">
            <Link to="/">
              <div className="bg-[#0034D1] text-white px-5 py-3 rounded-lg font-bold text-xl flex items-center gap-2 shadow-md hover:bg-blue-700 transition">
                <span className="text-2xl">💼</span>
                JOBS<span className="text-blue-200">PHERE</span>
              </div>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-9">
            Log in to your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="
                    w-full pl-10 pr-4 py-3 border border-gray-300 
                    rounded-lg focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 outline-none transition
                  "
                  required
                />
            </div>

            {/* Password Field */}
            <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full pl-10 pr-4 py-3 border border-gray-300 
                    rounded-lg focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 outline-none transition
                  "
                  required
                />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                w-full bg-[#0034D1] text-white py-3 rounded-lg 
                font-medium hover:bg-[#001D75] transition 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              {
                name: 'Google',
                icon: (
                  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C35.9 3.3 30.3 1 24 1 14.6 1 6.6 6.4 2.7 14.4l7.5 5.8C12 13.7 17.6 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.5-.1-2.6-.4-3.8H24v7.2h12.5c-.5 2.9-2.1 5.3-4.5 7l7 5.4c4.1-3.8 6.1-9.3 6.1-15.8z" />
                    <path fill="#FBBC05" d="M10.2 28.1c-.6-1.7-1-3.6-1-5.6s.4-3.9 1-5.6l-7.5-5.8C1 14.6 0 19.2 0 22.5S1 30.4 2.7 33.9l7.5-5.8z" />
                    <path fill="#34A853" d="M24 44c6.3 0 11.6-2.1 15.5-5.7l-7-5.4c-2 1.4-4.6 2.2-8.5 2.2-6.4 0-11.9-4.2-13.8-9.8l-7.5 5.8C6.6 41.6 14.6 47 24 47z" />
                  </svg>
                ),
              },
              {
                name: 'Apple',
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-900" aria-hidden="true">
                    <path fill="currentColor" d="M17.6 13.9c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.6.8-3.3.8s-1.8-.8-2.9-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.2.7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-.9 2.7-2 1-1.5 1.4-2.9 1.4-3 .1-.1-2.7-1-2.7-3.7zM14.7 6.7c.6-.8 1-1.9.9-3-1 .1-2.1.7-2.7 1.5-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.4z" />
                  </svg>
                ),
              },
              {
                name: 'Facebook',
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]" aria-hidden="true">
                    <path fill="currentColor" d="M22 12.1C22 6.6 17.5 2.1 12 2.1S2 6.6 2 12.1c0 5 3.7 9.1 8.5 9.9v-7H8.1v-2.9h2.4V9.9c0-2.4 1.4-3.7 3.5-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4v1.7h2.6l-.4 2.9h-2.2v7c4.8-.8 8.5-4.9 8.5-9.9z" />
                  </svg>
                ),
              },
              {
                name: 'LinkedIn',
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0A66C2]" aria-hidden="true">
                    <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0.5 8h4V23h-4V8zm7 0h3.8v2.1h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v6.9h-4v-6.1c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V23h-4V8z" />
                  </svg>
                ),
              },
            ].map((provider) => (
              <button
                key={provider.name}
                aria-label={`Continue with ${provider.name}`}
                className="
                  flex items-center justify-center p-3 border border-gray-300 
                  rounded-lg hover:bg-gray-50 transition
                "
              >
                {provider.icon}
              </button>
            ))}
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-bold text-md text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

