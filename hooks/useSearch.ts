import { useState, useMemo } from 'react';
import { BusSchedule, Direction, Gender, BusType, ScheduleType, RouteFilter } from '../types/BusSchedule';

export const useSearch = (schedules: BusSchedule[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [direction, setDirection] = useState<Direction>('All');
  const [gender, setGender] = useState<Gender>('All');
  const [busType, setBusType] = useState<BusType>('All');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('All');
  const [routeFilter, setRouteFilter] = useState<RouteFilter>('All');

  // Extract unique route areas from schedules
  const routeAreas = useMemo(() => {
    const areas = new Set<string>();
    schedules.forEach(schedule => {
      const routeParts = schedule.route.split(/[–—-]/).map(part => part.trim());
      routeParts.forEach(part => {
        if (part && part !== 'IIUC' && part.length > 2) {
          const cleanPart = part
            .replace(/\s+/g, ' ')
            .replace(/\(.*?\)/g, '')
            .trim();
          if (cleanPart) {
            areas.add(cleanPart);
          }
        }
      });
      
      if (schedule.startingPoint && schedule.startingPoint !== 'IIUC') {
        areas.add(schedule.startingPoint);
      }
      if (schedule.endPoint && schedule.endPoint !== 'IIUC') {
        areas.add(schedule.endPoint);
      }
    });
    
    return Array.from(areas).sort();
  }, [schedules]);

  // Enhanced filtering logic
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        schedule.time.toLowerCase().includes(searchLower) ||
        schedule.startingPoint.toLowerCase().includes(searchLower) ||
        schedule.route.toLowerCase().includes(searchLower) ||
        schedule.endPoint.toLowerCase().includes(searchLower) ||
        (schedule.busType && schedule.busType.toLowerCase().includes(searchLower)) ||
        (schedule.remarks && schedule.remarks.toLowerCase().includes(searchLower)) ||
        (schedule.description && schedule.description.toLowerCase().includes(searchLower));

      const matchesDirection = direction === 'All' || schedule.direction === direction;
      const matchesGender = gender === 'All' || schedule.gender === gender;
      const matchesBusType = busType === 'All' || 
        (schedule.busType && schedule.busType === busType);
      const matchesScheduleType = scheduleType === 'All' || schedule.scheduleType === scheduleType;
      const matchesRoute = routeFilter === 'All' || 
        schedule.route.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.startingPoint.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.endPoint.toLowerCase().includes(routeFilter.toLowerCase());

      return matchesSearch && matchesDirection && matchesGender && matchesBusType && matchesScheduleType && matchesRoute;
    });
  }, [schedules, searchTerm, direction, gender, busType, scheduleType, routeFilter]);

  const isSearching = searchTerm !== '' || direction !== 'All' || gender !== 'All' || 
                     busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

  const resetAllFilters = () => {
    setSearchTerm('');
    setDirection('All');
    setGender('All');
    setBusType('All');
    setScheduleType('All');
    setRouteFilter('All');
  };

  return {
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
    resetAllFilters,
    totalFiltered: filteredSchedules.length,
    totalAvailable: schedules.length,
  };
};