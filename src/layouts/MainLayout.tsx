import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Award, 
  Gamepad2, 
  MessageCircle, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { useUserStore } from '../store/userStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateStreak } = useUserStore();
  
  // Update streak when a user visits any page
  React.useEffect(() => {
    updateStreak();
  }, [updateStreak]);
  
  const navItems = [
    { path: '/home', label: 'Home', icon: <Home className="w-6 h-6" /> },
    { path: '/alphabets', label: 'Learn', icon: <BookOpen className="w-6 h-6" /> },
    { path: '/dashboard', label: 'Progress', icon: <Award className="w-6 h-6" /> },
    { path: '/games', label: 'Games', icon: <Gamepad2 className="w-6 h-6" /> },
    { path: '/talk-with-momo', label: 'Momo', icon: <MessageCircle className="w-6 h-6" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Main content */}
      <main className="flex-grow pb-24 pt-4 px-4 md:px-8">
        {children}
      </main>
      
      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 ${
                  isActive 
                    ? 'text-[var(--primary)]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;