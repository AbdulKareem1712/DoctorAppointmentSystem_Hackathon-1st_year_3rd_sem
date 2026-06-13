import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, HeartPulse, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);
      addToast(`Welcome back, ${data.name}!`, 'success');
      
      // Navigate based on role
      if (data.role === 'ADMIN') navigate('/admin/dashboard');
      else if (data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (data.role === 'PATIENT') navigate('/patient/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };
// Abdul kareem 2500030144
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        {/* Mobile branding */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-4 text-slate-800">
          <HeartPulse className="w-8 h-8 text-sky-500 animate-pulse" />
          <span className="font-bold text-2xl">CareFlow</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h1>
        <p className="text-sm text-slate-400">Enter your hospital email credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Hospital Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              placeholder="name@hospital.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-sky-500 to-primary-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-sky-500/10 focus:outline-none active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
          Create Patient Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
