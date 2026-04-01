import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-card rounded-3xl overflow-hidden group cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10" />
        <motion.img 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-20 glass px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
          <FiStar className="text-yellow-400 fill-yellow-400" />
          <span>{service.rating}</span>
          <span className="text-slate-400 font-normal">({service.numReviews})</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="absolute -top-6 right-6 z-20 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-pink-500/30">
          ${service.price}<span className="text-xs font-normal opacity-80">/hr</span>
        </div>
        
        <div className="text-pink-400 text-sm font-semibold mb-2 uppercase tracking-wider">{service.category}</div>
        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-pink-300 transition-colors">{service.name}</h3>
        <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
          {service.description}
        </p>
        
        <Link to={`/services/${service._id}`} className="w-full">
          <button className="w-full glass py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors border border-white/10 group-hover:border-pink-500/30">
            Book Now
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
