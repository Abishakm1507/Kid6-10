import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <AnimatedBackground numberOfShapes={20} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <Sparkles className="w-20 h-20 text-[var(--primary)] mb-4 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--primary)]">
          MindSpark Kids
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-gray-600">
          Learning is an adventure!
        </h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="card max-w-md w-full mb-8"
      >
        <h3 className="text-xl font-semibold mb-3">Welcome, young explorer!</h3>
        <p className="mb-4 text-gray-600">
          Get ready for a fun journey of learning with games, quizzes, and your new friend Momo!
        </p>
        
        <div className="flex flex-col gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary w-full"
            onClick={() => navigate('/signup')}
          >
            Let's Get Started!
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-2">
            Already have an account? <button className="text-[var(--primary)] font-medium">Log In</button>
          </p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 max-w-2xl"
      >
        {['Learn', 'Play', 'Grow', 'Discover'].map((text, index) => (
          <motion.div
            key={text}
            className="bg-white rounded-full px-5 py-2 shadow-md text-sm font-medium text-[var(--accent)]"
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2,
              delay: index * 0.2,
            }}
          >
            {text}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GetStarted;