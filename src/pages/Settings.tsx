import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User,
  LogOut
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import AvatarCreator from '../components/AvatarCreator';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    name, 
    email, 
    favoriteColor, 
    updateAvatar, 
    logout 
  } = useUserStore();
  
  const handleUpdateAvatar = (type: string, value: string) => {
    updateAvatar({ [type]: value });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
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
        
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex items-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: favoriteColor, color: 'white' }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{name}</h2>
            {email && <p className="text-gray-600">{email}</p>}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <User className="w-5 h-5" />
          Account Settings
        </h3>
        
        <div className="mb-2">
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="font-medium">My Favorite Color</span>
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: favoriteColor }}
            />
          </div>
        </div>
        
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full justify-between p-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          >
            <span className="font-medium">Log Out</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      {/* Avatar Creator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-xl font-semibold mb-4">Customize Your Avatar</h3>
        
        <AvatarCreator onUpdateAvatar={handleUpdateAvatar} />
      </motion.div>
    </div>
  );
};

export default Settings;