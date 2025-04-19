import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type SpellingWord = {
  id: number;
  word: string;
  hint: string;
};

type SpellingGameProps = {
  words: SpellingWord[];
  onComplete: (score: number, timeInSeconds: number) => void;
};

const SpellingGame: React.FC<SpellingGameProps> = ({ words, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameCompleted) {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, gameCompleted]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCorrect !== null) {
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
        setFeedback(null);
        setIsCorrect(null);
      } else {
        // Game completed
        setGameCompleted(true);
        onComplete(score, timeElapsed);
      }
      return;
    }
    
    const currentWord = words[currentWordIndex];
    const correct = userInput.toLowerCase() === currentWord.word.toLowerCase();
    
    setIsCorrect(correct);
    
    if (correct) {
      setFeedback('Correct! Great job!');
      setScore(score + 20); // Each correct answer is worth 20 points
    } else {
      setFeedback(`Not quite. The correct spelling is "${currentWord.word}".`);
    }
  };
  
  const currentWord = words[currentWordIndex];
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Word {currentWordIndex + 1} of {words.length}
        </div>
        <div className="text-sm text-gray-500">
          Time: {timeElapsed} seconds | Score: {score}
        </div>
      </div>
      
      <div className="text-xl font-bold mb-6 text-center">
        Hint: {currentWord.hint}
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the word here..."
            className="w-full p-3 text-lg border rounded-lg mb-4"
            disabled={isCorrect !== null}
            autoFocus
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium"
          >
            {isCorrect !== null ? 'Next Word' : 'Check Spelling'}
          </motion.button>
        </div>
      </form>
      
      {feedback && (
        <div className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {feedback}
        </div>
      )}
      
      {gameCompleted && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
          <p className="text-lg mb-4">
            Your score: {score} points<br />
            Time taken: {timeElapsed} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default SpellingGame;