import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Mail, Phone, GraduationCap, Users, CheckCircle } from 'lucide-react';

const SignupPage: React.FC = () => {
  const { signUp, user, userProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university_id: '',
    mobile: '',
    gender: 'Male' as 'Male' | 'Female',
    role: 'student' as 'student' | 'teacher',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setSuccess('');
    setNeedsConfirmation(false);
    setIsLoading(true);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.university_id.trim() || 
        !formData.mobile.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check university ID format (basic validation)
    if (formData.university_id.length < 3) {
      setError('University ID must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    const { error, needsConfirmation: confirmationRequired } = await signUp(formData.email, formData.password, {
      name: formData.name,
      email: formData.email,
      university_id: formData.university_id,
      mobile: formData.mobile,
      gender: formData.gender,
      role: formData.role,
    });

    if (error) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else if (error.message?.includes('email')) {
        setError('Please enter a valid email address.');
      } else if (error.message?.includes('password')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } else if (confirmationRequired) {
      setNeedsConfirmation(true);
      setSuccess('Registration successful! Please check your email and click the confirmation link to activate your account.');
    } else {
      setSuccess('Registration successful! You can now sign in.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            Join IIUC Bus
          </h1>
          <p className="text-gray-600">Create your account to access bus schedules</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          
          {/* Success Message for Email Confirmation */}
          {needsConfirmation && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-2">Check Your Email!</p>
                  <p className="mb-2">We've sent a confirmation link to <strong>{formData.email}</strong></p>
                  <p>Please click the link in your email to activate your account, then return here to sign in.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && !needsConfirmation && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-semibold">{success}</p>
                  <Link to="/login" className="text-green-600 hover:text-green-800 font-medium underline">
                    Go to Login Page →
                  </Link>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* University ID Field */}
            <div>
              <label htmlFor="university_id" className="block text-sm font-semibold text-gray-700 mb-2">
                University ID
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="university_id"
                  name="university_id"
                  value={formData.university_id}
                  onChange={handleChange}
                  placeholder="Enter your student/employee ID"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Gender and Role Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                    required
                    disabled={isLoading}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                    required
                    disabled={isLoading}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher/Staff</option>
                  </select>
                </div>
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
                  placeholder="Create a password (min. 6 characters)"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
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

export default SignupPage;