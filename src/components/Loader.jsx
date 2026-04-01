import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]"
    >
      {/* Abstract background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/20 rounded-full blur-[80px]" />
      
      <motion.div
        animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 180, 360],
            borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-pink-500 shadow-2xl shadow-pink-500/50 flex items-center justify-center mb-8 relative z-10"
      >
        <span className="text-3xl font-extrabold text-white">S</span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl font-bold text-white tracking-widest mb-2">
          Smart<span className="text-pink-400">Serve</span>
        </h2>
        
        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto mt-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
