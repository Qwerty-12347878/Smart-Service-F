import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, showToast } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      try {
        const { data } = await axios.post('/api/users/login', { email, password });
        const userData = { ...data, role: 'user', isAdmin: data.isAdmin || false };
        login(userData);
        showToast('Logged in successfully', 'success');

        if (userData.isAdmin) {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/user');
        }
        return;
      } catch (userErr) {
        const message = userErr.response?.data?.message || '';
        if (message !== 'Invalid email or password' && message !== 'User not found') {
          throw userErr;
        }
      }

      const { data } = await axios.post('/api/workers/login', { email, password });
      const workerData = { ...data, role: 'worker', isAdmin: false };
      login(workerData);
      showToast('Logged in successfully', 'success');
      navigate('/dashboard/worker');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-20 px-4 z-10 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col md:flex-row glass-card rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative z-20">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to manage bookings, receipts, saved addresses, and upcoming service visits.</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            {error && <div className="p-3 bg-red-500/20 text-red-400 font-medium rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account? <Link to="/register" className="text-pink-400 font-semibold hover:text-pink-300">Sign Up</Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-linear-to-r from-bg-dark/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2670&auto=format&fit=crop"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-12 left-12 z-20 max-w-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Smart Home Services</h3>
            <p className="text-slate-300 text-sm">Pick a service, choose how you want to pay, and keep every booking update in one clean dashboard.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
