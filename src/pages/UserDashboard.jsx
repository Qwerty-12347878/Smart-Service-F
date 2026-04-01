import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiSettings, FiCreditCard, FiBell } from 'react-icons/fi';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const UserDashboard = () => {
  const {
    notifications,
    notificationsLoading,
    lastNotification,
    markNotificationAsRead,
  } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/bookings/mybookings');
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your bookings right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!lastNotification) {
      return;
    }

    if (['booking_created', 'booking_accepted', 'booking_update'].includes(lastNotification.type)) {
      fetchBookings();
    }
  }, [fetchBookings, lastNotification]);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => new Date(booking.date) > new Date()).length;
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    const paidCount = bookings.filter((booking) => booking.isPaid).length;
    const acceptedCount = bookings.filter((booking) => booking.status === 'Accepted').length;

    return {
      total: bookings.length,
      upcoming,
      totalSpent,
      paidCount,
      acceptedCount,
    };
  }, [bookings]);

  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">My Dashboard</h1>
          <p className="text-slate-400 mt-2">Track your applied services, worker acceptance, and payment history in one place.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors">
          <FiSettings /> Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Total Requests</h3>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Upcoming Services</h3>
          <p className="text-4xl font-bold text-pink-400">{stats.upcoming}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Accepted By Worker</h3>
          <p className="text-4xl font-bold text-emerald-400">{stats.acceptedCount}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Total Spent</h3>
          <p className="text-4xl font-bold text-indigo-400">${stats.totalSpent}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-8">
        <div>
          <div className="glass-card p-5 rounded-3xl mb-8 border border-slate-700/70">
            <div className="flex items-center gap-3 text-slate-300">
              <FiCreditCard className="text-pink-400" />
              <p>
                {stats.paidCount} booking{stats.paidCount === 1 ? '' : 's'} already paid online. When a worker accepts your request, the update appears here immediately.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-12 h-12 rounded-full border-t-2 border-pink-500 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-500/10 px-4 py-4 text-red-300">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center text-slate-400">
              No bookings yet. Once you apply for a service, the worker response will show here.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const serviceName = booking.service?.name || 'Service booking';
                const bookingDate = new Date(booking.date);
                const paymentLabel = booking.paymentMethod === 'cash'
                  ? 'Cash on Service'
                  : booking.paymentMethod?.toUpperCase();
                const assignedWorker = booking.worker?.name || 'Waiting for worker acceptance';

                return (
                  <motion.div
                    key={booking._id}
                    whileHover={{ scale: 1.01 }}
                    className="glass-card p-5 rounded-2xl flex flex-col lg:flex-row justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${booking.status === 'Completed' ? 'bg-green-500/20 text-green-400' : booking.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {booking.status === 'Completed' || booking.status === 'Accepted' ? <FiCheckCircle size={24} /> : <FiClock size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-100">{serviceName}</h4>
                        <p className="text-slate-400 text-sm">
                          {bookingDate.toLocaleDateString()} at {bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-slate-500 text-sm">Worker: {assignedWorker}</p>
                        <p className="text-slate-500 text-sm">
                          Payment: {paymentLabel} - Status: {booking.paymentStatus}
                        </p>
                        {booking.transactionId && (
                          <p className="text-slate-500 text-xs mt-1">Reference: {booking.transactionId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                      <span className="font-bold text-xl">${booking.totalPrice}</span>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${booking.status === 'Completed' ? 'bg-green-500/20 text-green-400' : booking.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiBell className="text-pink-400" /> Live Notifications
          </h2>

          <div className="glass-card rounded-3xl p-5 border border-slate-700/70">
            {notificationsLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 rounded-full border-t-2 border-pink-500 animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-slate-400">Your live updates will appear here when a worker responds.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => {
                      if (!notification.isRead) {
                        markNotificationAsRead(notification._id);
                      }
                    }}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${notification.isRead ? 'border-white/10 bg-white/5' : 'border-pink-500/30 bg-pink-500/10'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                        <p className="mt-2 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                      {!notification.isRead && (
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-400 flex-shrink-0"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
