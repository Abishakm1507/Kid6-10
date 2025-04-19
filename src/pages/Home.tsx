import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useUserStore, Subject } from '../store/userStore';

interface SubjectCard {
  id: Subject;
  label: string;
  icon: string;
  description: string;
}

const subjectCards: SubjectCard[] = [
  { 
    id: 'shapes', 
    label: 'Shapes', 
    icon: '🔶', 
    description: 'Learn about circles, squares, triangles, and more!'
  },
  { 
    id: 'fruits', 
    label: 'Fruits', 
    icon: '🍎', 
    description: 'Discover delicious and healthy fruits from around the world!'
  },
  { 
    id: 'vegetables', 
    label: 'Vegetables', 
    icon: '🥦', 
    description: 'Explore vegetables that make you strong and healthy!'
  },
  { 
    id: 'animals', 
    label: 'Animals', 
    icon: '🦁', 
    description: 'Meet amazing animals from farms, jungles, and oceans!'
  },
  { 
    id: 'math', 
    label: 'Math', 
    icon: '🔢', 
    description: 'Count, add, and solve fun number puzzles!'
  },
  { 
    id: 'history', 
    label: 'History', 
    icon: '📜', 
    description: 'Travel back in time to learn about people and places!'
  },
  { 
    id: 'space', 
    label: 'Space', 
    icon: '🚀', 
    description: 'Blast off to explore planets, stars, and galaxies!'
  },
  { 
    id: 'ocean', 
    label: 'Ocean', 
    icon: '🐠', 
    description: 'Dive deep to discover amazing sea creatures!'
  },
  { 
    id: 'country', 
    label: 'Countries', 
    icon: '🌍', 
    description: 'Visit different countries and learn about cultures!'
  },
  { 
    id: 'alphabets', 
    label: 'Alphabets', 
    icon: '🔤', 
    description: 'Master the alphabet from A to Z with fun words!'
  },
];

// Simulated facts - in a real app, these would come from the Gemini API
const facts = [
  "Octopuses have three hearts, nine brains, and blue blood!",
  "The Moon is moving away from Earth at a rate of 1.5 inches per year!",
  "A group of flamingos is called a 'flamboyance'!",
  "The shortest war in history lasted only 38 minutes!",
  "There are more stars in the universe than grains of sand on all the beaches on Earth!",
  "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat!",
  "Butterflies taste with their feet!",
  "A day on Venus is longer than a year on Venus!",
  "Some dinosaurs had feathers!",
  "The Great Wall of China is not visible from space with the naked eye, despite popular belief!"
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { name, favoriteColor, selectedSubjects, updateChallengeProgress } = useUserStore();
  
  const [currentFact, setCurrentFact] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load a random fact on page load
  useEffect(() => {
    getRandomFact();
  }, []);
  
  const getRandomFact = () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setCurrentFact(randomFact);
      setIsRefreshing(false);
      
      // Update challenge progress for reading facts
      updateChallengeProgress('daily-facts', 1);
    }, 800);
  };
  
  const handleSubjectClick = (subject: Subject) => {
    if (subject === 'alphabets') {
      navigate('/alphabets');
    } else {
      navigate(`/subject/${subject}`);
    }
  };
  
  return (
    <div className="pb-16">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">
          Hello, <span style={{ color: favoriteColor }}>{name}</span>!
        </h1>
        <p className="text-gray-600">What would you like to learn today?</p>
      </motion.div>
      
      {/* Daily Fact Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold">Did you know?</h2>
          <button 
            onClick={getRandomFact}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Get new fact"
          >
            <RefreshCw 
              className={`w-5 h-5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        
        {currentFact ? (
          <motion.p
            key={currentFact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {currentFact}
          </motion.p>
        ) : (
          <div className="h-12 bg-gray-100 animate-pulse rounded" />
        )}
      </motion.div>
      
      {/* Subjects Grid */}
      <h2 className="text-xl font-semibold mb-4">Explore Subjects</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subjectCards
          .filter(subject => selectedSubjects.includes(subject.id))
          .map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSubjectClick(subject.id)}
            >
              <div className="text-3xl mb-2">{subject.icon}</div>
              <h3 
                className="text-lg font-semibold mb-1"
                style={{ color: favoriteColor }}
              >
                {subject.label}
              </h3>
              <p className="text-sm text-gray-600">{subject.description}</p>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Home;