import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { User, Mail, Lock, FileText, Save, CheckCircle2, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (alert) setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio
    };

    if (formData.password.trim()) {
      payload.password = formData.password;
    }

    const result = await updateProfile(payload);
    setLoading(false);

    if (result.success) {
      setAlert({ type: 'success', message: result.message || 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      setAlert({ type: 'error', message: result.message || 'Failed to update profile' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <User className="w-8 h-8 text-indigo-400" />
          <span>Account Settings & Profile</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Update your personal details, email address, bio, or security password
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <div className="glass-panel p-6 rounded-3xl space-y-6 h-fit text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
              alt={user?.name}
              className="w-28 h-28 rounded-full border-4 border-indigo-500/40 shadow-2xl object-cover bg-slate-800 mx-auto"
            />
            <div className="absolute bottom-1 right-1 p-1.5 bg-indigo-600 rounded-full border-2 border-slate-900 text-white">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Account Type</span>
              <span className="font-semibold text-indigo-400 uppercase">{user?.role || 'user'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Security Standard</span>
              <span className="font-semibold text-emerald-400">JWT Token Auth</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Password Encryption</span>
              <span className="font-semibold text-purple-400">bcryptjs Salted</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Developer Bio
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm resize-none"
                  placeholder="Share a short bio..."
                />
              </div>
            </div>

            {/* New Password (Optional) */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Change Password (Optional)
              </label>
              <p className="text-xs text-slate-500 mb-3">Leave blank if you do not want to change your current password</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password (min 6 characters)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
