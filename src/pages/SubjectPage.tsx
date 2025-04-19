import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import Confetti from 'react-confetti';

type Mode = 'lesson' | 'revision' | 'quiz' | 'test';

interface LessonItem {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
}

// Simulated data - in a real app, these would come from a database or API
const subjectData: Record<string, {
  title: string;
  icon: string;
  items: LessonItem[];
  questions: QuizQuestion[];
  badgeId: string;
}> = {
  shapes: {
    title: 'Shapes',
    icon: '🔶',
    badgeId: 'shapes-master',
    items: [
      {
        id: 'circle',
        name: 'Circle',
        image: 'https://images.pexels.com/photos/3617057/pexels-photo-3617057.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'A circle is a round shape with no corners or edges. Balls, wheels, and the sun are all circles!'
      },
      {
        id: 'square',
        name: 'Square',
        image: 'https://images.pexels.com/photos/1843624/pexels-photo-1843624.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'A square has 4 equal sides and 4 corners. Windows, books, and TVs are often shaped like squares!'
      },
      {
        id: 'triangle',
        name: 'Triangle',
        image: 'https://images.pexels.com/photos/1329626/pexels-photo-1329626.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'A triangle has 3 sides and 3 corners. Pizza slices and mountain peaks can look like triangles!'
      },
      {
        id: 'rectangle',
        name: 'Rectangle',
        image: 'https://images.pexels.com/photos/707582/pexels-photo-707582.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'A rectangle has 4 corners and 4 sides, but the sides are not all equal. Doors, phones, and beds are shaped like rectangles!'
      },
      {
        id: 'star',
        name: 'Star',
        image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'A star has 5 or more points. Stars shine in the night sky, and we use star shapes for special rewards!'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which shape has zero corners?',
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: 'Circle',
        image: 'https://images.pexels.com/photos/3617057/pexels-photo-3617057.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q2',
        question: 'How many sides does a triangle have?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3',
        image: 'https://images.pexels.com/photos/1329626/pexels-photo-1329626.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q3',
        question: 'What shape is this?',
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: 'Square',
        image: 'https://images.pexels.com/photos/1843624/pexels-photo-1843624.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q4',
        question: 'Which shape has 4 sides that are not all equal?',
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: 'Rectangle',
        image: 'https://images.pexels.com/photos/707582/pexels-photo-707582.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q5',
        question: 'What shape shines in the night sky?',
        options: ['Circle', 'Square', 'Triangle', 'Star'],
        correctAnswer: 'Star',
        image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  },
  animals: {
    title: 'Animals',
    icon: '🦁',
    badgeId: 'animals-master',
    items: [
      {
        id: 'lion',
        name: 'Lion',
        image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'The lion is the king of the jungle! Male lions have a big, fluffy mane around their neck.'
      },
      {
        id: 'elephant',
        name: 'Elephant',
        image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Elephants are the largest land animals. They have long trunks to pick up food and drink water.'
      },
      {
        id: 'giraffe',
        name: 'Giraffe',
        image: 'https://images.pexels.com/photos/1320605/pexels-photo-1320605.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Giraffes have very long necks to reach leaves high up in trees. They are the tallest animals!'
      },
      {
        id: 'penguin',
        name: 'Penguin',
        image: 'https://images.pexels.com/photos/2078752/pexels-photo-2078752.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Penguins are birds that cannot fly. They swim very well and live in cold, icy places.'
      },
      {
        id: 'dolphin',
        name: 'Dolphin',
        image: 'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Dolphins are very smart animals that live in the ocean. They breathe air and can jump high out of the water!'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which animal is known as the "king of the jungle"?',
        options: ['Elephant', 'Lion', 'Giraffe', 'Penguin'],
        correctAnswer: 'Lion',
        image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q2',
        question: 'Which animal has the longest neck?',
        options: ['Elephant', 'Lion', 'Giraffe', 'Penguin'],
        correctAnswer: 'Giraffe',
        image: 'https://images.pexels.com/photos/1320605/pexels-photo-1320605.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q3',
        question: 'Which animal lives in cold, icy places?',
        options: ['Elephant', 'Lion', 'Giraffe', 'Penguin'],
        correctAnswer: 'Penguin',
        image: 'https://images.pexels.com/photos/2078752/pexels-photo-2078752.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q4',
        question: 'Which animal has a long trunk?',
        options: ['Elephant', 'Lion', 'Giraffe', 'Penguin'],
        correctAnswer: 'Elephant',
        image: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'q5',
        question: 'Which animal is known for being very smart and living in the ocean?',
        options: ['Elephant', 'Lion', 'Dolphin', 'Penguin'],
        correctAnswer: 'Dolphin',
        image: 'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]
  }
};

const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { favoriteColor, addXp, earnBadge, updateChallengeProgress } = useUserStore();
  
  const [mode, setMode] = useState<Mode>('lesson');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get subject data or fallback to shapes
  const subject = subjectData[subjectId || ''] || subjectData.shapes;
  const items = subject.items;
  const questions = subject.questions;
  
  useEffect(() => {
    // Reset state when subject changes
    setMode('lesson');
    setCurrentItemIndex(0);
    setQuizAnswers({});
    setQuizResults({});
    setScore(0);
    setShowResults(false);
  }, [subjectId]);
  
  const handleNextItem = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      // End of lesson
      if (mode === 'lesson') {
        // Completed all items, award XP
        addXp(20);
      }
    }
  };
  
  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };
  
  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };
  
  const handleQuizSubmit = () => {
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};
    
    questions.forEach(question => {
      const isCorrect = quizAnswers[question.id] === question.correctAnswer;
      newResults[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });
    
    setQuizResults(newResults);
    setScore(correctCount);
    setShowResults(true);
    
    if (mode === 'test') {
      // Award XP based on score
      const percentage = (correctCount / questions.length) * 100;
      let xpAwarded = 0;
      
      if (percentage >= 80) {
        xpAwarded = 50;
        earnBadge(subject.badgeId);
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
    setCurrentItemIndex(0);
  };
  
  const renderContent = () => {
    switch (mode) {
      case 'lesson':
        return (
          <motion.div
            key={`lesson-${currentItemIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img 
                src={items[currentItemIndex].image} 
                alt={items[currentItemIndex].name}
                className="rounded-xl object-cover w-full h-[200px]"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {items[currentItemIndex].name}
            </h2>
            
            <p className="text-gray-700 mb-6">
              {items[currentItemIndex].description}
            </p>
            
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevItem}
                disabled={currentItemIndex === 0}
                className={`p-2 rounded-lg flex items-center ${
                  currentItemIndex === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Previous
              </button>
              
              {currentItemIndex < items.length - 1 ? (
                <button
                  onClick={handleNextItem}
                  className="btn btn-primary"
                  style={{ backgroundColor: favoriteColor }}
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => setMode('revision')}
                  className="btn btn-primary"
                  style={{ backgroundColor: favoriteColor }}
                >
                  Finish Lesson
                </button>
              )}
            </div>
          </motion.div>
        );
        
      case 'revision':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-4">Let's Review!</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="card cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setMode('lesson');
                    setCurrentItemIndex(items.findIndex(i => i.id === item.id));
                  }}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="rounded-lg object-cover w-full h-[100px]"
                    />
                  </div>
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setMode('lesson')}
                className="p-2 rounded-lg flex items-center text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Lesson
              </button>
              
              <button
                onClick={() => setMode('quiz')}
                className="btn btn-primary"
                style={{ backgroundColor: favoriteColor }}
              >
                Take Quiz
              </button>
            </div>
          </motion.div>
        );
        
      case 'quiz':
      case 'test':
        const currentQuestion = questions[currentItemIndex];
        
        return (
          <motion.div
            key={`quiz-${currentItemIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
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
                    {score}/{questions.length}
                  </div>
                  
                  <p className="text-lg mb-4">
                    {
                      score === questions.length 
                        ? 'Perfect! You got all answers correct!' 
                        : score >= questions.length / 2 
                        ? 'Good job! You answered most questions correctly!' 
                        : 'Keep practicing! You\'ll do better next time!'
                    }
                  </p>
                  
                  {mode === 'test' && score >= Math.ceil(questions.length * 0.8) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2">Rewards earned:</h3>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">{score >= questions.length * 0.8 ? '+50' : score >= questions.length * 0.6 ? '+30' : '+10'} XP</span>
                      </p>
                      {score >= questions.length * 0.8 && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Badge: {subject.title} Master</span>
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        resetQuiz();
                        setMode(mode === 'test' ? 'quiz' : 'revision');
                      }}
                      className="btn btn-secondary"
                    >
                      Try Again
                    </button>
                    
                    <button
                      onClick={() => navigate('/home')}
                      className="btn btn-primary"
                      style={{ backgroundColor: favoriteColor }}
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review your answers:</h3>
                  {questions.map((question, index) => (
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
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {question.options.map((option) => (
                          <div
                            key={option}
                            className={`p-2 rounded-lg text-sm ${
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
                    {mode === 'test' ? 'Test' : 'Quiz'}: Question {currentItemIndex + 1} of {questions.length}
                  </h2>
                  
                  <div className="bg-gray-100 rounded-full w-16 h-4 overflow-hidden">
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${((currentItemIndex + 1) / questions.length) * 100}%`,
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
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
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
                  {currentItemIndex > 0 ? (
                    <button
                      onClick={handlePrevItem}
                      className="p-2 rounded-lg flex items-center text-gray-600 hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      Previous
                    </button>
                  ) : (
                    <button
                      onClick={() => setMode('revision')}
                      className="p-2 rounded-lg flex items-center text-gray-600 hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      Back
                    </button>
                  )}
                  
                  {currentItemIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNextItem}
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
                        Object.keys(quizAnswers).length === questions.length
                          ? 'btn-primary'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      style={
                        Object.keys(quizAnswers).length === questions.length
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
          <span className="text-3xl">{subject.icon}</span>
          {subject.title}
        </h1>
      </div>
      
      {/* Mode selector */}
      {!showResults && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['lesson', 'revision', 'quiz', 'test'].map((m) => (
            <button
              key={m}
              onClick={() => {
                resetQuiz();
                setMode(m as Mode);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
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

export default SubjectPage;