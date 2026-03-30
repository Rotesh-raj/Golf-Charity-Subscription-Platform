import React, { useState, useEffect } from 'react';
import Navbar  from '../components/Navbar';
import Loader from '../components/Loader';
import { drawsAPI } from '../api/api';
import { motion } from 'framer-motion';
import { Trophy, Award, Crown, Calendar, Users, MapPin, Star } from 'lucide-react';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    setLoading(true);
    try {
     const { data } = await drawsAPI.list();
    } catch (error) {
      console.error('Failed to fetch winners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl mb-8">
            <Crown className="w-16 h-16 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-5xl font-black text-white drop-shadow-2xl mb-2 tracking-tight">WINNERS HALL</h1>
              <p className="text-xl text-white/90 drop-shadow-lg">Celebrating our champions</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Congratulations to all our recent winners! Your luck and skill have made a difference.
          </p>
        </motion.div>

        {/* Leaderboard Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/70 text-center group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-4xl font-black text-gray-900 mb-2">{winners.length}</p>
              <p className="text-xl font-semibold text-yellow-600">Total Winners</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-emerald-200/50 text-center group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <Award className="w-24 h-24 text-emerald-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                {winners.reduce((sum, w) => sum + (w.prizeValue || 0), 0).toLocaleString()}
              </p>
              <p className="text-xl font-semibold text-emerald-100 drop-shadow-lg">$ Value Won</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-purple-200/50 text-center group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <Star className="w-24 h-24 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                {((winners.reduce((sum, w) => sum + (w.prizeRating || 5), 0) / winners.length) || 0).toFixed(1)}
              </p>
              <p className="text-xl font-semibold text-purple-100 drop-shadow-lg">Avg Prize Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.slice(0, 12).map((winner, index) => (
            <motion.div
              key={winner.id || index}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ 
                scale: 1.05, 
                y: -15,
                boxShadow: '0 25px 50px -12px rgba(0, 0,0, 0.25)'
              }}
              className="group bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 hover:border-yellow-200/50 transition-all duration-500 cursor-pointer hover:shadow-gold"
              onClick={() => setSelectedPrize(winner)}
            >
              {/* Ribbon Badge */}
              <div className="absolute -top-4 -right-4 w-32 h-32">
                <div className="relative w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full blur opacity-75" />
                  <Trophy className="absolute inset-0 w-12 h-12 text-white m-auto" />
                </div>
              </div>

              {/* Winner Image/Featured */}
              <div className="h-64 bg-gradient-to-br from-gray-100 via-yellow-50 to-orange-100 relative overflow-hidden group-hover:from-emerald-50 group-hover:to-teal-50 transition-colors duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-end p-8 text-center text-white">
                  <div className="w-28 h-28 bg-white/30 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border-4 border-white/50">
                    <Crown className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black mb-1 drop-shadow-2xl">{winner.name || `Winner #${index + 1}`}</h3>
                  <p className="text-lg font-semibold drop-shadow-lg">{winner.drawName || 'Major Championship'}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(winner.wonAt || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (winner.prizeRating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                    <Award className="w-10 h-10 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-xl">{winner.prize || 'Complete Golf Package'}</h4>
                      <p className="text-2xl font-black text-yellow-600">${(winner.prizeValue || 2500).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl">
                    <Users className="w-10 h-10 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{winner.totalCompetitors || 1247} entries</p>
                      <p className="text-sm text-emerald-700 font-medium">Your odds: 1 in {(winner.totalCompetitors / (index + 1)).toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{winner.location || 'Prestwick Golf Club'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Draw #{winner.drawNumber || index + 47}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 uppercase tracking-wide text-lg">
                  View Draw Details
                </button>
              </div>
            </motion.div>
          ))}

          {winners.length === 0 && (
            <motion.div 
              className="col-span-full text-center py-32 bg-white/60 backdrop-blur-xl rounded-4xl border-4 border-dashed border-gray-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Trophy className="w-32 h-32 text-gray-300 mx-auto mb-12" />
              <h3 className="text-4xl font-black text-gray-500 mb-6">No winners yet</h3>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Be the first champion! Check out our upcoming draws and enter now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-lg">
                  View Draws
                </button>
                <button className="px-12 py-6 border-4 border-yellow-400 hover:border-yellow-500 text-yellow-600 font-black rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:bg-yellow-50 transition-all duration-300 text-lg">
                  Enter Now
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Winners;

