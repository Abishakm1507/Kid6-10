import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Dashboard: React.FC = () => {
  const { 
    favoriteColor, 
    name, 
    streak, 
    xp, 
    badges, 
    challenges
  } = useUserStore();
  
  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="pb-16">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">
          {name}'s Dashboard
        </h1>
        <p className="text-gray-600">Track your learning progress</p>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-orange-100 mr-3">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Streak</h3>
              <p className="text-sm text-gray-500">Days in a row</p>
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: favoriteColor }}>
            {streak}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">XP</h3>
              <p className="text-sm text-gray-500">Experience Points</p>
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: favoriteColor }}>
            {xp}
          </p>
        </motion.div>
      </div>
      
      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Badges
          </h2>
          <span className="text-sm font-medium py-1 px-2 bg-gray-100 rounded-full">
            {earnedBadges.length}/{badges.length}
          </span>
        </div>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-4 rounded-lg ${
                  badge.earned 
                    ? 'bg-[var(--primary)] bg-opacity-10 border-[var(--primary)] border' 
                    : 'bg-gray-100 border-gray-200 border'
                }`}
                style={
                  badge.earned 
                    ? { borderColor: favoriteColor, backgroundColor: `${favoriteColor}20` } 
                    : {}
                }
              >
                <div className="flex items-start">
                  <div 
                    className={`p-2 rounded-full mr-3 ${
                      badge.earned 
                        ? 'bg-[var(--primary)] bg-opacity-20' 
                        : 'bg-gray-200'
                    }`}
                    style={
                      badge.earned 
                        ? { backgroundColor: `${favoriteColor}30` } 
                        : {}
                    }
                  >
                    <Trophy 
                      className={`w-6 h-6 ${
                        badge.earned 
                          ? 'text-[var(--primary)]' 
                          : 'text-gray-400'
                      }`}
                      style={badge.earned ? { color: favoriteColor } : {}}
                    />
                  </div>
                  <div>
                    <h3 
                      className={`font-semibold ${badge.earned ? '' : 'text-gray-400'}`}
                      style={badge.earned ? { color: favoriteColor } : {}}
                    >
                      {badge.name}
                    </h3>
                    <p className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Earned on {formatDate(badge.earnedDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Complete lessons and quizzes to earn badges!
          </p>
        )}
      </motion.div>
      
      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Daily Challenges
          </h2>
          <span className="text-sm font-medium py-1 px-2 bg-gray-100 rounded-full">
            {challenges.filter(c => c.completed).length}/{challenges.length}
          </span>
        </div>
        
        {challenges.length > 0 ? (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={`p-4 rounded-lg ${
                  challenge.completed 
                    ? 'bg-[var(--success)] bg-opacity-10' 
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">
                    {challenge.name}
                  </h3>
                  <span className="text-sm font-medium">
                    {challenge.progress}/{challenge.total}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {challenge.description}
                </p>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      challenge.completed 
                        ? 'bg-[var(--success)]' 
                        : 'bg-[var(--primary)]'
                    }`}
                    style={{ 
                      width: `${(challenge.progress / challenge.total) * 100}%`,
                      backgroundColor: challenge.completed ? 'var(--success)' : favoriteColor
                    }}
                  />
                </div>
                
                {challenge.completed && (
                  <p className="text-xs text-[var(--success)] mt-1">
                    Challenge completed! +30 XP
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No challenges available right now. Check back later!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;