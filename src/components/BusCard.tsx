import React, { useState } from 'react';
import { Clock, MapPin, Route, ArrowRight, Users, Bus, Calendar, Star, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';

interface BusCardProps {
  schedule: BusSchedule;
}

const BusCard: React.FC<BusCardProps> = ({ schedule }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'IIUCToCity':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'ToUniversity':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      case 'FromUniversity':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const getGenderColor = (gender?: string) => {
    if (!gender) return '';
    return gender === 'Male' 
      ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
      : 'bg-gradient-to-r from-pink-100 to-rose-200 text-pink-800 border border-pink-300';
  };

  const getBusTypeColor = (busType?: string) => {
    if (!busType) return '';
    switch (busType) {
      case 'AC Bus':
        return 'bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800 border border-purple-300';
      case 'IIUC A&H B':
        return 'bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border border-orange-300';
      case 'Non-AC Bus':
        return 'bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border border-gray-300';
      default:
        return 'bg-gradient-to-r from-indigo-100 to-blue-200 text-indigo-800 border border-indigo-300';
    }
  };

  const getRemarksColor = (remarks?: string) => {
    if (!remarks) return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
    if (remarks.toLowerCase().includes('student')) {
      return 'bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border border-green-200';
    } else if (remarks.toLowerCase().includes('teacher')) {
      return 'bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 border border-blue-200';
    } else if (remarks.toLowerCase().includes('staff') || remarks.toLowerCase().includes('officer')) {
      return 'bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-700 border border-yellow-200';
    }
    return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
  };

  const getScheduleTypeColor = (scheduleType: string) => {
    return scheduleType === 'Friday' 
      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' 
      : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white';
  };

  const formatRoute = (route: string) => {
    if (route.length > 60 && !isExpanded) {
      return route.substring(0, 60) + '...';
    }
    return route;
  };

  const formatDirection = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
        return 'City → IIUC';
      case 'IIUCToCity':
        return 'IIUC → City';
      case 'ToUniversity':
        return 'To University';
      case 'FromUniversity':
        return 'From University';
      default:
        return direction;
    }
  };

  // Calculate estimated travel time (mock calculation)
  const getEstimatedTime = () => {
    const routeLength = schedule.route.split('–').length;
    return `${Math.max(15, routeLength * 8)} min`;
  };

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1 relative">
      
      {/* Compact Header - Responsive */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-2 sm:p-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{schedule.time}</span>
              <div className="flex items-center space-x-2 sm:space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">Live</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Navigation className="h-3 w-3" />
                  <span>{getEstimatedTime()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5 sm:space-y-2">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getScheduleTypeColor(schedule.scheduleType)} shadow-sm`}>
              {schedule.scheduleType === 'Friday' ? '🕌 Friday' : '📅 Regular'}
            </span>
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getDirectionColor(schedule.direction)} shadow-sm`}>
              {formatDirection(schedule.direction)}
            </span>
          </div>
        </div>
      </div>

      {/* Compact Route Display - Responsive */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Route Summary - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-green-100 rounded-xl p-2">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate text-sm sm:text-base">{schedule.startingPoint}</p>
              <p className="text-xs sm:text-sm text-gray-500">Starting Point</p>
            </div>
          </div>
          
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mx-auto sm:mx-4 flex-shrink-0 rotate-90 sm:rotate-0" />
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-blue-100 rounded-xl p-2">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate text-sm sm:text-base">{schedule.endPoint}</p>
              <p className="text-xs sm:text-sm text-gray-500">Destination</p>
            </div>
          </div>
        </div>

        {/* Expandable Route Details - Responsive */}
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Route className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Route Details</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {isExpanded && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100 animate-fade-slide-up">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{formatRoute(schedule.route)}</p>
            </div>
          )}
        </div>

        {/* Compact Tags - Responsive */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {schedule.gender && (
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getGenderColor(schedule.gender)} shadow-sm`}>
              👤 {schedule.gender}
            </span>
          )}
          {schedule.busType && (
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getBusTypeColor(schedule.busType)} shadow-sm`}>
              🚌 {schedule.busType}
            </span>
          )}
          {(schedule.remarks || schedule.description) && (
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getRemarksColor(schedule.remarks || schedule.description)} shadow-sm`}>
              {schedule.remarks || schedule.description}
            </span>
          )}
        </div>
      </div>

      {/* Enhanced Footer - Responsive */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Bus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Live tracking</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              ✓ Active
            </span>
            <button className="p-1.5 sm:p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;