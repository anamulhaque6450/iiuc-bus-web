import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusSchedule } from '../types/BusSchedule';

interface BusCardProps {
  schedule: BusSchedule;
}

export default function BusCard({ schedule }: BusCardProps) {
  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
        return 'bg-emerald-100 text-emerald-800';
      case 'IIUCToCity':
        return 'bg-blue-100 text-blue-800';
      case 'ToUniversity':
        return 'bg-purple-100 text-purple-800';
      case 'FromUniversity':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3">
          <View className="bg-blue-500 rounded-xl p-2">
            <Ionicons name="time" size={20} color="white" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">{schedule.time}</Text>
            <View className="flex-row items-center space-x-2 mt-1">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
              <Text className="text-xs text-gray-600 font-medium">Live</Text>
            </View>
          </View>
        </View>
        
        <View className="space-y-1">
          <View className={`px-3 py-1 rounded-full ${
            schedule.scheduleType === 'Friday' ? 'bg-red-100' : 'bg-indigo-100'
          }`}>
            <Text className={`text-xs font-bold ${
              schedule.scheduleType === 'Friday' ? 'text-red-800' : 'text-indigo-800'
            }`}>
              {schedule.scheduleType === 'Friday' ? '🕌 Friday' : '📅 Regular'}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getDirectionColor(schedule.direction)}`}>
            <Text className="text-xs font-bold">
              {formatDirection(schedule.direction)}
            </Text>
          </View>
        </View>
      </View>

      {/* Route */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3 flex-1">
          <View className="bg-green-100 rounded-xl p-2">
            <Ionicons name="location" size={16} color="#059669" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900 text-sm">{schedule.startingPoint}</Text>
            <Text className="text-xs text-gray-500">Starting Point</Text>
          </View>
        </View>
        
        <Ionicons name="arrow-forward" size={20} color="#6b7280" className="mx-4" />
        
        <View className="flex-row items-center space-x-3 flex-1">
          <View className="bg-blue-100 rounded-xl p-2">
            <Ionicons name="location" size={16} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900 text-sm">{schedule.endPoint}</Text>
            <Text className="text-xs text-gray-500">Destination</Text>
          </View>
        </View>
      </View>

      {/* Route Details */}
      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <Text className="text-gray-700 text-sm leading-relaxed">{schedule.route}</Text>
      </View>

      {/* Tags */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {schedule.gender && (
          <View className={`px-3 py-1 rounded-full ${
            schedule.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            <Text className={`text-xs font-semibold ${
              schedule.gender === 'Male' ? 'text-blue-700' : 'text-pink-700'
            }`}>
              👤 {schedule.gender}
            </Text>
          </View>
        )}
        {schedule.busType && (
          <View className="px-3 py-1 rounded-full bg-purple-100">
            <Text className="text-xs font-semibold text-purple-700">
              🚌 {schedule.busType}
            </Text>
          </View>
        )}
        {(schedule.remarks || schedule.description) && (
          <View className="px-3 py-1 rounded-full bg-gray-100">
            <Text className="text-xs font-semibold text-gray-700">
              {schedule.remarks || schedule.description}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="flex-row items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
            <Ionicons name="bus" size={16} color="#6b7280" />
            <Text className="text-xs text-gray-600">Live tracking</Text>
          </TouchableOpacity>
        </div>
        
        <View className="flex-row items-center space-x-2">
          <View className="bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-xs text-green-700 font-medium">✓ Active</Text>
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-blue-50">
            <Ionicons name="navigate" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}