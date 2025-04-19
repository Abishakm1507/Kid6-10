import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type MathProblem = {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

type MathGameProps = {
  problems: MathProblem[];
  onComplete: (score: number, timeInSeconds: number) => void;
};

const MathGame: React.FC<MathGameProps> = ({ problems, onComplete }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
  
  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === problems[currentProblemIndex].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 20); // Each correct answer is worth 20 points
    }
    
    // Move to next problem after a delay
    setTimeout(() => {
      if (currentProblemIndex < problems.length - 1) {
        setCurrentProblemIndex(currentProblemIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Game completed
        setGameCompleted(true);
        const finalScore = score + (correct ? 20 : 0);
        onComplete(finalScore, timeElapsed);
      }
    }, 1500);
  };
  
  const currentProblem = problems[currentProblemIndex];
  
  // Shuffle options to avoid having the correct answer always in the same position
  const shuffledOptions = [...currentProblem.options].sort(() => Math.random() - 0.5);
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Problem {currentProblemIndex + 1} of {problems.length}
        </div>
        <div className="text-sm text-gray-500">
          Time: {timeElapsed} seconds | Score: {score}
        </div>
      </div>
      
      <div className="text-3xl font-bold mb-8 text-center">
        {currentProblem.question}
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {shuffledOptions.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg text-center text-xl font-medium transition-colors ${
              selectedOption === option
                ? option === currentProblem.answer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      {isCorrect !== null && (
        <div className={`mt-6 text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? 'Correct!' : `Incorrect! The answer is ${currentProblem.answer}`}
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

export default MathGame;