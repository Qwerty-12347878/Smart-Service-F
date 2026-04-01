import React, { useEffect, useState, useContext, useCallback } from 'react';
import { FiUsers, FiDollarSign, FiActivity, FiBriefcase, FiTrendingUp, FiShield, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, showToast } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, workers: 0, bookings: 0, revenue: 0, services: 0 });
  const [services, setServices] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [workersError, setWorkersError] = useState('');
  const [serviceForm, setServiceForm] = useState({ name: '', category: '', description: '', image: '', price: '' });
  const [editServiceId, setEditServiceId] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [serviceError, setServiceError] = useState('');

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const { data } = await axios.get('/api/services');
      setServices(data);
    } catch (err) {
      setServiceError(err.response?.data?.message || err.message);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchAdminStats = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/users/stats', { withCredentials: true });
      setStats(data);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  }, [showToast]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await axios.get('/api/users/all', { withCredentials: true });
      setAllUsers(data);
    } catch (err) {
      setUsersError(err.response?.data?.message || err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchWorkers = async () => {
    setWorkersLoading(true);
    try {
      const { data } = await axios.get('/api/workers/all', { withCredentials: true });
      setAllWorkers(data);
    } catch (err) {
      setWorkersError(err.response?.data?.message || err.message);
    } finally {
      setWorkersLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    fetchServices();
    fetchAdminStats();
    fetchUsers();
    fetchWorkers();
  }, [user, navigate, fetchAdminStats]);

  const resetForm = () => {
    setEditServiceId(null);
    setServiceForm({ name: '', category: '', description: '', image: '', price: '' });
    setServiceError('');
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceError('');

    if (!serviceForm.name || !serviceForm.category || !serviceForm.description || !serviceForm.image || !serviceForm.price) {
      setServiceError('All fields are required (except rating).');
      return;
    }

    (isNaN(Number(serviceForm.price)) || Number(serviceForm.price) < 0) && setServiceError('Price must be a valid number.');
    if (serviceError) return;

    setSavingService(true);
    try {
      if (editServiceId) {
        const { data } = await axios.put(`/api/services/${editServiceId}`, {
          ...serviceForm,
          price: Number(serviceForm.price),
        }, { withCredentials: true });
        setServices((prev) => prev.map((svc) => (svc._id === editServiceId ? data : svc)));
        showToast('Service updated successfully', 'success');
      } else {
        const { data } = await axios.post('/api/services', {
          ...serviceForm,
          price: Number(serviceForm.price),
        }, { withCredentials: true });
        setServices((prev) => [data, ...prev]);
        showToast('Service created successfully', 'success');
      }
      resetForm();
    } catch (err) {
      setServiceError(err.response?.data?.message || err.message);
    } finally {
      setSavingService(false);
    }
  };

  const handleEdit = (service) => {
    setEditServiceId(service._id);
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description,
      image: service.image,
      price: service.price,
    });
    setServiceError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`, { withCredentials: true });
      setServices((prev) => prev.filter((svc) => svc._id !== id));
      showToast('Service deleted', 'success');
    } catch (err) {
      setServiceError(err.response?.data?.message || err.message);
    }
  };


  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Admin Control Center</h1>
        <p className="text-slate-400">Monitor service supply, booking performance, payment volume, and platform health from a single control surface.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Users</h3>
            <FiUsers className="text-indigo-400" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.users}</p>
          <p className="text-xs text-slate-400 mt-1">Active within 30 days</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Professionals</h3>
            <FiBriefcase className="text-violet-400" />
          </div>
          <p className="text-4xl font-bold text-white">{allWorkers.length}</p>
          <p className="text-xs text-slate-400 mt-1">Registered skilled workers</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Bookings</h3>
            <FiActivity className="text-green-400" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.bookings}</p>
          <p className="text-xs text-slate-400 mt-1">Total processed orders</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Revenue</h3>
            <FiDollarSign className="text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Total revenue</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Services Live</h3>
            <FiBriefcase className="text-cyan-400" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.services}</p>
          <p className="text-xs text-slate-400 mt-1">Service packages online</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-600/40 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Service Management</h3>
          <span className="text-slate-400 text-sm">Add or edit service products</span>
        </div>

        {serviceError && <p className="text-red-400 mb-3 bg-red-500/10 p-2 rounded">{serviceError}</p>}

        <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="name"
            placeholder="Service Name"
            value={serviceForm.name}
            onChange={handleServiceChange}
            className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white"
          />
          <input
            name="category"
            placeholder="Category"
            value={serviceForm.category}
            onChange={handleServiceChange}
            className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={serviceForm.image}
            onChange={handleServiceChange}
            className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white md:col-span-2"
          />
          <input
            name="price"
            placeholder="Price"
            value={serviceForm.price}
            onChange={handleServiceChange}
            className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white"
            type="number"
            min="0"
            step="0.01"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={serviceForm.description}
            onChange={handleServiceChange}
            className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white md:col-span-2"
            rows="3"
          />
          <button
            type="submit"
            disabled={savingService}
            className="md:col-span-2 bg-linear-to-r from-indigo-500 to-pink-500 text-white font-semibold py-2 rounded-xl hover:from-indigo-600 hover:to-pink-600 transition"
          >
            <span className="inline-flex items-center gap-1">
              <FiPlus />
              {editServiceId ? 'Update Service' : 'Create Service'}
            </span>
          </button>
          {editServiceId && (
            <button
              type="button"
              onClick={resetForm}
              className="md:col-span-2 bg-slate-700 text-white py-2 rounded-xl hover:bg-slate-600 transition"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 rounded-xl border border-slate-700">
            <thead>
              <tr className="text-left text-slate-300 text-sm border-b border-slate-700">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingServices ? (
                <tr><td colSpan="4" className="text-center p-4 text-slate-400">Loading services...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-4 text-slate-400">No services found.</td></tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc._id} className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="px-3 py-2 text-white">{svc.name}</td>
                    <td className="px-3 py-2 text-slate-300">{svc.category}</td>
                    <td className="px-3 py-2 text-slate-300">${svc.price}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(svc)}
                        className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(svc._id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-600/40 mb-8">
        <h3 className="text-xl font-bold text-white mb-3">Recent Users</h3>

        {usersLoading ? (
          <p className="text-slate-400">Loading users...</p>
        ) : usersError ? (
          <p className="text-red-400">{usersError}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-200">
              <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {allUsers
                  .filter((usr) => !usr.isAdmin)
                  .slice(0, 6)
                  .map((usr) => (
                    <tr key={usr._id} className="border-b border-slate-700 hover:bg-slate-800">
                      <td className="px-3 py-2">{usr.name}</td>
                      <td className="px-3 py-2">{usr.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {allUsers.filter((usr) => !usr.isAdmin).length === 0 && (
              <p className="text-slate-400 mt-2">No non-admin users found.</p>
            )}
          </div>
        )}
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-600/40 mb-8">
        <h3 className="text-xl font-bold text-white mb-3">Professional Directory</h3>

        {workersLoading ? (
          <p className="text-slate-400">Loading professionals...</p>
        ) : workersError ? (
          <p className="text-red-400">{workersError}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-200">
              <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Experience</th>
                  <th className="px-3 py-2">Base Price</th>
                </tr>
              </thead>
              <tbody>
                {allWorkers.map((worker) => (
                  <tr key={worker._id} className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="px-3 py-2">{worker.name}</td>
                    <td className="px-3 py-2">{worker.email}</td>
                    <td className="px-3 py-2">{worker.category}</td>
                    <td className="px-3 py-2">{worker.experience} yrs</td>
                    <td className="px-3 py-2">${worker.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allWorkers.length === 0 && <p className="text-slate-400 mt-2">No professionals registered.</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-600/40">
          <h3 className="text-xl font-bold text-white mb-3">Top Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
              <span className="text-slate-300">Cleaning demand</span>
              <span className="text-green-300 font-semibold">+48%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
              <span className="text-slate-300">Smart home installs</span>
              <span className="text-green-300 font-semibold">+32%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
              <span className="text-slate-300">New workers</span>
              <span className="text-pink-300 font-semibold">+12%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-600/40 lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', icon: <FiUsers />, action: () => window.scrollTo({ top: 1100, behavior: 'smooth' }) },
              { label: 'Review Requests', icon: <FiShield />, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { label: 'Analytics', icon: <FiTrendingUp />, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { label: 'Service Catalog', icon: <FiBriefcase />, action: () => navigate('/services') },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className="w-full flex items-center gap-2 justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminDashboard;
