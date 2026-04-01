import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const workerCategories = ['Cleaning', 'Electrical', 'Plumbing', 'Gardening', 'Appliance', 'Painting'];

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [workerCategory, setWorkerCategory] = useState(workerCategories[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const endpoint = role === 'worker' ? '/api/workers' : '/api/users';
      const payload = role === 'worker'
        ? { name, email, password, category: workerCategory, experience: 1, basePrice: 25 }
        : { name, email, password };

      await axios.post(endpoint, payload);
      showToast('Registered successfully! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-24 pb-12 px-4 z-10 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col md:flex-row-reverse glass-card rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative z-20">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-slate-400">Create your customer or professional account and start using the full SmartServe platform.</p>
          </div>

          <div className="flex p-1 bg-slate-800/50 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'user' ? 'bg-linear-to-r from-indigo-500 to-pink-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              I need a service
            </button>
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'worker' ? 'bg-linear-to-r from-indigo-500 to-pink-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              I am a Professional
            </button>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {error && <div className="p-3 bg-red-500/20 text-red-400 font-medium rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            {role === 'worker' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Professional Category</label>
                <select
                  value={workerCategory}
                  onChange={(e) => setWorkerCategory(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition-colors"
                >
                  {workerCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-pink-400 font-semibold hover:text-pink-300">Sign In</Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-linear-to-l from-bg-dark/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2670&auto=format&fit=crop"
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-12 right-12 z-20 max-w-sm text-right">
            <h3 className="text-2xl font-bold text-white mb-2">Exclusive Benefits</h3>
            <p className="text-slate-300 text-sm">Customers get faster booking and flexible payments. Professionals get visibility, steady job flow, and a cleaner schedule.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
