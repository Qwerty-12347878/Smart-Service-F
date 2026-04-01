import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, login, showToast } = useContext(AuthContext);
    const isWorker = user?.role === 'worker';
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            }));
        }
    }, [user]);

    const getUserProfile = async () => {
        try {
            const endpoint = isWorker ? '/api/workers/profile' : '/api/users/profile';
            const { data } = await axios.get(endpoint, { withCredentials: true });
            setForm((prev) => ({
                ...prev,
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
            }));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, [isWorker]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (form.password && form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put(
                isWorker ? '/api/workers/profile' : '/api/users/profile',
                {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                },
                { withCredentials: true }
            );

            login({ ...user, ...data });
            showToast('Profile updated successfully', 'success');
            setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 rounded-3xl shadow-2xl"
            >
                <h1 className="text-3xl font-extrabold text-white mb-2">Your Profile</h1>
                <p className="text-slate-400 mb-6">Keep your contact details accurate so arrival updates, support follow-ups, and booking confirmations reach the right place.</p>

                {error && <p className="text-red-400 bg-red-500/10 px-3 py-2 mb-4 rounded">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                        <p className="text-sm text-slate-400">Account Type</p>
                        <p className="text-lg font-semibold text-white">{user?.isAdmin ? 'Admin' : user?.role === 'worker' ? 'Professional' : 'Customer'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                        <p className="text-sm text-slate-400">Preferred Contact</p>
                        <p className="text-lg font-semibold text-white">{form.phone || 'Add phone number'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                        <p className="text-sm text-slate-400">Service Address</p>
                        <p className="text-lg font-semibold text-white">{form.address || 'Add primary address'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Phone</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                autoComplete="street-address"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">New Password</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all"
                    >
                        {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
