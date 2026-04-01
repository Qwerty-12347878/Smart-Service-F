import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiSliders } from 'react-icons/fi';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import AuthContext from '../context/AuthContext';

const categories = ['All', 'Cleaning', 'Electrical', 'Plumbing', 'Gardening', 'Appliance', 'Painting'];

const Services = () => {
  const { user } = useContext(AuthContext);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services');
        setAllServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const isAdmin = user?.isAdmin;

  const filteredServices = allServices.filter(service => {
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 z-10 relative">

      {/* Sidebar Filter */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-64 flex-shrink-0"
      >
        <div className="glass-card p-6 rounded-3xl sticky top-32">
          <div className="flex items-center gap-2 mb-6 text-xl font-bold">
            <FiSliders className="text-pink-500" /> Filters
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-left px-4 py-2 rounded-xl transition-all ${activeCategory === category
                    ? 'bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-pink-400 font-medium border border-pink-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Price Range</h3>
            <input type="range" min="10" max="200" className="w-full accent-pink-500" />
            <div className="flex justify-between text-sm text-slate-400 mt-2">
              <span>$10</span>
              <span>$200+</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-grow">
        {!isAdmin && (
          <div className="mb-4 p-4 rounded-2xl glass-card border border-slate-700 text-slate-300">
            <p className="text-sm">
              You are viewing public service listings. Admins can add and manage services from the dashboard.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button className="px-5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              Add Service (Admin)
            </button>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8 p-2 rounded-2xl flex items-center shadow-lg"
        >
          <div className="pl-4 text-slate-400">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for any service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-100 placeholder:text-slate-500 text-lg"
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-t-2 border-pink-500 animate-spin"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No services found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Services;
