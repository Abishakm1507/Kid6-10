import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { useUserStore, Subject } from '../store/userStore';
import AnimatedBackground from '../components/AnimatedBackground';

interface SubjectOption {
  id: Subject;
  label: string;
  icon: string;
}

const subjects: SubjectOption[] = [
  { id: 'shapes', label: 'Shapes', icon: '🔶' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'animals', label: 'Animals', icon: '🦁' },
  { id: 'math', label: 'Math', icon: '🔢' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'space', label: 'Space', icon: '🚀' },
  { id: 'ocean', label: 'Ocean', icon: '🐠' },
  { id: 'country', label: 'Countries', icon: '🌍' },
  { id: 'alphabets', label: 'Alphabets', icon: '🔤' },
];

const ageOptions = [6, 7, 8, 9, 10];

const colorOptions = [
  { name: 'Purple', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#22d3ee' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#facc15' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateOnboarding, completeOnboarding } = useUserStore();
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [favoriteColor, setFavoriteColor] = useState('#6366f1');
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  
  const totalSteps = 3;
  
  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step, save data and redirect
      updateOnboarding({ age: age || 8, favoriteColor, selectedSubjects });
      completeOnboarding();
      navigate('/home');
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };
  
  const isNextDisabled = () => {
    if (step === 1 && age === null) return true;
    if (step === 3 && selectedSubjects.length === 0) return true;
    return false;
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AnimatedBackground 
        numberOfShapes={10} 
        primaryColor={`${favoriteColor}99`} // Add transparency
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: favoriteColor }}
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">How old are you?</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {ageOptions.map(option => (
                    <button
                      key={option}
                      className={`py-3 rounded-xl text-lg font-medium transition-all ${
                        age === option 
                          ? `bg-[${favoriteColor}] text-white` 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={age === option ? { backgroundColor: favoriteColor } : {}}
                      onClick={() => setAge(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">What's your favorite color?</h2>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`h-12 rounded-xl transition-all ${
                        favoriteColor === color.value 
                          ? 'ring-4 ring-offset-2' 
                          : 'hover:scale-110'
                      }`}
                      style={{ 
                        backgroundColor: color.value, 
                        ringColor: color.value
                      }}
                      onClick={() => setFavoriteColor(color.value)}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-center py-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: favoriteColor }}
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">What would you like to learn?</h2>
                <p className="text-gray-600 mb-4">Select at least one subject:</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      className={`py-3 px-4 rounded-xl flex items-center gap-2 transition-all ${
                        selectedSubjects.includes(subject.id)
                          ? `bg-[${favoriteColor}] text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={
                        selectedSubjects.includes(subject.id) 
                          ? { backgroundColor: favoriteColor } 
                          : {}
                      }
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <span className="text-xl">{subject.icon}</span>
                      <span>{subject.label}</span>
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500">
                  Selected: {selectedSubjects.length} of {subjects.length}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevStep}
            className={`flex items-center px-4 py-2 rounded-lg ${
              step === 1 ? 'invisible' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextStep}
            disabled={isNextDisabled()}
            className={`flex items-center px-6 py-2 rounded-lg ${
              isNextDisabled()
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn btn-primary'
            }`}
            style={
              !isNextDisabled() ? { backgroundColor: favoriteColor } : {}
            }
          >
            {step === totalSteps ? 'Start Learning!' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;