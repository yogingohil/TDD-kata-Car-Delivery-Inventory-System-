import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuthStore } from '../store/authStore.js';
import { useUIStore } from '../store/uiStore.js';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  // Dynamic Password Validation Rules Checkers
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      addToast('Password must fulfill all security requirements shown below.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({ name, email, password, role });
      setAuth(response.data.user, response.data.accessToken);
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Check password requirements.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-400">
            Join Apex Motors Inventory Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Vance"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter strong password..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            {/* Dynamic Password Requirement Status Pills */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">Password Requirements:</span>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    hasMinLength
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  {hasMinLength ? '✓ 8+ Chars' : '○ 8+ Chars'}
                </span>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    hasUpper
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  {hasUpper ? '✓ 1 Uppercase (A-Z)' : '○ 1 Uppercase'}
                </span>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    hasLower
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  {hasLower ? '✓ 1 Lowercase (a-z)' : '○ 1 Lowercase'}
                </span>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    hasNumber
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  {hasNumber ? '✓ 1 Number (0-9)' : '○ 1 Number'}
                </span>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                    hasSpecial
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                  }`}
                >
                  {hasSpecial ? '✓ 1 Special (!@#$)' : '○ 1 Special (!@#$)'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="USER">Customer (User)</option>
              <option value="ADMIN">Administrator (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
