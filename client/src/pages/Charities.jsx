import React, { useState, useEffect } from 'react';
import  Navbar  from '../components/Navbar';
import Loader from '../components/Loader';
import { charitiesAPI } from '../api/api';
import { motion } from 'framer-motion';
import { Heart, MapPin, Users, DollarSign, Star, Building2, Award } from 'lucide-react';
import { userAPI } from "../api/api";
const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const { data } = await charitiesAPI.list();
      setCharities(data);
    } catch (error) {
      console.error('Failed to fetch charities:', error);
    } finally {
      setLoading(false);
    }
  };

// ✅ ADD HERE (OUTSIDE function)
const selectCharity = async (id) => {
  try {
    await userAPI.selectCharity(id);
    alert("Charity selected successfully");
  } catch (err) {
    console.error("Charity error:", err);
  }
};

  const filteredCharities = charities.filter(charity =>
    charity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charity.mission?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-rose-50 to-purple-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Supported Charities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every subscription helps these amazing golf charities make a difference in communities
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search charities by name or mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 pl-14 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl"
            />
            <Heart className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center group hover:shadow-3xl transition-all duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">${charities.reduce((sum, c) => sum + (c.totalRaised || 0), 0).toLocaleString()}</p>
              <p className="text-emerald-600 font-semibold">Total Raised</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center group hover:shadow-3xl transition-all duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{charities.reduce((sum, c) => sum + (c.supporters || 0), 0)}</p>
              <p className="text-rose-600 font-semibold">Supporters</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center group hover:shadow-3xl transition-all duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{charities.length}</p>
              <p className="text-purple-600 font-semibold">Charities</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center group hover:shadow-3xl transition-all duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {((charities.reduce((sum, c) => sum + (c.rating || 0), 0) / charities.length) || 0).toFixed(1)}
              </p>
              <p className="text-blue-600 font-semibold">Avg Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCharities.map((charity, index) => (
            <motion.div
              key={charity.id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Header */}
              <div className="h-64 bg-gradient-to-br from-gray-200 via-blue-100 to-emerald-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-6 right-6">
                  <div className="flex bg-white/90 px-4 py-2 rounded-full gap-1 backdrop-blur-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (charity.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg group-hover:text-emerald-100 transition-colors">
                    {charity.name || `Golf Charity #${index + 1}`}
                  </h3>
                  <p className="text-white/90 text-lg drop-shadow-md mt-1">
                    {charity.mission || 'Supporting golf communities through scholarships and programs'}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                    <DollarSign className="w-12 h-12 text-emerald-600 mb-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${(charity.totalRaised || 12500).toLocaleString()}</p>
                      <p className="text-sm text-emerald-700 font-medium">Raised</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                    <Users className="w-12 h-12 text-blue-600 mb-2" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{charity.supporters || 247}</p>
                      <p className="text-sm text-blue-700 font-medium">Supporters</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
  onClick={() => selectCharity(charity.id)}
  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-6 rounded-2xl"
>
  Select Charity
</button>
                  <button className="px-6 py-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-2xl transition-all duration-200 hover:bg-gray-50">
                    Learn More
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{charity.location || 'Nationwide'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Building2 className="w-4 h-4" />
                    <span>Est. {charity.founded || 2005}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredCharities.length === 0 && (
            <motion.div 
              className="col-span-full text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Heart className="w-32 h-32 text-gray-300 mx-auto mb-8 opacity-50" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">No charities found</h3>
              <p className="text-xl text-gray-500 mb-8">Try adjusting your search</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Show All
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Charities;

