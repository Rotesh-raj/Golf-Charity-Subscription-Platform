import React, { useState, useEffect } from 'react';

import Loader from '../components/Loader';
import { useSubscription } from '../context/SubscriptionContext';
import { drawsAPI } from '../api/api';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, Ticket, Clock, Star } from 'lucide-react';

const Draws = () => {
  const { subscription } = useSubscription();
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    setLoading(true);
    try {
      const { data } = await drawsAPI.list();
      setDraws(data);
    } catch (error) {
      console.error('Failed to fetch draws:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingDraws = draws.filter(draw => new Date(draw.date) > new Date());
  const pastDraws = draws.filter(draw => new Date(draw.date) <= new Date());

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50">
      
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Golf Draws
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter exciting golf draws and win amazing prizes while supporting charities
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-1 shadow-xl border border-white/50 flex gap-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Upcoming ({upcomingDraws.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Past ({pastDraws.length})
            </button>
          </div>
        </div>

        {/* Draws Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'upcoming' ? upcomingDraws : pastDraws
            .slice(0, 9)
            .map((draw, index) => (
              <motion.div
                key={draw.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 overflow-hidden"
              >
                {/* Badge */}
                <div className="mb-6">
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                    draw.status === 'live' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : draw.status === 'closing' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {draw.status?.toUpperCase() || 'UPCOMING'}
                  </span>
                </div>

                {/* Draw Image/Featured */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-6 flex items-center justify-center group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-500">
                  <Trophy className="w-24 h-24 text-gray-400 group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {draw.title || `Charity Golf Draw #${index + 1}`}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(draw.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {draw.location || 'Local Course'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">{draw.entries || 0}</span>
                      <span className="text-sm text-emerald-700">entries</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                      <Ticket className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">{draw.prize || 'Golf Set'}</span>
                    </div>
                  </div>

                  {/* Entry Button */}
                  <button
                    disabled={!subscription}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                      subscription
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 active:scale-95'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed'
                    } flex items-center justify-center gap-3`}
                  >
                    <Star className="w-6 h-6" />
                    {subscription ? 'Enter Draw' : 'Subscribe to Enter'}
                  </button>

                  {!subscription && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Requires Premium subscription
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

          { (activeTab === 'upcoming' ? upcomingDraws : pastDraws).length === 0 && (
            <motion.div 
              className="col-span-full text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {activeTab === 'upcoming' ? 'No upcoming draws' : 'No past draws yet'}
              </h3>
              <p className="text-lg text-gray-500">
                Check back soon for exciting new opportunities!
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Draws;

