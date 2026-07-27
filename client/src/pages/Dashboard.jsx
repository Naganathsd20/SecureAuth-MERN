import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Alert from '../components/Alert';
import { 
  ShieldCheck, 
  User, 
  Key, 
  CheckCircle2, 
  Clock, 
  Server, 
  Database, 
  Cpu, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [testingApi, setTestingApi] = useState(false);

  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTestProtectedEndpoint = async () => {
    setTestingApi(true);
    try {
      const res = await API.get('/auth/me');
      setApiResponse({
        type: 'success',
        message: `Protected API returned 200 OK! Verified identity for ID: ${res.data.user._id}`
      });
    } catch (err) {
      setApiResponse({
        type: 'error',
        message: err.response?.data?.message || 'Protected route verification failed'
      });
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-indigo-400/50 shadow-xl object-cover bg-slate-800"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated Session
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Role: {user?.role || 'user'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {user?.name}!
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                {user?.bio || 'Manage your account, test JWT auth endpoints, and view system metrics.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Link
              to="/profile"
              className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700 flex items-center justify-center space-x-2"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: JWT Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">JWT Token</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 flex items-center space-x-2">
            <span>Verified</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-500 truncate">
            Token: Bearer {token ? `${token.substring(0, 15)}...` : 'None'}
          </p>
        </div>

        {/* Card 2: Password Hashing */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">bcryptjs</div>
          <p className="text-xs text-slate-500">Salt Rounds: 10 (Encrypted)</p>
        </div>

        {/* Card 3: Database */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Database</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">MongoDB</div>
          <p className="text-xs text-slate-500">Mongoose ODM Active</p>
        </div>

        {/* Card 4: Member Since */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member Since</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {formatJoinedDate(user?.createdAt)}
          </div>
          <p className="text-xs text-slate-500">Email: {user?.email}</p>
        </div>
      </div>

      {/* Interactive Verification Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>Protected Route Middleware Tester</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Click below to send a Bearer Token authenticated request to backend endpoint <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">GET /api/auth/me</code>
            </p>
          </div>

          <button
            onClick={handleTestProtectedEndpoint}
            disabled={testingApi}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testingApi ? 'animate-spin' : ''}`} />
            <span>{testingApi ? 'Verifying...' : 'Test Auth API'}</span>
          </button>
        </div>

        {apiResponse && (
          <Alert
            type={apiResponse.type}
            message={apiResponse.message}
            onClose={() => setApiResponse(null)}
          />
        )}

        {/* MERN Architecture Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-indigo-400 font-semibold text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>React + Vite Frontend</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast HMR development with React Context for global auth state, React Router v6 protected routes, and Tailwind CSS styling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-semibold text-sm flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>Node + Express Server</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              RESTful architecture with JWT token authentication middleware, express-validator body checks, and centralized error handling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-semibold text-sm flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>MongoDB + Mongoose</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schema definition with bcryptjs password hashing pre-save hooks, sanitized JSON outputs, and duplicate email prevention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
