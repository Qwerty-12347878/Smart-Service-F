import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clickedAction, setClickedAction] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const { user, logout, toast } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const showBubble = (action) => {
    setClickedAction(action);
    setBubbleVisible(true);
    setTimeout(() => setBubbleVisible(false), 1600);
  };
  const isLoginActive = location.pathname === '/login';
  const isRegisterActive = location.pathname === '/register';

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed right-4 top-20 z-50 bg-slate-900/90 border border-pink-500/40 text-white px-4 py-3 rounded-xl shadow-2xl"
          >
            <p className="text-sm font-semibold">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {bubbleVisible && clickedAction && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-16 z-50 bg-white text-slate-900 px-4 py-2 rounded-full shadow-xl border border-slate-200 font-semibold text-xs"
            >
              {clickedAction === 'login' ? 'Login' : 'Register'} selected
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Smart<span className="text-pink-400">Serve</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Services</Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</Link>
            {user && user.role === 'worker' && (
              <Link to="/dashboard/worker" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Worker Panel</Link>
            )}
            {user && user.isAdmin && (
              <Link to="/dashboard/admin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Admin Panel</Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button type="button" onClick={() => setProfileOpen((prev) => !prev)} className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px] shadow-lg shadow-pink-500/20 cursor-pointer"
                  >
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold uppercase overflow-hidden ring-2 ring-slate-900">
                      {user.name ? user.name.charAt(0) : <FiUser size={18} />}
                    </div>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-52 bg-slate-900/95 border border-slate-700 rounded-2xl p-2 shadow-2xl"
                    >
                      <Link
                        to={user.isAdmin ? '/dashboard/admin' : user.role === 'worker' ? '/dashboard/worker' : '/dashboard/user'}
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-slate-100 hover:bg-white/10 transition-colors"
                      >
                        {user.isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-slate-100 hover:bg-white/10 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left mt-1 px-3 py-2 rounded-xl text-pink-400 hover:bg-pink-500/15 transition-colors"
                      >
                        <FiLogOut className="inline mr-2" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => showBubble('login')}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${isLoginActive ? 'bg-white text-slate-900 shadow-lg' : 'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white'}`}
                >
                  <motion.span
                    animate={isLoginActive || clickedAction === 'login' ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    Log in
                  </motion.span>
                </Link>
                <Link to="/register" onClick={() => showBubble('register')}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isRegisterActive || clickedAction === 'register' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${isRegisterActive ? 'bg-white text-slate-900 shadow-lg' : 'bg-transparent text-slate-300 hover:bg-white hover:text-black'}`}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t mt-3 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white">Home</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white">Services</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white">How it Works</Link>
              <hr className="border-slate-700/50" />
              {user ? (
                <>
                  <div className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px] shadow-lg shadow-pink-500/20">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold uppercase text-lg">
                        {user.name ? user.name.charAt(0) : <FiUser size={20} />}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize">{user.name}</p>
                      <p className="text-xs text-slate-400 opacity-80">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={user.role === 'worker' ? '/dashboard/worker' : '/dashboard/user'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-300 hover:text-white py-2"
                  >
                    Dashboard
                  </Link>
                  <motion.button
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-500 font-semibold border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors mt-2"
                  >
                    <FiLogOut />
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white">Log in</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
