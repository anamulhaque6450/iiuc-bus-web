import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  totalFiltered?: number;
  totalAvailable?: number;
  onResetFilters?: () => void;
}

export default function SearchFilters({
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
  totalFiltered = 0,
  totalAvailable = 0,
  onResetFilters,
}: SearchFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const hasActiveFilters = searchTerm !== '' || direction !== 'All' || gender !== 'All' || 
                          busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

  const quickSearches = [
    { label: '7:00 AM', color: 'blue' },
    { label: 'BOT', color: 'emerald' },
    { label: 'Agrabad', color: 'teal' },
    { label: 'Friday', color: 'orange' },
    { label: 'Female', color: 'pink' },
    { label: 'AC Bus', color: 'indigo' }
  ];

  return (
    <View className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center space-x-3">
          <View className="bg-blue-500 rounded-xl p-2">
            <Ionicons name="search" size={20} color="white" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900">Smart Search</Text>
            <Text className="text-gray-600 text-sm">
              {hasActiveFilters ? `${totalFiltered} of ${totalAvailable} schedules` : 'Find your perfect bus schedule'}
            </Text>
          </View>
        </View>
        
        {hasActiveFilters && onResetFilters && (
          <TouchableOpacity
            onPress={onResetFilters}
            className="bg-red-50 rounded-lg px-3 py-2 border border-red-200"
          >
            <Text className="text-red-600 font-semibold text-sm">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Input */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Search by time, area, or route</Text>
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="e.g., 7:00 AM, BOT, Agrabad..."
            value={searchTerm}
            onChangeText={onSearchChange}
          />
          {searchTerm && (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Search */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Quick Search</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {quickSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSearchChange(item.label)}
                className={`px-4 py-2 rounded-xl border ${
                  item.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                  item.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' :
                  item.color === 'teal' ? 'bg-teal-50 border-teal-200' :
                  item.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                  item.color === 'pink' ? 'bg-pink-50 border-pink-200' :
                  'bg-indigo-50 border-indigo-200'
                }`}
              >
                <Text className={`font-medium text-sm ${
                  item.color === 'blue' ? 'text-blue-700' :
                  item.color === 'emerald' ? 'text-emerald-700' :
                  item.color === 'teal' ? 'text-teal-700' :
                  item.color === 'orange' ? 'text-orange-700' :
                  item.color === 'pink' ? 'text-pink-700' :
                  'text-indigo-700'
                }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Advanced Filters Toggle */}
      <TouchableOpacity
        onPress={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="flex-row items-center justify-between bg-gray-50 rounded-xl p-3 mb-4"
      >
        <View className="flex-row items-center space-x-2">
          <Ionicons name="options" size={20} color="#6b7280" />
          <Text className="font-semibold text-gray-700">Advanced Filters</Text>
        </View>
        <Ionicons 
          name={isAdvancedOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <View className="space-y-4">
          {/* Route Filter */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Route/Area</Text>
            <View className="bg-gray-50 rounded-xl border border-gray-200">
              <Picker
                selectedValue={routeFilter}
                onValueChange={(value) => onRouteFilterChange(value)}
                style={{ height: 50 }}
              >
                <Picker.Item label={`All Areas (${routeAreas.length} available)`} value="All" />
                {routeAreas.map((area) => (
                  <Picker.Item key={area} label={area} value={area} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Schedule Type */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Schedule Type</Text>
            <View className="bg-gray-50 rounded-xl border border-gray-200">
              <Picker
                selectedValue={scheduleType}
                onValueChange={(value) => onScheduleTypeChange(value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="All Schedules" value="All" />
                <Picker.Item label="Regular (Sat-Wed)" value="Regular" />
                <Picker.Item label="Friday Only" value="Friday" />
              </Picker>
            </View>
          </View>

          {/* Direction */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Direction</Text>
            <View className="bg-gray-50 rounded-xl border border-gray-200">
              <Picker
                selectedValue={direction}
                onValueChange={(value) => onDirectionChange(value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="All Directions" value="All" />
                <Picker.Item label="City → IIUC" value="CityToIIUC" />
                <Picker.Item label="IIUC → City" value="IIUCToCity" />
                <Picker.Item label="To University" value="ToUniversity" />
                <Picker.Item label="From University" value="FromUniversity" />
              </Picker>
            </View>
          </View>

          {/* Gender */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Gender</Text>
            <View className="bg-gray-50 rounded-xl border border-gray-200">
              <Picker
                selectedValue={gender}
                onValueChange={(value) => onGenderChange(value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>

          {/* Bus Type */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Bus Type</Text>
            <View className={`bg-gray-50 rounded-xl border border-gray-200 ${
              scheduleType !== 'Friday' ? 'opacity-50' : ''
            }`}>
              <Picker
                selectedValue={busType}
                onValueChange={(value) => onBusTypeChange(value)}
                enabled={scheduleType === 'Friday'}
                style={{ height: 50 }}
              >
                <Picker.Item label="All Bus Types" value="All" />
                <Picker.Item label="IIUC Bus" value="IIUC Bus" />
                <Picker.Item label="IIUC A&H B" value="IIUC A&H B" />
                <Picker.Item label="AC Bus" value="AC Bus" />
                <Picker.Item label="Non-AC Bus" value="Non-AC Bus" />
              </Picker>
            </View>
            {scheduleType !== 'Friday' && (
              <Text className="text-yellow-600 text-xs mt-1">
                Bus type filtering is only available for Friday schedules
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}