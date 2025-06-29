import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Menu, X, Clock, MapPin, Phone, Search, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const getDashboardRoute = () => {
    if (!userProfile) return '/login';
    
    switch (userProfile.role) {
      case 'student':
        return '/student-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section - Enhanced Mobile Responsiveness */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-lg opacity-30 transition-colors ${
                isScrolled ? 'bg-blue-400' : 'bg-white'
              }`}></div>
              <div className={`relative rounded-full p-1.5 sm:p-2 border transition-all ${
                isScrolled 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white/10 backdrop-blur-sm border-white/20'
              }`}>
                <img 
                  src="/iiuc.png" 
                  alt="IIUC"
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                />
              </div>
            </div>
            
            {/* Desktop Logo Text - Full Title */}
            <div className="hidden md:block">
              <h1 className={`text-lg sm:text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs sm:text-sm transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Smart Transport Solution
              </p>
            </div>
            
            {/* Tablet Logo Text - Medium Title */}
            <div className="hidden sm:block md:hidden">
              <h1 className={`text-base sm:text-lg font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Transport Solution
              </p>
            </div>
            
            {/* Mobile Logo Text - Compact but Full */}
            <div className="block sm:hidden">
              <h1 className={`text-sm font-bold transition-colors leading-tight ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs transition-colors leading-tight ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Smart Transport
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden xl:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Bus className="h-4 w-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => scrollToSection('search-filters')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            
            <button
              onClick={() => scrollToSection('schedules')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Schedules</span>
            </button>
            
            <button
              onClick={() => scrollToSection('routes')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Routes</span>
            </button>
          </div>

          {/* Right Side Actions - Enhanced Mobile Layout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* User Authentication Section - Mobile Optimized */}
            {user && userProfile ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Desktop Dashboard Button */}
                <Link
                  to={getDashboardRoute()}
                  className={`hidden lg:flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {/* Mobile Dashboard Button */}
                <Link
                  to={getDashboardRoute()}
                  className={`lg:hidden flex items-center space-x-1 px-3 py-2 rounded-xl font-semibold transition-all shadow-md ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Dashboard</span>
                </Link>
                
                {/* Desktop Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isScrolled 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Desktop Auth Buttons */}
                <div className="hidden lg:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      isScrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Auth Buttons - Always Visible */}
                <div className="flex lg:hidden items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${
                      isScrolled 
                        ? 'text-gray-700 hover:bg-gray-100 border border-gray-300' 
                        : 'text-white hover:bg-white/10 border border-white/30'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-3 py-2 rounded-xl font-semibold transition-all shadow-md text-sm ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Contact Button - Hidden on small screens */}
            <a
              href="tel:+880-31-2510500"
              className={`hidden lg:flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                isScrolled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </a>

            {/* Mobile Contact Button */}
            <a
              href="tel:+880-31-2510500"
              className={`lg:hidden p-2 sm:p-3 rounded-xl transition-all ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-2 sm:p-3 rounded-xl transition-all ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Professional Design */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg rounded-b-2xl">
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="flex items-center space-x-3 w-full px-4 sm:px-5 py-2.5 sm:py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-xl transition-all border border-transparent"
              >
                <Bus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">Home</span>
              </button>
              
              <button
                onClick={() => scrollToSection('search-filters')}
                className="flex items-center space-x-3 w-full px-4 sm:px-5 py-2.5 sm:py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-xl transition-all border border-transparent"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">Search Schedules</span>
              </button>
              
              <button
                onClick={() => scrollToSection('schedules')}
                className="flex items-center space-x-3 w-full px-4 sm:px-5 py-2.5 sm:py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-xl transition-all border border-transparent"
              >
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">All Schedules</span>
              </button>
              
              <button
                onClick={() => scrollToSection('routes')}
                className="flex items-center space-x-3 w-full px-4 sm:px-5 py-2.5 sm:py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-xl transition-all border border-transparent"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">Route Information</span>
              </button>
              
              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                {user && userProfile ? (
                  <div className="space-y-3">
                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">My Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition-all shadow-sm hover:shadow-md border border-blue-200"
                    >
                      <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition-all shadow-sm hover:shadow-md border border-blue-200"
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      <span className="text-sm sm:text-base">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;