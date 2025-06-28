import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, BusScheduleDB, Feedback } from '../lib/supabase';
import { Bus, User, MessageSquare, Send, Clock, MapPin, Route, Calendar, LogOut, Loader2, Star, Navigation } from 'lucide-react';
import BusCard from '../components/BusCard';
import { BusSchedule } from '../types/BusSchedule';

const StudentDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [userProfile]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      // Fetch schedules based on student's gender
      let query = supabase.from('bus_schedules').select('*');
      
      // Filter by gender - show schedules for student's gender or general schedules
      if (userProfile?.gender) {
        query = query.or(`gender.eq.${userProfile.gender},gender.is.null`);
      }
      
      const { data, error } = await query.order('time', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error);
      } else {
        // Convert database format to component format
        const convertedSchedules: BusSchedule[] = data.map(schedule => ({
          id: schedule.id,
          time: schedule.time,
          startingPoint: schedule.starting_point,
          route: schedule.route,
          endPoint: schedule.end_point,
          direction: schedule.direction as any,
          gender: schedule.gender as any,
          busType: schedule.bus_type,
          remarks: schedule.remarks,
          description: schedule.description,
          scheduleType: schedule.schedule_type as any,
        }));
        
        setSchedules(convertedSchedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !userProfile) return;

    setSubmittingFeedback(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: userProfile.id,
            message: feedback.trim(),
          },
        ]);

      if (error) {
        console.error('Error submitting feedback:', error);
      } else {
        setFeedback('');
        setFeedbackSuccess(true);
        setTimeout(() => setFeedbackSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get morning schedules for quick stats
  const morningSchedules = schedules.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 6 && hour <= 9;
  });

  const fridaySchedules = schedules.filter(s => s.scheduleType === 'Friday');
  const returnSchedules = schedules.filter(s => 
    s.direction === 'IIUCToCity' || s.direction === 'FromUniversity'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/iiuc.png" alt="IIUC" className="h-10 w-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                  <p className="text-sm text-gray-600">IIUC Bus Schedule System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{userProfile?.name}</p>
                <p className="text-sm text-gray-600">{userProfile?.university_id}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Welcome, {userProfile?.name}!</h2>
                  <p className="text-blue-100">
                    {userProfile?.gender} Student • {userProfile?.university_id}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Bus className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{schedules.length}</div>
                  <div className="text-xs text-blue-100">Available Buses</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{morningSchedules.length}</div>
                  <div className="text-xs text-blue-100">Morning Routes</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{fridaySchedules.length}</div>
                  <div className="text-xs text-blue-100">Friday Special</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Navigation className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{returnSchedules.length}</div>
                  <div className="text-xs text-blue-100">Return Routes</div>
                </div>
              </div>
            </div>

            {/* Bus Schedules */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <Bus className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Your Bus Schedules ({userProfile?.gender})
                </h3>
              </div>
              
              {schedules.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {schedules.map((schedule) => (
                    <BusCard key={schedule.id} schedule={schedule} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No schedules available</h4>
                  <p className="text-gray-500">Bus schedules for {userProfile?.gender} students will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Profile Information</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{userProfile?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">University ID</label>
                  <p className="text-gray-900">{userProfile?.university_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{userProfile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-gray-900">{userProfile?.mobile}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{userProfile?.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 capitalize">{userProfile?.role}</p>
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Send Feedback</h3>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about the bus service, suggest improvements, or report issues..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none"
                  rows={4}
                  required
                />
                
                {feedbackSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm">
                    ✓ Feedback submitted successfully! Thank you for your input.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={submittingFeedback || !feedback.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submittingFeedback ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <Clock className="h-4 w-4" />
                  <span>View Today's Schedule</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>Friday Special</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors">
                  <Navigation className="h-4 w-4" />
                  <span>Track My Bus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;