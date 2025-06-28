import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Database, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

const AuthTest: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = [];

    try {
      // Test 1: Database Connection
      results.push({ name: 'Database Connection', status: 'testing' });
      setTestResults([...results]);

      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        results[0] = { name: 'Database Connection', status: 'failed', error: error.message };
      } else {
        results[0] = { name: 'Database Connection', status: 'passed' };
      }
      setTestResults([...results]);

      // Test 2: Auth State
      results.push({ 
        name: 'Authentication State', 
        status: user ? 'passed' : 'info',
        message: user ? `Logged in as: ${user.email}` : 'Not logged in'
      });
      setTestResults([...results]);

      // Test 3: User Profile
      results.push({ 
        name: 'User Profile', 
        status: userProfile ? 'passed' : 'info',
        message: userProfile ? `Profile loaded: ${userProfile.name}` : 'No profile loaded'
      });
      setTestResults([...results]);

      // Test 4: RLS Policies
      if (user) {
        results.push({ name: 'RLS Policies', status: 'testing' });
        setTestResults([...results]);

        try {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id);

          if (profileError) {
            results[results.length - 1] = { 
              name: 'RLS Policies', 
              status: 'failed', 
              error: profileError.message 
            };
          } else {
            results[results.length - 1] = { 
              name: 'RLS Policies', 
              status: 'passed',
              message: 'Can access own profile'
            };
          }
        } catch (error: any) {
          results[results.length - 1] = { 
            name: 'RLS Policies', 
            status: 'failed', 
            error: error.message 
          };
        }
        setTestResults([...results]);
      }

      // Test 5: Bus Schedules Access
      results.push({ name: 'Bus Schedules Access', status: 'testing' });
      setTestResults([...results]);

      try {
        const { data: schedules, error: schedulesError } = await supabase
          .from('bus_schedules')
          .select('*')
          .limit(5);

        if (schedulesError) {
          results[results.length - 1] = { 
            name: 'Bus Schedules Access', 
            status: 'failed', 
            error: schedulesError.message 
          };
        } else {
          results[results.length - 1] = { 
            name: 'Bus Schedules Access', 
            status: 'passed',
            message: `Found ${schedules?.length || 0} schedules`
          };
        }
      } catch (error: any) {
        results[results.length - 1] = { 
          name: 'Bus Schedules Access', 
          status: 'failed', 
          error: error.message 
        };
      }
      setTestResults([...results]);

      // Test 6: Environment Variables
      results.push({ 
        name: 'Environment Variables', 
        status: (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) ? 'passed' : 'failed',
        message: `URL: ${import.meta.env.VITE_SUPABASE_URL ? '✓' : '✗'}, Key: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓' : '✗'}`
      });
      setTestResults([...results]);

    } catch (error: any) {
      results.push({ 
        name: 'General Error', 
        status: 'failed', 
        error: error.message 
      });
      setTestResults([...results]);
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'info':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'testing':
        return 'bg-blue-50 border-blue-200';
      case 'info':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Database & Auth Test</h2>
          </div>
          <p className="text-gray-600 mt-1">Testing Supabase connection and authentication</p>
        </div>

        <div className="p-6">
          {/* Current Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Auth User:</span>
                <span className="ml-2 font-medium">
                  {user ? user.email : 'Not logged in'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Profile:</span>
                <span className="ml-2 font-medium">
                  {userProfile ? userProfile.name : 'No profile'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium">
                  {userProfile ? userProfile.role : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">University ID:</span>
                <span className="ml-2 font-medium">
                  {userProfile ? userProfile.university_id : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={testing}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {testing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5" />
                  <span>Run Database Tests</span>
                </>
              )}
            </button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Test Results</h3>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      {result.message && (
                        <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      )}
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1 font-mono bg-red-100 p-2 rounded">
                          {result.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• If not logged in, try creating an account via signup</li>
              <li>• Check your email for verification link after signup</li>
              <li>• Test login with your credentials</li>
              <li>• All tests should pass for full functionality</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
          >
            Close & Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;