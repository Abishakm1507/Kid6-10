import React from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';

interface AvatarOption {
  id: string;
  name: string;
}

interface AvatarCreatorProps {
  onUpdateAvatar: (type: string, value: string) => void;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onUpdateAvatar }) => {
  const { settings, favoriteColor } = useUserStore();
  const { avatar } = settings;
  
  // Simulated options
  const hairOptions: AvatarOption[] = [
    { id: 'default', name: 'Default' },
    { id: 'curly', name: 'Curly' },
    { id: 'long', name: 'Long' },
    { id: 'short', name: 'Short' },
  ];
  
  const eyesOptions: AvatarOption[] = [
    { id: 'default', name: 'Default' },
    { id: 'round', name: 'Round' },
    { id: 'sleepy', name: 'Sleepy' },
    { id: 'star', name: 'Star' },
  ];
  
  const skinOptions: AvatarOption[] = [
    { id: 'default', name: 'Default' },
    { id: 'tan', name: 'Tan' },
    { id: 'brown', name: 'Brown' },
    { id: 'fair', name: 'Fair' },
  ];
  
  const clothesOptions: AvatarOption[] = [
    { id: 'default', name: 'Default' },
    { id: 'tshirt', name: 'T-Shirt' },
    { id: 'hoodie', name: 'Hoodie' },
    { id: 'dress', name: 'Dress' },
  ];
  
  // In a real app, this would use actual avatar components or SVGs
  // This is a simplified representation
  const renderAvatar = () => {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
        <div className="text-8xl">👧</div>
      </div>
    );
  };
  
  const renderOptions = (
    options: AvatarOption[],
    type: string,
    selected: string
  ) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 capitalize">{type}</h3>
        <div className="grid grid-cols-4 gap-2">
          {options.map((option) => (
            <motion.button
              key={option.id}
              className={`p-2 rounded-lg ${
                selected === option.id
                  ? 'bg-[color:var(--primary)] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={
                selected === option.id
                  ? { backgroundColor: favoriteColor }
                  : {}
              }
              onClick={() => onUpdateAvatar(type, option.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.name}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="max-w-[150px] mx-auto">
          {renderAvatar()}
        </div>
      </div>
      
      {renderOptions(hairOptions, 'hair', avatar.hair)}
      {renderOptions(eyesOptions, 'eyes', avatar.eyes)}
      {renderOptions(skinOptions, 'skin', avatar.skin)}
      {renderOptions(clothesOptions, 'clothes', avatar.clothes)}
    </div>
  );
};

export default AvatarCreator;