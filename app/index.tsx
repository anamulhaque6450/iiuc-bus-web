import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/AuthContext';
import { busSchedules } from '../data/busSchedules';
import { useSearch } from '../hooks/useSearch';
import BusCard from '../components/BusCard';
import SearchFilters from '../components/SearchFilters';

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
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
    resetAllFilters,
    totalFiltered,
    totalAvailable,
  } = useSearch(busSchedules);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-8 pb-16">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center space-x-3">
              <View className="bg-white/20 rounded-full p-2">
                <Image 
                  source={require('../assets/iiuc-logo.png')} 
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text className="text-white text-xl font-bold">IIUC Bus Finder</Text>
                <Text className="text-blue-100 text-sm">Smart Transport Solution</Text>
              </View>
            </View>
            
            <View className="flex-row space-x-2">
              {user && userProfile ? (
                <Link href="/dashboard" asChild>
                  <TouchableOpacity className="bg-white/20 rounded-full p-2">
                    <Ionicons name="person" size={24} color="white" />
                  </TouchableOpacity>
                </Link>
              ) : (
                <>
                  <Link href="/login" asChild>
                    <TouchableOpacity className="bg-white/20 rounded-full px-4 py-2">
                      <Text className="text-white font-semibold">Login</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/signup" asChild>
                    <TouchableOpacity className="bg-white rounded-full px-4 py-2">
                      <Text className="text-blue-600 font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                  </Link>
                </>
              )}
            </View>
          </View>

          {/* Welcome Message */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-bold mb-2">
              {user ? `Welcome back, ${userProfile?.name}!` : 'Find Your Bus Schedule'}
            </Text>
            <Text className="text-blue-100">
              Search through 50+ daily schedules with smart filtering
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between">
            <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2">
              <Text className="text-white text-lg font-bold">{totalAvailable}</Text>
              <Text className="text-blue-100 text-xs">Total Schedules</Text>
            </View>
            <View className="bg-white/10 rounded-xl p-3 flex-1 mx-1">
              <Text className="text-white text-lg font-bold">15+</Text>
              <Text className="text-blue-100 text-xs">Routes</Text>
            </View>
            <View className="bg-white/10 rounded-xl p-3 flex-1 ml-2">
              <Text className="text-white text-lg font-bold">24/7</Text>
              <Text className="text-blue-100 text-xs">Support</Text>
            </View>
          </View>
        </View>

        {/* Search Section */}
        <View className="px-4 -mt-8 mb-6">
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
            totalFiltered={totalFiltered}
            totalAvailable={totalAvailable}
            onResetFilters={resetAllFilters}
          />
        </View>

        {/* Results Section */}
        <View className="px-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              {isSearching ? 'Search Results' : 'Bus Schedules'}
            </Text>
            <Text className="text-gray-600">
              {filteredSchedules.length} schedules
            </Text>
          </View>

          {filteredSchedules.length > 0 ? (
            <View className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <BusCard key={schedule.id} schedule={schedule} />
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="bus-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-600 text-lg font-semibold mt-4 mb-2">
                No schedules found
              </Text>
              <Text className="text-gray-500 text-center">
                Try adjusting your search criteria or filters
              </Text>
              <TouchableOpacity 
                onPress={resetAllFilters}
                className="bg-blue-500 rounded-xl px-6 py-3 mt-4"
              >
                <Text className="text-white font-semibold">Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}