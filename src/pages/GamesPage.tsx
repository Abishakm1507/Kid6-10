import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Brain, Calculator, BookOpen, Globe } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import MemoryGame from '../components/MemoryGame';
import DragAndDropGame from '../components/DragAndDropGame';
// TODO: Create MathGame component
import MathGame from '../components/MathGame';
import SpellingGame from '../components/SpellingGame';
import GeographyGame from '../components/GeographyGame';
import Confetti from 'react-confetti';

type GameType = 'menu' | 'memory' | 'drag-and-drop' | 'math' | 'spelling' | 'geography';

// Memory Game cards
const memoryCards = [
  { id: 1, value: 'Apple', image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 2, value: 'Banana', image: 'https://images.pexels.com/photos/1166648/pexels-photo-1166648.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 3, value: 'Cat', image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 4, value: 'Dog', image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 5, value: 'Elephant', image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 6, value: 'Fish', image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

// Drag and Drop Game categories and items
const categories = [
  { id: 'fruit', name: 'Fruits', color: '#f97316' },
  { id: 'animal', name: 'Animals', color: '#8b5cf6' },
];

const dragItems = [
  { id: 'apple', value: 'Apple', categoryId: 'fruit', image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'banana', value: 'Banana', categoryId: 'fruit', image: 'https://images.pexels.com/photos/1166648/pexels-photo-1166648.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'orange', value: 'Orange', categoryId: 'fruit', image: 'https://images.pexels.com/photos/42059/citrus-diet-food-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'cat', value: 'Cat', categoryId: 'animal', image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'dog', value: 'Dog', categoryId: 'animal', image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 'elephant', value: 'Elephant', categoryId: 'animal', image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

// Math Game problems
const mathProblems = [
  { id: 1, question: '5 + 3 = ?', answer: '8', options: ['6', '7', '8', '9'] },
  { id: 2, question: '10 - 4 = ?', answer: '6', options: ['4', '5', '6', '7'] },
  { id: 3, question: '2 × 6 = ?', answer: '12', options: ['10', '12', '14', '16'] },
  { id: 4, question: '15 ÷ 3 = ?', answer: '5', options: ['3', '4', '5', '6'] },
  { id: 5, question: '7 + 8 = ?', answer: '15', options: ['13', '14', '15', '16'] },
];

// Spelling Game words
const spellingWords = [
  { id: 1, word: 'apple', hint: 'A red or green fruit' },
  { id: 2, word: 'house', hint: 'A place where people live' },
  { id: 3, word: 'school', hint: 'A place where children learn' },
  { id: 4, word: 'friend', hint: 'Someone you like to play with' },
  { id: 5, word: 'water', hint: 'You drink it when you are thirsty' },
];

// Geography Game questions
const geographyQuestions = [
  { 
    id: 1, 
    question: 'Which continent is the largest?', 
    answer: 'Asia', 
    options: ['Africa', 'Asia', 'North America', 'Europe'] 
  },
  { 
    id: 2, 
    question: 'Which ocean is the largest?', 
    answer: 'Pacific Ocean', 
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'] 
  },
  { 
    id: 3, 
    question: 'Which planet is closest to the sun?', 
    answer: 'Mercury', 
    options: ['Venus', 'Earth', 'Mars', 'Mercury'] 
  },
  { 
    id: 4, 
    question: 'Which country has the Great Wall?', 
    answer: 'China', 
    options: ['Japan', 'China', 'India', 'Russia'] 
  },
  { 
    id: 5, 
    question: 'Which animal is the tallest in the world?', 
    answer: 'Giraffe', 
    options: ['Elephant', 'Giraffe', 'Whale', 'Dinosaur'] 
  },
];

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteColor, addXp, earnBadge, updateChallengeProgress } = useUserStore();
  
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleGameComplete = (game: GameType, score: number) => {
    let xpAwarded = 0;
    
    if (score >= 80) {
      xpAwarded = 50;
      
      // Award specific badges based on the game and score
      switch(game) {
        case 'memory':
          earnBadge('memory-master');
          break;
        case 'drag-and-drop':
          earnBadge('sorting-expert');
          break;
        case 'math':
          earnBadge('math-wizard');
          break;
        case 'spelling':
          earnBadge('spelling-champion');
          break;
        case 'geography':
          earnBadge('geography-explorer');
          break;
      }
      
      // Award general game winner badge
      earnBadge('game-winner');
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else if (score >= 60) {
      xpAwarded = 30;
    } else {
      xpAwarded = 10;
    }
    
    addXp(xpAwarded);
    
    // Update games challenge progress
    updateChallengeProgress('play-games', 1);
    
    // Show completion message
    alert(`Great job! You earned ${xpAwarded} XP!`);
  };
  
  const renderGameContent = () => {
    switch (currentGame) {
      case 'menu':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setCurrentGame('memory')}
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--accent)] bg-opacity-20 w-16 h-16 flex items-center justify-center">
                <Brain className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Memory Match</h3>
              <p className="text-gray-600 mb-4">
                Test your memory by finding matching pairs of cards. Remember where each card is!
              </p>
              <div 
                className="py-2 px-4 rounded-lg text-white text-center"
                style={{ backgroundColor: favoriteColor }}
              >
                Play Now
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setCurrentGame('drag-and-drop')}
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--secondary)] bg-opacity-20 w-16 h-16 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-[var(--secondary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sort and Learn</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop items into the correct categories. Learn about fruits and animals!
              </p>
              <div 
                className="py-2 px-4 rounded-lg text-white text-center"
                style={{ backgroundColor: favoriteColor }}
              >
                Play Now
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setCurrentGame('math')}
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--primary)] bg-opacity-20 w-16 h-16 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Math Challenge</h3>
              <p className="text-gray-600 mb-4">
                Practice your math skills with fun addition, subtraction, multiplication, and division problems!
              </p>
              <div 
                className="py-2 px-4 rounded-lg text-white text-center"
                style={{ backgroundColor: favoriteColor }}
              >
                Play Now
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setCurrentGame('spelling')}
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--accent)] bg-opacity-20 w-16 h-16 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Spelling Bee</h3>
              <p className="text-gray-600 mb-4">
                Test your spelling skills! We'll give you a hint, and you spell the word correctly.
              </p>
              <div 
                className="py-2 px-4 rounded-lg text-white text-center"
                style={{ backgroundColor: favoriteColor }}
              >
                Play Now
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setCurrentGame('geography')}
            >
              <div className="mb-4 p-4 rounded-full bg-[var(--secondary)] bg-opacity-20 w-16 h-16 flex items-center justify-center">
                <Globe className="w-8 h-8 text-[var(--secondary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Geography Quiz</h3>
              <p className="text-gray-600 mb-4">
                Learn about our world with fun geography questions about continents, oceans, and more!
              </p>
              <div 
                className="py-2 px-4 rounded-lg text-white text-center"
                style={{ backgroundColor: favoriteColor }}
              >
                Play Now
              </div>
            </motion.div>
          </div>
        );
        
      case 'memory':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Memory Match</h3>
            <p className="text-gray-600 mb-6">
              Find all the matching pairs! Click on cards to flip them and remember their locations.
            </p>
            
            <MemoryGame 
              cards={memoryCards}
              onComplete={(score, time) => {
                handleGameComplete('memory', score);
              }}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="btn btn-secondary"
              >
                Back to Games
              </button>
            </div>
          </div>
        );
        
      case 'drag-and-drop':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Sort and Learn</h3>
            <p className="text-gray-600 mb-6">
              Drag each item to the correct category: Fruits or Animals.
            </p>
            
            <DragAndDropGame 
              categories={categories}
              items={dragItems}
              onComplete={(score, time) => {
                handleGameComplete('drag-and-drop', score);
              }}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="btn btn-secondary"
              >
                Back to Games
              </button>
            </div>
          </div>
        );
        
      case 'math':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Math Challenge</h3>
            <p className="text-gray-600 mb-6">
              Solve these math problems! Choose the correct answer from the options.
            </p>
            
            <MathGame 
              problems={mathProblems}
              onComplete={(score, time) => {
                handleGameComplete('math', score);
              }}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="btn btn-secondary"
              >
                Back to Games
              </button>
            </div>
          </div>
        );
        
      case 'spelling':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Spelling Bee</h3>
            <p className="text-gray-600 mb-6">
              Read the hint and spell the word correctly. Type your answer in the box.
            </p>
            
            <SpellingGame 
              words={spellingWords}
              onComplete={(score, time) => {
                handleGameComplete('spelling', score);
              }}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="btn btn-secondary"
              >
                Back to Games
              </button>
            </div>
          </div>
        );
        
      case 'geography':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Geography Quiz</h3>
            <p className="text-gray-600 mb-6">
              Test your knowledge about our world! Choose the correct answer for each question.
            </p>
            
            <GeographyGame 
              questions={geographyQuestions}
              onComplete={(score, time) => {
                handleGameComplete('geography', score);
              }}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentGame('menu')}
                className="btn btn-secondary"
              >
                Back to Games
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="pb-16">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="flex items-center gap-2 mb-6">
        {currentGame !== 'menu' ? (
          <button
            onClick={() => setCurrentGame('menu')}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Back to game menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          Educational Games
        </h1>
      </div>
      
      {renderGameContent()}
    </div>
  );
};

export default GamesPage;