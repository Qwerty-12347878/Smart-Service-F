import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-10 rounded-3xl shadow-2xl"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About SmartServe</h1>
                <p className="text-slate-300 text-lg mb-6">
                    SmartServe is a service marketplace for modern households that want confidence, speed, and clear communication.
                    Customers can browse verified categories, reserve preferred time slots, and complete checkout with digital or pay-on-arrival options that fit their routine.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Verified Pros', value: '250+' },
                        { label: 'Cities Served', value: '18' },
                        { label: 'Payment Options', value: '4' },
                        { label: 'Avg. Response', value: '< 15 min' },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
                            <p className="text-3xl font-bold text-white">{item.value}</p>
                            <p className="text-sm text-slate-400 mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="glass-card p-5 rounded-2xl border border-slate-700">
                        <h3 className="text-xl text-white font-semibold mb-2">Our Mission</h3>
                        <p className="text-slate-300 text-sm">
                            Deliver dependable home support without the friction of endless calling, uncertain quotes, or unclear arrival windows.
                        </p>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border border-slate-700">
                        <h3 className="text-xl text-white font-semibold mb-2">What We Offer</h3>
                        <p className="text-slate-300 text-sm">
                            Deep cleaning, electrical work, plumbing, appliance help, gardening, and recurring maintenance packages in one booking experience.
                        </p>
                    </div>
                    <div className="glass-card p-5 rounded-2xl border border-slate-700">
                        <h3 className="text-xl text-white font-semibold mb-2">Why Choose Us</h3>
                        <p className="text-slate-300 text-sm">
                            Transparent starting prices, flexible payments, professional matching, and support visibility for customers, pros, and admins.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
