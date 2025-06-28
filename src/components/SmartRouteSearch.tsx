import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Route, Filter, X, Zap, Navigation, Bus, Calendar, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';

interface SmartRouteSearchProps {
  schedules: BusSchedule[];
  userGender?: 'Male' | 'Female';
  onScheduleSelect?: (schedule: BusSchedule) => void;
}

const SmartRouteSearch: React.FC<SmartRouteSearchProps> = ({ 
  schedules, 
  userGender,
  onScheduleSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'time' | 'location' | 'route'>('all');
  const [scheduleType, setScheduleType] = useState<'all' | 'regular' | 'friday'>('all');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);

  // Smart search suggestions based on common queries
  const smartSuggestions = [
    { label: '7:00 AM', type: 'time', icon: Clock, color: 'blue' },
    { label: '8:30 AM', type: 'time', icon: Clock, color: 'blue' },
    { label: 'BOT', type: 'location', icon: MapPin, color: 'emerald' },
    { label: 'Agrabad', type: 'location', icon: MapPin, color: 'teal' },
    { label: 'Chatteswari', type: 'location', icon: MapPin, color: 'purple' },
    { label: 'CUET', type: 'location', icon: MapPin, color: 'orange' },
    { label: 'GEC', type: 'location', icon: MapPin, color: 'pink' },
    { label: 'Friday', type: 'schedule', icon: Calendar, color: 'red' },
    { label: 'Morning', type: 'time', icon: Clock, color: 'yellow' },
    { label: 'Return', type: 'direction', icon: Navigation, color: 'indigo' },
  ];

  // Extract unique locations and times for smart filtering
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    schedules.forEach(schedule => {
      locations.add(schedule.startingPoint);
      locations.add(schedule.endPoint);
      // Extract locations from route
      schedule.route.split('–').forEach(location => {
        const cleanLocation = location.trim();
        if (cleanLocation && cleanLocation !== 'IIUC') {
          locations.add(cleanLocation);
        }
      });
    });
    return Array.from(locations).sort();
  }, [schedules]);

  const uniqueTimes = useMemo(() => {
    const times = new Set<string>();
    schedules.forEach(schedule => {
      times.add(schedule.time);
    });
    return Array.from(times).sort();
  }, [schedules]);

  // Smart search algorithm
  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    // Filter by user gender (students only see appropriate schedules)
    if (userGender) {
      filtered = filtered.filter(schedule => 
        !schedule.gender || schedule.gender === userGender
      );
    }

    // Filter by schedule type
    if (scheduleType !== 'all') {
      filtered = filtered.filter(schedule => 
        scheduleType === 'regular' ? schedule.scheduleType === 'Regular' : schedule.scheduleType === 'Friday'
      );
    }

    // Smart search query filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filtered = filtered.filter(schedule => {
        const searchableText = [
          schedule.time,
          schedule.startingPoint,
          schedule.endPoint,
          schedule.route,
          schedule.busType || '',
          schedule.remarks || '',
          schedule.description || '',
          schedule.direction,
          schedule.scheduleType
        ].join(' ').toLowerCase();

        // Direct text match
        if (searchableText.includes(query)) return true;

        // Smart time matching (e.g., "7" matches "7:00 AM")
        if (query.match(/^\d{1,2}$/) && schedule.time.startsWith(query)) return true;

        // Smart location matching (partial matches)
        const locations = [schedule.startingPoint, schedule.endPoint, ...schedule.route.split('–')];
        if (locations.some(loc => loc.toLowerCase().includes(query))) return true;

        // Smart direction matching
        if (query.includes('return') || query.includes('back')) {
          return schedule.direction.includes('ToCity') || schedule.direction.includes('FromUniversity');
        }

        if (query.includes('morning')) {
          const hour = parseInt(schedule.time.split(':')[0]);
          return hour >= 6 && hour <= 10;
        }

        if (query.includes('afternoon')) {
          const hour = parseInt(schedule.time.split(':')[0]);
          return hour >= 11 && hour <= 16;
        }

        return false;
      });
    }

    // Additional filter by type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'time') {
        // Sort by time when time filter is selected
        filtered = filtered.sort((a, b) => {
          const timeA = new Date(`1970-01-01 ${a.time}`).getTime();
          const timeB = new Date(`1970-01-01 ${b.time}`).getTime();
          return timeA - timeB;
        });
      }
    }

    return filtered;
  }, [schedules, searchQuery, selectedFilter, scheduleType, userGender]);

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.label);
    if (suggestion.type === 'schedule') {
      setScheduleType(suggestion.label.toLowerCase() === 'friday' ? 'friday' : 'regular');
    }
  };

  const handleScheduleClick = (schedule: BusSchedule) => {
    setSelectedSchedule(selectedSchedule?.id === schedule.id ? null : schedule);
    if (onScheduleSelect) {
      onScheduleSelect(schedule);
    }
  };

  const getTimeCategory = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour <= 9) return 'Morning';
    if (hour >= 10 && hour <= 14) return 'Midday';
    if (hour >= 15 && hour <= 18) return 'Afternoon';
    return 'Evening';
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
      case 'ToUniversity':
        return '→ IIUC';
      case 'IIUCToCity':
      case 'FromUniversity':
        return '← City';
      default:
        return '↔';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/20 rounded-full p-2">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Smart Route Finder</h3>
            <p className="text-blue-100 text-sm">Find your perfect bus schedule instantly</p>
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by time, location, or route (e.g., '7:00 AM', 'BOT', 'Agrabad')"
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-blue-100 mb-2 flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Quick Search</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {smartSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${
                  suggestion.color === 'blue' ? 'bg-blue-400/30 text-blue-100 hover:bg-blue-400/40' :
                  suggestion.color === 'emerald' ? 'bg-emerald-400/30 text-emerald-100 hover:bg-emerald-400/40' :
                  suggestion.color === 'teal' ? 'bg-teal-400/30 text-teal-100 hover:bg-teal-400/40' :
                  suggestion.color === 'purple' ? 'bg-purple-400/30 text-purple-100 hover:bg-purple-400/40' :
                  suggestion.color === 'orange' ? 'bg-orange-400/30 text-orange-100 hover:bg-orange-400/40' :
                  suggestion.color === 'pink' ? 'bg-pink-400/30 text-pink-100 hover:bg-pink-400/40' :
                  suggestion.color === 'red' ? 'bg-red-400/30 text-red-100 hover:bg-red-400/40' :
                  suggestion.color === 'yellow' ? 'bg-yellow-400/30 text-yellow-100 hover:bg-yellow-400/40' :
                  'bg-indigo-400/30 text-indigo-100 hover:bg-indigo-400/40'
                }`}
              >
                <suggestion.icon className="h-3 w-3" />
                <span>{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          {/* Schedule Type Filter */}
          <select
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value as any)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Schedules</option>
            <option value="regular">Regular (Sat-Wed)</option>
            <option value="friday">Friday Only</option>
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <span>Advanced</span>
            {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600">
            <span className="font-semibold text-blue-600">{filteredSchedules.length}</span> routes found
          </div>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Type</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="time">By Time</option>
                <option value="location">By Location</option>
                <option value="route">By Route</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quick Times</label>
              <select
                value=""
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Time</option>
                {uniqueTimes.slice(0, 10).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quick Locations</label>
              <select
                value=""
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Location</option>
                {uniqueLocations.slice(0, 10).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {filteredSchedules.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => handleScheduleClick(schedule)}
                className={`p-4 hover:bg-blue-50 cursor-pointer transition-all ${
                  selectedSchedule?.id === schedule.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Time */}
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{schedule.time}</div>
                      <div className="text-xs text-gray-500">{getTimeCategory(schedule.time)}</div>
                    </div>

                    {/* Route Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 truncate">{schedule.startingPoint}</span>
                        <span className="text-gray-400">{getDirectionIcon(schedule.direction)}</span>
                        <span className="font-semibold text-gray-900 truncate">{schedule.endPoint}</span>
                      </div>
                      <div className="text-sm text-gray-600 truncate">{schedule.route}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex space-x-1">
                      {schedule.scheduleType === 'Friday' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Friday
                        </span>
                      )}
                      {schedule.gender && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          schedule.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {schedule.gender}
                        </span>
                      )}
                    </div>
                    {schedule.busType && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {schedule.busType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSchedule?.id === schedule.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Direction:</span>
                        <span className="ml-2 text-gray-600">{schedule.direction}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Schedule:</span>
                        <span className="ml-2 text-gray-600">{schedule.scheduleType}</span>
                      </div>
                      {schedule.remarks && (
                        <div className="sm:col-span-2">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <span className="ml-2 text-gray-600">{schedule.remarks}</span>
                        </div>
                      )}
                      {schedule.description && (
                        <div className="sm:col-span-2">
                          <span className="font-medium text-gray-700">Description:</span>
                          <span className="ml-2 text-gray-600">{schedule.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No routes found</h4>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setScheduleType('all');
                  setSelectedFilter('all');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredSchedules.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Bus className="h-4 w-4" />
                <span>{filteredSchedules.length} routes</span>
              </div>
              {userGender && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Filtered for {userGender}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Star className="h-4 w-4" />
              <span>Smart Search Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRouteSearch;