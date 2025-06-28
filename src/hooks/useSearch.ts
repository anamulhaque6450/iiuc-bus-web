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
      // Extract key areas from routes
      const routeParts = schedule.route.split('–').map(part => part.trim());
      routeParts.forEach(part => {
        if (part && part !== 'IIUC') {
          areas.add(part);
        }
      });
      
      // Also add starting points and end points
      if (schedule.startingPoint && schedule.startingPoint !== 'IIUC') {
        areas.add(schedule.startingPoint);
      }
      if (schedule.endPoint && schedule.endPoint !== 'IIUC') {
        areas.add(schedule.endPoint);
      }
    });
    
    return Array.from(areas).sort();
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesSearch = searchTerm === '' || 
        schedule.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.startingPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.endPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (schedule.busType && schedule.busType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.remarks && schedule.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.description && schedule.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDirection = direction === 'All' || schedule.direction === direction;
      const matchesGender = gender === 'All' || schedule.gender === gender;
      const matchesBusType = busType === 'All' || schedule.busType === busType;
      const matchesScheduleType = scheduleType === 'All' || schedule.scheduleType === scheduleType;
      
      const matchesRoute = routeFilter === 'All' || 
        schedule.route.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.startingPoint.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.endPoint.toLowerCase().includes(routeFilter.toLowerCase());

      return matchesSearch && matchesDirection && matchesGender && matchesBusType && matchesScheduleType && matchesRoute;
    });
  }, [schedules, searchTerm, direction, gender, busType, scheduleType, routeFilter]);

  const isSearching = searchTerm !== '' || direction !== 'All' || gender !== 'All' || busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

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
  };
};