import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Mail, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { signIn, user, userProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or university ID
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user && userProfile) {
    const dashboardRoutes = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard',
    };
    return <Navigate to={dashboardRoutes[userProfile.role]} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Starting login process...');
      const { error } = await signIn(formData.identifier, formData.password);

      if (error) {
        console.error('❌ Login error:', error);
        setError(error.message || 'Login failed. Please try again.');
      } else {
        console.log('✅ Login successful, waiting for redirect...');
        // Don't set loading to false here - let the auth context handle it
        return;
      }
    } catch (err) {
      console.error('❌ Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                <img 
                  src="/iiuc.png" 
                  alt="IIUC"
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                <Bus className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your IIUC Bus Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                
                {/* Email verification reminder */}
                {error.includes('confirmation') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Email Verification Required</p>
                      <p>Please check your email inbox and click the verification link. After verification, you can sign in here.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Identifier Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                Email or University ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Enter your email or university ID"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Success Notice for New Users */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-semibold mb-1">Just Verified Your Email?</p>
                <p>Perfect! You can now sign in with the credentials you used during registration.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;