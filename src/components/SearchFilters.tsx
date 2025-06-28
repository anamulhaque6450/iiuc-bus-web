import React, { useState } from 'react';
import { Search, Filter, Bus, Users, Calendar, MapPin, Route, X, Sparkles, Zap, ChevronDown, Clock } from 'lucide-react';
import { Direction, Gender, BusType, ScheduleType, RouteFilter } from '../types/BusSchedule';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  busType: BusType;
  onBusTypeChange: (busType: BusType) => void;
  scheduleType: ScheduleType;
  onScheduleTypeChange: (scheduleType: ScheduleType) => void;
  routeFilter: RouteFilter;
  onRouteFilterChange: (routeFilter: RouteFilter) => void;
  routeAreas: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  direction,
  onDirectionChange,
  gender,
  onGenderChange,
  busType,
  onBusTypeChange,
  scheduleType,
  onScheduleTypeChange,
  routeFilter,
  onRouteFilterChange,
  routeAreas,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const clearAllFilters = () => {
    onSearchChange('');
    onDirectionChange('All');
    onGenderChange('All');
    onBusTypeChange('All');
    onScheduleTypeChange('All');
    onRouteFilterChange('All');
  };

  const hasActiveFilters = searchTerm !== '' || direction !== 'All' || gender !== 'All' || 
                          busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

  const activeFilterCount = [
    searchTerm !== '',
    direction !== 'All',
    gender !== 'All',
    busType !== 'All',
    scheduleType !== 'All',
    routeFilter !== 'All'
  ].filter(Boolean).length;

  // Quick search suggestions with responsive display
  const quickSearches = [
    { label: '7:00 AM', icon: Clock, color: 'blue' },
    { label: 'BOT', icon: MapPin, color: 'emerald' },
    { label: 'Agrabad', icon: MapPin, color: 'teal' },
    { label: 'Chatteswari', icon: MapPin, color: 'purple' },
    { label: 'Friday', icon: Calendar, color: 'orange' },
    { label: 'Female', icon: Users, color: 'pink' },
    { label: 'AC Bus', icon: Bus, color: 'indigo' }
  ];

  const handleQuickSearch = (term: string) => {
    onSearchChange(term);
  };

  return (
    <div className="relative">
      {/* Main Search Container - Responsive */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 -mt-12 sm:-mt-16 relative z-10 overflow-hidden mx-2 sm:mx-0">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Enhanced Header - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Smart Search
                </h2>
                <p className="text-gray-600 font-medium text-sm sm:text-base">Find your perfect bus schedule instantly</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Active Filters Badge */}
              {hasActiveFilters && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    <span className="flex items-center space-x-1 sm:space-x-2">
                      <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{activeFilterCount} Active</span>
                    </span>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="group bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium transition-all border border-red-200 hover:border-red-300 text-xs sm:text-sm"
                  >
                    <span className="flex items-center space-x-1 sm:space-x-2">
                      <X className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-90 transition-transform" />
                      <span>Clear All</span>
                    </span>
                  </button>
                </div>
              )}
              
              <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-green-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Updates</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Search Input - Responsive */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4 flex items-center space-x-2">
              <Search className="h-4 w-4 text-blue-500" />
              <span>Search by time, area, or route</span>
            </label>
            
            <div className="relative group">
              <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-300 ${
                searchFocused 
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl' 
                  : 'bg-gradient-to-r from-gray-200/50 to-gray-300/50 blur-lg'
              }`}></div>
              
              <div className="relative">
                <Search className={`absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ${
                  searchFocused ? 'text-blue-500 scale-110' : 'text-gray-400'
                }`} />
                
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="e.g., 7:00 AM, Baroyarhat, Mirshorai, AC Bus..."
                  className="w-full pl-12 sm:pl-16 pr-12 sm:pr-16 py-4 sm:py-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl"
                />
                
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Search Suggestions - Responsive */}
            <div className="mt-3 sm:mt-4">
              <p className="text-sm font-semibold text-gray-600 mb-2 sm:mb-3 flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Quick Search</span>
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {quickSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(item.label)}
                    className={`group flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-medium transition-all hover:scale-105 shadow-sm hover:shadow-md text-xs sm:text-sm ${
                      item.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' :
                      item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' :
                      item.color === 'teal' ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200' :
                      item.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' :
                      item.color === 'orange' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' :
                      item.color === 'pink' ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' :
                      'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle - Responsive */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="group flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl sm:rounded-2xl font-semibold text-gray-700 transition-all border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              <span>Advanced Filters</span>
              <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              {hasActiveFilters && (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {activeFilterCount}
                </div>
              )}
            </button>
          </div>

          {/* Advanced Filter Grid - Responsive */}
          <div className={`transition-all duration-500 overflow-hidden ${
            isAdvancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                
                {/* Route/Area Filter */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Route className="h-4 w-4 text-emerald-500" />
                    <span>Route/Area</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={routeFilter}
                      onChange={(e) => onRouteFilterChange(e.target.value as RouteFilter)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base"
                    >
                      <option value="All">All Areas</option>
                      {routeAreas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Schedule Type Filter */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Schedule Type</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={scheduleType}
                      onChange={(e) => onScheduleTypeChange(e.target.value as ScheduleType)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base"
                    >
                      <option value="All">All Schedules</option>
                      <option value="Regular">Regular (Sat-Wed)</option>
                      <option value="Friday">Friday Only</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Direction Filter */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span>Direction</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={direction}
                      onChange={(e) => onDirectionChange(e.target.value as Direction)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base"
                    >
                      <option value="All">All Directions</option>
                      <option value="CityToIIUC">City → IIUC</option>
                      <option value="IIUCToCity">IIUC → City</option>
                      <option value="ToUniversity">To University</option>
                      <option value="FromUniversity">From University</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-pink-500" />
                    <span>Gender</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={gender}
                      onChange={(e) => onGenderChange(e.target.value as Gender)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base"
                    >
                      <option value="All">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bus Type Filter */}
                <div className={`space-y-2 sm:space-y-3 ${scheduleType !== 'Friday' ? 'opacity-50' : ''}`}>
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Bus className="h-4 w-4 text-indigo-500" />
                    <span>Bus Type</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={busType}
                      onChange={(e) => onBusTypeChange(e.target.value as BusType)}
                      disabled={scheduleType !== 'Friday'}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 font-medium shadow-sm text-sm sm:text-base"
                    >
                      <option value="All">All Bus Types</option>
                      <option value="IIUC Bus">IIUC Bus</option>
                      <option value="IIUC A&H B">IIUC A&H B</option>
                      <option value="AC Bus">AC Bus</option>
                      <option value="Non-AC Bus">Non-AC Bus</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Info Cards - Responsive */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {scheduleType !== 'Friday' && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <Bus className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">Bus Type Filter</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-600">
                  Only available for Friday schedules. Switch to Friday to filter by bus type.
                </p>
              </div>
            )}
            
            {routeFilter !== 'All' && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <Route className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Route Filter Active</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-600">
                  Showing schedules for <span className="font-semibold">"{routeFilter}"</span> area.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;