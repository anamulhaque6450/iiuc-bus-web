import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import SearchFilters from '../components/SearchFilters';
import ResultsSection from '../components/ResultsSection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import AIAssistant from '../components/AIAssistant';
import AuthTest from '../components/AuthTest';
import { busSchedules } from '../data/busSchedules';
import { useSearch } from '../hooks/useSearch';
import { Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  const [showAuthTest, setShowAuthTest] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    direction,
    setDirection,
    gender,
    setGender,
    busType,
    setBusType,
    scheduleType,
    setScheduleType,
    routeFilter,
    setRouteFilter,
    routeAreas,
    filteredSchedules,
    isSearching,
  } = useSearch(busSchedules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div id="home">
        <Header />
      </div>
      
      <main className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div id="search-filters">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            direction={direction}
            onDirectionChange={setDirection}
            gender={gender}
            onGenderChange={setGender}
            busType={busType}
            onBusTypeChange={setBusType}
            scheduleType={scheduleType}
            onScheduleTypeChange={setScheduleType}
            routeFilter={routeFilter}
            onRouteFilterChange={setRouteFilter}
            routeAreas={routeAreas}
          />
        </div>
        
        <div id="schedules">
          <ResultsSection
            schedules={filteredSchedules}
            totalSchedules={busSchedules.length}
            isSearching={isSearching}
          />
        </div>
      </main>

      <div id="routes">
        <Footer />
      </div>

      {/* Floating Components */}
      <ScrollToTop />
      <AIAssistant schedules={busSchedules} />
      
      {/* Database Test Button - Development Only */}
      <button
        onClick={() => setShowAuthTest(true)}
        className="fixed bottom-6 right-20 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Test Database Connection"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Auth Test Modal */}
      {showAuthTest && <AuthTest />}
    </div>
  );
};

export default HomePage;