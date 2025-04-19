import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import AnimatedBackground from '../components/AnimatedBackground';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const login = useUserStore(state => state.login);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Oops! We need your name to continue!';
      valid = false;
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Hmm, that email doesn\'t look right!';
      valid = false;
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Your password should be at least 6 characters long!';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Store user data in the store and local storage
      login(formData.name, formData.email);
      navigate('/onboarding');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <AnimatedBackground numberOfShapes={15} />
      
      <div className="w-full max-w-md">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </button>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">
            Join the Adventure!
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.name ? 'border-[var(--error)]' : ''}`}
                  placeholder="What should we call you?"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-[var(--error)] text-sm">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.email ? 'border-[var(--error)]' : ''}`}
                  placeholder="Your email or a parent's email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[var(--error)] text-sm">{errors.email}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.password ? 'border-[var(--error)]' : ''}`}
                  placeholder="Create a secret password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[var(--error)] text-sm">{errors.password}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary w-full"
            >
              Create My Account
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;