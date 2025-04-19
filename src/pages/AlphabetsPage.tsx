import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import Confetti from 'react-confetti';

interface AlphabetItem {
  letter: string;
  word: string;
  image: string;
  description: string;
}

type Mode = 'learn' | 'quiz' | 'test';

const alphabetData: AlphabetItem[] = [
  {
    letter: 'A',
    word: 'Apple',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'A is for Apple. Apples are red, yellow, or green fruits that grow on trees!'
  },
  {
    letter: 'B',
    word: 'Butterfly',
    image: 'https://images.pexels.com/photos/672142/pexels-photo-672142.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'B is for Butterfly. Butterflies have beautiful, colorful wings and flutter in the air!'
  },
  {
    letter: 'C',
    word: 'Cat',
    image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'C is for Cat. Cats are furry pets that purr and have whiskers!'
  },
  {
    letter: 'D',
    word: 'Dog',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'D is for Dog. Dogs are friendly pets that bark and wag their tails!'
  },
  {
    letter: 'E',
    word: 'Elephant',
    image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'E is for Elephant. Elephants are huge animals with long trunks and big ears!'
  }
];

const quizQuestions = [
  {
    id: 'q1',
    question: 'What letter does "Apple" start with?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'q2',
    question: 'What letter does "Butterfly" start with?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'B',
    image: 'https://images.pexels.com/photos/672142/pexels-photo-672142.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'q3',
    question: 'What letter does "Cat" start with?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'C',
    image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'q4',
    question: 'What letter does "Dog" start with?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'D',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'q5',
    question: 'What letter does "Elephant" start with?',
    options: ['A', 'B', 'E', 'D'],
    correctAnswer: 'E',
    image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const AlphabetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteColor, addXp, earnBadge, updateChallengeProgress } = useUserStore();
  
  const [mode, setMode] = useState<Mode>('learn');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const currentLetter = alphabetData[currentLetterIndex];
  const currentQuestion = quizQuestions[currentLetterIndex];
  
  const handleNext = () => {
    if (currentLetterIndex < alphabetData.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else if (mode === 'learn') {
      addXp(20);
    }
  };
  
  const handlePrev = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    }
  };
  
  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };
  
  const handleQuizSubmit = () => {
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    
    quizQuestions.forEach(question => {
      const isCorrect = quizAnswers[question.id] === question.correctAnswer;
      newResults[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });
    
    setQuizResults(newResults);
    setScore(correctCount);
    setShowResults(true);
    
    if (mode === 'test') {
      // Award XP based on score
      const percentage = (correctCount / quizQuestions.length) * 100;
      let xpAwarded = 0;
      
      if (percentage >= 80) {
        xpAwarded = 50;
        earnBadge('alphabet-ace');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else if (percentage >= 60) {
        xpAwarded = 30;
      } else {
        xpAwarded = 10;
      }
      
      addXp(xpAwarded);
      
      // Update quiz challenge progress
      updateChallengeProgress('complete-quizzes', 1);
    }
  };
  
  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizResults({});
    setShowResults(false);
    setCurrentLetterIndex(0);
  };
  
  const renderContent = () => {
    switch (mode) {
      case 'learn':
        return (
          <motion.div
            key={`letter-${currentLetterIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-24 h-24 text-5xl font-bold rounded-full mb-4 flex items-center justify-center"
                style={{ 
                  backgroundColor: favoriteColor,
                  color: 'white'
                }}
              >
                {currentLetter.letter}
              </div>
            </div>
            
            <div className="card mb-6">
              <div className="mb-4">
                <img 
                  src={currentLetter.image} 
                  alt={currentLetter.word} 
                  className="rounded-xl object-cover w-full h-[200px]"
                />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                {currentLetter.letter} is for {currentLetter.word}
              </h2>
              
              <p className="text-gray-700">
                {currentLetter.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentLetterIndex === 0}
                className={`p-2 rounded-lg flex items-center ${
                  currentLetterIndex === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Previous
              </button>
              
              {currentLetterIndex < alphabetData.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ backgroundColor: favoriteColor }}
                >
                  Next Letter
                </button>
              ) : (
                <button
                  onClick={() => setMode('quiz')}
                  className="btn btn-primary"
                  style={{ backgroundColor: favoriteColor }}
                >
                  Start Quiz
                </button>
              )}
            </div>
          </motion.div>
        );
        
      case 'quiz':
      case 'test':
        return (
          <motion.div
            key={`quiz-${mode}-${currentLetterIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            
            {showResults ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {mode === 'test' ? 'Test Results' : 'Quiz Results'}
                </h2>
                
                <div className="card mb-6">
                  <div 
                    className="text-5xl mb-4"
                    style={{ color: favoriteColor }}
                  >
                    {score}/{quizQuestions.length}
                  </div>
                  
                  <p className="text-lg mb-4">
                    {
                      score === quizQuestions.length 
                        ? 'Perfect! You got all letters correct!' 
                        : score >= quizQuestions.length / 2 
                        ? 'Good job! You remembered most letters!' 
                        : 'Keep practicing! You\'ll learn all the letters soon!'
                    }
                  </p>
                  
                  {mode === 'test' && score >= Math.ceil(quizQuestions.length * 0.8) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2">Rewards earned:</h3>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">{score >= quizQuestions.length * 0.8 ? '+50' : score >= quizQuestions.length * 0.6 ? '+30' : '+10'} XP</span>
                      </p>
                      {score >= quizQuestions.length * 0.8 && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Badge: Alphabet Ace</span>
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        resetQuiz();
                        setMode('learn');
                      }}
                      className="btn btn-secondary"
                    >
                      Learn Again
                    </button>
                    
                    <button
                      onClick={resetQuiz}
                      className="btn btn-primary"
                      style={{ backgroundColor: favoriteColor }}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review your answers:</h3>
                  {quizQuestions.map((question, index) => (
                    <div 
                      key={question.id} 
                      className={`card border-l-4 ${
                        quizResults[question.id] 
                          ? 'border-[var(--success)]' 
                          : 'border-[var(--error)]'
                      }`}
                    >
                      <h4 className="font-semibold mb-2">
                        {index + 1}. {question.question}
                      </h4>
                      
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {question.options.map((option) => (
                          <div
                            key={option}
                            className={`p-2 rounded-lg text-center ${
                              quizAnswers[question.id] === option
                                ? quizResults[question.id]
                                  ? 'bg-[var(--success)] bg-opacity-20 text-[var(--success)]'
                                  : 'bg-[var(--error)] bg-opacity-20 text-[var(--error)]'
                                : option === question.correctAnswer
                                ? 'bg-[var(--success)] bg-opacity-20 text-[var(--success)]'
                                : 'bg-gray-100'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        {quizResults[question.id] ? (
                          <Check className="w-4 h-4 text-[var(--success)] mr-1" />
                        ) : (
                          <X className="w-4 h-4 text-[var(--error)] mr-1" />
                        )}
                        <span>
                          {quizResults[question.id]
                            ? 'Correct!'
                            : `The correct answer is ${question.correctAnswer}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {mode === 'test' ? 'Test' : 'Quiz'}: Question {currentLetterIndex + 1} of {quizQuestions.length}
                  </h2>
                  
                  <div className="bg-gray-100 rounded-full w-16 h-4 overflow-hidden">
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${((currentLetterIndex + 1) / quizQuestions.length) * 100}%`,
                        backgroundColor: favoriteColor 
                      }}
                    />
                  </div>
                </div>
                
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  {currentQuestion.image && (
                    <div className="mb-4">
                      <img 
                        src={currentQuestion.image} 
                        alt={currentQuestion.question}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        className={`p-4 rounded-lg text-2xl font-bold transition-colors ${
                          quizAnswers[currentQuestion.id] === option
                            ? 'bg-[color:var(--primary)] text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        style={
                          quizAnswers[currentQuestion.id] === option
                            ? { backgroundColor: favoriteColor }
                            : {}
                        }
                        onClick={() => handleQuizAnswer(currentQuestion.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  {currentLetterIndex > 0 ? (
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-lg flex items-center text-gray-600 hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      Previous
                    </button>
                  ) : (
                    <button
                      onClick={() => setMode('learn')}
                      className="p-2 rounded-lg flex items-center text-gray-600 hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      Back to Learn
                    </button>
                  )}
                  
                  {currentLetterIndex < quizQuestions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={!quizAnswers[currentQuestion.id]}
                      className={`btn ${
                        quizAnswers[currentQuestion.id]
                          ? 'btn-primary'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      style={
                        quizAnswers[currentQuestion.id]
                          ? { backgroundColor: favoriteColor }
                          : {}
                      }
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={!Object.keys(quizAnswers).length}
                      className={`btn ${
                        Object.keys(quizAnswers).length === quizQuestions.length
                          ? 'btn-primary'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      style={
                        Object.keys(quizAnswers).length === quizQuestions.length
                          ? { backgroundColor: favoriteColor }
                          : {}
                      }
                    >
                      Submit
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="pb-16">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🔤</span>
          Alphabets
        </h1>
      </div>
      
      {/* Mode selector */}
      {!showResults && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['learn', 'quiz', 'test'].map((m) => (
            <button
              key={m}
              onClick={() => {
                resetQuiz();
                setMode(m as Mode);
              }}
              className={`px-4 py-2 rounded-full text-sm ${
                mode === m
                  ? 'bg-[color:var(--primary)] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              style={mode === m ? { backgroundColor: favoriteColor } : {}}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default AlphabetsPage;