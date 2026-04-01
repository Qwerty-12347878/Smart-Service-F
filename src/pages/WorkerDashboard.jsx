import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiBriefcase, FiBell, FiClock, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const WorkerDashboard = () => {
  const { showToast, lastNotification } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');

  const fetchWorkerRequests = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/workers/requests');
      setRequests(data.requests || []);
      setAcceptedJobs(data.acceptedJobs || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load worker requests.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchWorkerRequests();
  }, [fetchWorkerRequests]);

  useEffect(() => {
    if (!lastNotification) {
      return;
    }

    if (['booking_request', 'booking_accepted', 'booking_update'].includes(lastNotification.type)) {
      fetchWorkerRequests();
    }
  }, [fetchWorkerRequests, lastNotification]);

  const handleRequestAction = async (notificationId, action) => {
    try {
      setActionLoadingId(notificationId);
      const { data } = await axios.put(`/api/workers/requests/${notificationId}/${action}`);
      showToast(data.message || `Request ${action}ed successfully`, 'success');
      await fetchWorkerRequests();
    } catch (error) {
      showToast(error.response?.data?.message || `Unable to ${action} this request right now.`, 'error');
    } finally {
      setActionLoadingId('');
    }
  };

  const stats = useMemo(() => {
    const monthlyEarnings = acceptedJobs.reduce((sum, job) => sum + (job.totalPrice || 0), 0);

    return {
      pendingRequests: requests.length,
      activeJobs: acceptedJobs.filter((job) => job.status === 'Accepted').length,
      monthlyEarnings,
      responseRate: requests.length === 0 ? '100%' : 'Live',
    };
  }, [acceptedJobs, requests]);

  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Worker Portal</h1>
          <p className="text-slate-400">Accept incoming service requests and keep customers updated in real time.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-slate-200 font-medium">Live request feed active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Pending Requests</h3>
          <p className="text-3xl font-bold text-white">{stats.pendingRequests}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Accepted Jobs</h3>
          <p className="text-3xl font-bold text-white">{stats.activeJobs}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Booked Value</h3>
          <p className="text-3xl font-bold text-emerald-400">${stats.monthlyEarnings}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-slate-400 font-medium mb-1">Response Status</h3>
          <p className="text-3xl font-bold text-white">{stats.responseRate}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiBell className="text-pink-500" /> New Job Requests
      </h2>

      <div className="glass-card rounded-3xl p-5 mb-8 border border-slate-700/70">
        <p className="text-slate-300">
          When a customer applies for a service, matching workers receive a live request here. Accepting it immediately updates the customer dashboard and sends a real notification on the client side.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 rounded-full border-t-2 border-pink-500 animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-400">
          No pending requests right now. New matching service applications will appear here automatically.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {requests.map(({ notificationId, booking, createdAt }) => (
            <motion.div
              key={notificationId}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-xl font-bold text-slate-100">{booking.service?.name || 'Service Request'}</h3>
                  <span className="font-bold text-xl text-green-400">${booking.totalPrice}</span>
                </div>
                <p className="text-slate-400 text-sm mb-1"><span className="text-slate-300">Client:</span> {booking.user?.name || 'Customer'}</p>
                <p className="text-slate-400 text-sm mb-1"><span className="text-slate-300">Email:</span> {booking.user?.email || 'Not provided'}</p>
                <p className="text-slate-400 text-sm mb-1"><span className="text-slate-300">Phone:</span> {booking.user?.phone || 'Not provided'}</p>
                <p className="text-slate-400 text-sm mb-1"><span className="text-slate-300">Address:</span> {booking.user?.address || 'Customer will confirm address'}</p>
                <p className="text-slate-400 text-sm mb-1"><span className="text-slate-300">Service Date:</span> {new Date(booking.date).toLocaleString()}</p>
                <p className="text-slate-400 text-sm mb-6"><span className="text-slate-300">Applied:</span> {new Date(createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={actionLoadingId === notificationId}
                  onClick={() => handleRequestAction(notificationId, 'accept')}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FiCheck /> {actionLoadingId === notificationId ? 'Saving...' : 'Accept'}
                </button>
                <button
                  type="button"
                  disabled={actionLoadingId === notificationId}
                  onClick={() => handleRequestAction(notificationId, 'reject')}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FiX /> Decline
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiBriefcase className="text-indigo-400" /> Accepted Jobs
      </h2>

      {acceptedJobs.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-400">
          Accepted jobs will show here after you approve a request.
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedJobs.map((job) => (
            <div key={job._id} className="glass-card p-5 rounded-2xl flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                  <FiClock size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{job.service?.name || 'Accepted service'}</h3>
                  <p className="text-slate-400 text-sm">{job.user?.name || 'Customer'} | {new Date(job.date).toLocaleString()}</p>
                  <p className="text-slate-500 text-sm">Payment: {job.paymentMethod} | Status: {job.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-emerald-400 font-bold">
                <FiDollarSign />
                <span>${job.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
