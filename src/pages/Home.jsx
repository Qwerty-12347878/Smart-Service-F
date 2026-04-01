import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiZap, FiShield, FiStar, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const Home = () => {
  const [trendingServices, setTrendingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('/api/recommendations');
        setTrendingServices(data.recommendations || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center z-10"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-200">AI-Powered Home Services</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          Book expert services <br className="hidden md:block"/>
          <span className="text-gradient">in seconds.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12"
        >
          From plumbing to deep cleaning, SmartServe helps you compare trusted professionals, reserve a timeslot quickly, and check out with card, UPI, wallet, or cash on service.
        </motion.p>

        {/* Search Bar Area */}
        <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto group">
          <div className="glass-card flex items-center p-2 rounded-2xl md:rounded-full shadow-2xl transition-all group-hover:shadow-pink-500/10 group-hover:border-pink-500/30">
            <div className="pl-6 text-slate-400 flex-shrink-0">
              <FiSearch size={24} />
            </div>
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-slate-100 placeholder:text-slate-500 text-lg"
            />
            <Link to="/services" className="hidden md:block bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium px-8 py-4 rounded-full hover:scale-[1.02] transition-transform flex-shrink-0">
              Find Pro
            </Link>
          </div>
          <Link to="/services" className="md:hidden mt-4 block w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium px-8 py-4 rounded-2xl">
            Find Pro
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 mt-16 text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FiZap size={20} />
            </div>
            <span className="font-medium">Instant Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              <FiShield size={20} />
            </div>
            <span className="font-medium">Verified Pros</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <FiStar size={20} />
            </div>
            <span className="font-medium">Top Rated</span>
          </div>
        </motion.div>

      </motion.div>

      {/* Trending Services Section */}
      <div className="w-full max-w-7xl mx-auto mt-32 z-10">
        <div className="flex justify-between items-end mb-12 px-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Trending Services</h2>
            <p className="text-slate-400">Popular picks powered by our recommendation engine and current booking demand.</p>
          </div>
          <Link to="/services" className="hidden sm:flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium group transition-colors">
            View all <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-48">
              <div className="w-12 h-12 rounded-full border-t-2 border-pink-500 animate-spin"></div>
            </div>
          ) : trendingServices.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
        
        <Link to="/services" className="sm:hidden w-full mt-8 flex justify-center items-center gap-2 text-pink-400 font-medium py-3 border border-pink-500/30 rounded-xl">
          View all services <FiArrowRight />
        </Link>
      </div>

    </div>
  );
};

export default Home;
