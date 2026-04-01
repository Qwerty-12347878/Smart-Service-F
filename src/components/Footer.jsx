import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="w-full glass mt-20 pt-16 pb-8 border-t border-slate-700/50 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Smart<span className="text-pink-400">Serve</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Book trusted home services with clear pricing, flexible payment options, and end-to-end booking visibility for customers, professionals, and admins.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors">
                <FiFacebook />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Browse Services</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Join SmartServe</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Customer Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">House Cleaning</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Electrical</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Plumbing</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Landscaping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Trust & Safety</Link></li>
              <li><Link to="/profile" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Account Privacy</Link></li>
              <li><Link to="/forgot-password" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">Password Help</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} SmartServe. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Built with React & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
