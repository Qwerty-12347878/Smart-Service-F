import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiClock,
  FiShield,
  FiCheckCircle,
  FiCreditCard,
  FiSmartphone,
  FiBriefcase,
  FiDollarSign,
} from 'react-icons/fi';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const paymentOptions = [
  {
    id: 'card',
    label: 'Credit or Debit Card',
    helper: 'Instant confirmation with a secure payment receipt.',
    icon: FiCreditCard,
    referenceLabel: 'card ending in 4242',
  },
  {
    id: 'upi',
    label: 'UPI',
    helper: 'Fast mobile checkout for customers who prefer UPI.',
    icon: FiSmartphone,
    referenceLabel: 'smartserve@upi',
  },
  {
    id: 'wallet',
    label: 'Digital Wallet',
    helper: 'Pay with your saved wallet balance in one tap.',
    icon: FiBriefcase,
    referenceLabel: 'Smart Wallet',
  },
  {
    id: 'cash',
    label: 'Cash on Service',
    helper: 'Reserve now and pay when the professional arrives.',
    icon: FiDollarSign,
    referenceLabel: 'cash on arrival',
  },
];

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/api/services/${id}`);
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBooking = async () => {
    setBookingError('');

    if (!user) {
      showToast('Please log in to book a service', 'error');
      navigate('/login');
      return;
    }

    if (!date || !time) {
      setBookingError('Please select both a date and a time before confirming your booking.');
      return;
    }

    const selectedOption = paymentOptions.find((option) => option.id === paymentMethod);

    try {
      setSubmitting(true);
      const { data } = await axios.post('/api/bookings', {
        serviceId: service._id,
        date,
        time,
        paymentMethod,
        paymentDetails: {
          referenceLabel: selectedOption?.referenceLabel,
        },
      });

      showToast(data.message || 'Service request submitted', 'success');
      navigate('/dashboard/user');
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Unable to confirm your booking right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-28 pb-20 flex justify-center items-center">
        <div className="w-16 h-16 rounded-full border-t-2 border-pink-500 animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full min-h-screen pt-28 pb-20 flex flex-col justify-center items-center text-slate-300">
        <h2 className="text-3xl font-bold mb-4">Service not found</h2>
        <Link to="/services" className="text-pink-400 hover:text-pink-300">Return to Services</Link>
      </div>
    );
  }

  const selectedPaymentOption = paymentOptions.find((option) => option.id === paymentMethod);

  return (
    <div className="w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-80 rounded-3xl overflow-hidden relative mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent z-10" />
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />

        <div className="absolute bottom-10 left-10 z-20">
          <div className="text-pink-400 font-semibold tracking-wider uppercase mb-2">
            {service.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{service.name}</h1>
          <div className="flex items-center gap-4 text-slate-300 flex-wrap">
            <span className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-yellow-400" /> {service.rating} ({service.numReviews} Reviews)
            </span>
            <span className="flex items-center gap-1"><FiClock /> Same week scheduling available</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-4">About the Service</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            {service.description} Each booking includes service confirmation, arrival coordination, and a clear payment summary so customers know exactly what to expect before the professional shows up.
          </p>

          <h3 className="text-xl font-bold mb-4">What's Included</h3>
          <ul className="space-y-3 mb-8">
            {[
              'Complete inspection and assessment before work begins',
              'Specialized tools, materials, and safety equipment included',
              'Verified professional assigned based on category and availability',
              'Digital receipt, payment reference, and support follow-up after booking',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="glass-card p-6 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-400">
                <FiShield size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">SmartServe Guarantee</h4>
                <p className="text-slate-400 text-sm">Protected bookings, transparent pricing, and support if something needs follow-up.</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-96 flex-shrink-0"
        >
          <div className="glass-card p-6 border-t-4 border-t-pink-500 rounded-3xl sticky top-32 shadow-2xl">
            <h3 className="text-2xl font-bold mb-1">Book Service</h3>
              <p className="text-slate-400 mb-6 text-sm">Select your schedule and payment option, then send the request to available workers.</p>

            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-extrabold text-white">${service.price}</span>
              <span className="text-slate-400 mb-1">starting price</span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Select Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Payment Method</label>
                <div className="space-y-3">
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          paymentMethod === option.id
                            ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-xl bg-white/10 p-2 text-pink-300">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{option.label}</p>
                            <p className="text-sm text-slate-400">{option.helper}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Booking summary</p>
              <p className="mt-2">Service: {service.name}</p>
              <p>Date: {date || 'Select a date'}</p>
              <p>Time: {time || 'Select a time'}</p>
              <p>Payment: {selectedPaymentOption?.label}</p>
            </div>

            {bookingError && (
              <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{bookingError}</p>
            )}

            <button
              type="button"
              onClick={handleBooking}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Sending Request...' : 'Apply For Service'}
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">
              Card, UPI, and wallet are marked paid instantly. Cash stays reserved as pay-on-arrival.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetails;
