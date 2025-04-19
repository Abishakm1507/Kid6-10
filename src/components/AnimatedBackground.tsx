import React from 'react';
import { motion } from 'framer-motion';

interface Shape {
  id: number;
  color: string;
  size: number;
  x: string;
  y: string;
  type: 'circle' | 'triangle' | 'square' | 'star';
  animationDelay: number;
}

interface AnimatedBackgroundProps {
  numberOfShapes?: number;
  primaryColor?: string;
}

const generateRandomShapes = (count: number, primaryColor: string): Shape[] => {
  const shapes: Shape[] = [];
  const colors = [
    primaryColor,
    'rgba(34, 211, 238, 0.7)', // cyan
    'rgba(251, 146, 60, 0.7)', // orange
    'rgba(167, 139, 250, 0.7)', // violet
    'rgba(74, 222, 128, 0.7)', // green
  ];
  
  const types: Array<Shape['type']> = ['circle', 'triangle', 'square', 'star'];
  
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.floor(Math.random() * 30) + 15, // 15-45px
      x: `${Math.floor(Math.random() * 90) + 5}%`, // 5-95%
      y: `${Math.floor(Math.random() * 90) + 5}%`, // 5-95%
      type: types[Math.floor(Math.random() * types.length)],
      animationDelay: Math.random() * 5, // 0-5s delay
    });
  }
  
  return shapes;
};

const renderShape = (shape: Shape) => {
  switch (shape.type) {
    case 'circle':
      return (
        <div
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            borderRadius: '50%',
          }}
        />
      );
    case 'triangle':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${shape.size / 2}px solid transparent`,
            borderRight: `${shape.size / 2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
          }}
        />
      );
    case 'square':
      return (
        <div
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            borderRadius: '4px',
          }}
        />
      );
    case 'star':
      return (
        <div
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
        />
      );
    default:
      return null;
  }
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  numberOfShapes = 15,
  primaryColor = 'rgba(99, 102, 241, 0.7)', // default indigo with opacity
}) => {
  const [shapes] = React.useState<Shape[]>(() => 
    generateRandomShapes(numberOfShapes, primaryColor)
  );
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          initial={{ 
            x: shape.x, 
            y: shape.y,
            opacity: 0.7,
          }}
          animate={{
            y: [`${parseInt(shape.y)}%`, `${parseInt(shape.y) + 5}%`, `${parseInt(shape.y)}%`],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: shape.animationDelay,
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;