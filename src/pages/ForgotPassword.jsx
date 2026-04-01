import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { showToast } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post('/api/users/forgot-password', { email });
            showToast(data.message || 'Reset link sent', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center pt-20 px-4 z-10 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl"
            >
                <h2 className="text-2xl font-extrabold text-white mb-4">Forgot Password</h2>
                <p className="text-slate-400 mb-6">Enter the email linked to your SmartServe account and we will generate a reset link for secure access recovery.</p>

                {error && <p className="mb-4 text-red-400 bg-red-500/10 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-pink-500 transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="mt-5 text-sm text-slate-400">
                    Remembered password? <Link to="/login" className="text-pink-400 hover:text-pink-300">Back to login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
