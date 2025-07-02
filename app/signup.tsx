import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../lib/AuthContext';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university_id: '',
    mobile: '',
    gender: 'Male' as 'Male' | 'Female',
    role: 'student' as 'student' | 'teacher',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.university_id.trim() || 
        !formData.mobile.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error, needsConfirmation } = await signUp(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        university_id: formData.university_id,
        mobile: formData.mobile,
        gender: formData.gender,
        role: formData.role,
      });

      if (error) {
        Alert.alert('Signup Failed', error.message);
      } else if (needsConfirmation) {
        Alert.alert(
          'Check Your Email',
          'We\'ve sent a confirmation link to your email. Please click the link to activate your account.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! You can now sign in.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="items-center py-8">
            <View className="bg-blue-500 rounded-full p-4 mb-4">
              <Ionicons name="person-add" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Join IIUC Bus</Text>
            <Text className="text-gray-600 text-center">
              Create your account to access personalized features
            </Text>
          </View>

          {/* Signup Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            {/* Name */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Full Name *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                />
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Email Address *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* University ID */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">University ID *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="school-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your student/employee ID"
                  value={formData.university_id}
                  onChangeText={(text) => setFormData({...formData, university_id: text})}
                />
              </View>
            </View>

            {/* Mobile */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Mobile Number *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="call-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChangeText={(text) => setFormData({...formData, mobile: text})}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Gender & Role */}
            <View className="flex-row space-x-4 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">Gender *</Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200">
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                  </Picker>
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">Role *</Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200">
                  <Picker
                    selectedValue={formData.role}
                    onValueChange={(value) => setFormData({...formData, role: value})}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Student" value="student" />
                    <Picker.Item label="Teacher/Staff" value="teacher" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Password *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Confirm Password *</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2"
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className={`bg-blue-500 rounded-xl py-4 items-center ${loading ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-semibold">Sign in here</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}