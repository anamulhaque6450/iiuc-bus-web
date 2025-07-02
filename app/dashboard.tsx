import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/AuthContext';
import { busSchedules } from '../data/busSchedules';

export default function DashboardPage() {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedules' | 'profile'>('overview');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          }
        }
      ]
    );
  };

  const userSchedules = busSchedules.filter(schedule => 
    !schedule.gender || schedule.gender === userProfile?.gender
  );

  const morningSchedules = userSchedules.filter(schedule => {
    const hour = parseInt(schedule.time.split(':')[0]);
    return hour >= 6 && hour <= 10;
  });

  const fridaySchedules = userSchedules.filter(schedule => 
    schedule.scheduleType === 'Friday'
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-bold">
              Welcome, {userProfile?.name}!
            </Text>
            <Text className="text-blue-100">
              {userProfile?.university_id} • {userProfile?.role}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mt-6">
          <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2">
            <Text className="text-white text-lg font-bold">{userSchedules.length}</Text>
            <Text className="text-blue-100 text-xs">Available Schedules</Text>
          </View>
          <View className="bg-white/10 rounded-xl p-3 flex-1 mx-1">
            <Text className="text-white text-lg font-bold">{morningSchedules.length}</Text>
            <Text className="text-blue-100 text-xs">Morning Routes</Text>
          </View>
          <View className="bg-white/10 rounded-xl p-3 flex-1 ml-2">
            <Text className="text-white text-lg font-bold">{fridaySchedules.length}</Text>
            <Text className="text-blue-100 text-xs">Friday Special</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row">
          {[
            { id: 'overview', label: 'Overview', icon: 'home-outline' },
            { id: 'schedules', label: 'My Schedules', icon: 'bus-outline' },
            { id: 'profile', label: 'Profile', icon: 'person-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex-row items-center justify-center py-4 ${
                activeTab === tab.id ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={20} 
                color={activeTab === tab.id ? '#3b82f6' : '#6b7280'} 
              />
              <Text className={`ml-2 font-semibold ${
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-600'
              }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <View className="space-y-6">
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Text>
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={() => router.push('/')}
                  className="bg-blue-50 rounded-xl p-4 flex-row items-center"
                >
                  <Ionicons name="search" size={24} color="#3b82f6" />
                  <Text className="ml-3 font-semibold text-blue-600">Search Schedules</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-green-50 rounded-xl p-4 flex-row items-center">
                  <Ionicons name="chatbubble-outline" size={24} color="#22c55e" />
                  <Text className="ml-3 font-semibold text-green-600">Submit Feedback</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="bg-purple-50 rounded-xl p-4 flex-row items-center">
                  <Ionicons name="notifications-outline" size={24} color="#8b5cf6" />
                  <Text className="ml-3 font-semibold text-purple-600">Notifications</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-xl font-bold text-gray-900 mb-4">Today's Highlights</Text>
              <View className="space-y-3">
                {morningSchedules.slice(0, 3).map((schedule) => (
                  <View key={schedule.id} className="bg-gray-50 rounded-xl p-4">
                    <Text className="font-semibold text-gray-900">{schedule.time}</Text>
                    <Text className="text-gray-600 text-sm">{schedule.startingPoint} → {schedule.endPoint}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <View className="space-y-4">
            <Text className="text-xl font-bold text-gray-900">Your Schedules</Text>
            {userSchedules.map((schedule) => (
              <View key={schedule.id} className="bg-white rounded-2xl p-4 shadow-lg">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-bold text-gray-900">{schedule.time}</Text>
                  <View className={`px-3 py-1 rounded-full ${
                    schedule.scheduleType === 'Friday' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      schedule.scheduleType === 'Friday' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {schedule.scheduleType}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-600 mb-2">
                  {schedule.startingPoint} → {schedule.endPoint}
                </Text>
                <Text className="text-gray-500 text-sm">{schedule.route}</Text>
                {schedule.gender && (
                  <View className="mt-2">
                    <View className={`px-2 py-1 rounded-full self-start ${
                      schedule.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        schedule.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'
                      }`}>
                        {schedule.gender} Only
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View className="space-y-6">
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-xl font-bold text-gray-900 mb-4">Profile Information</Text>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-600 text-sm">Full Name</Text>
                  <Text className="text-gray-900 font-semibold">{userProfile?.name}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Email</Text>
                  <Text className="text-gray-900 font-semibold">{userProfile?.email}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">University ID</Text>
                  <Text className="text-gray-900 font-semibold">{userProfile?.university_id}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Mobile</Text>
                  <Text className="text-gray-900 font-semibold">{userProfile?.mobile}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Gender</Text>
                  <Text className="text-gray-900 font-semibold">{userProfile?.gender}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Role</Text>
                  <Text className="text-gray-900 font-semibold capitalize">{userProfile?.role}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 rounded-2xl p-4 items-center"
            >
              <Text className="text-white font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}