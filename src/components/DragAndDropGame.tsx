import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface DragItem {
  id: string;
  value: string;
  categoryId: string;
  image?: string;
}

interface DragAndDropGameProps {
  categories: Category[];
  items: DragItem[];
  onComplete: (score: number, time: number) => void;
}

const DragAndDropGame: React.FC<DragAndDropGameProps> = ({ 
  categories, 
  items,
  onComplete 
}) => {
  const { favoriteColor } = useUserStore();
  
  const [draggableItems, setDraggableItems] = useState<(DragItem & { placed?: boolean })[]>([]);
  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  
  // Initialize the game
  useEffect(() => {
    // Shuffle the items
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    
    // Initialize empty arrays for each category
    const initialDroppedItems: Record<string, string[]> = {};
    categories.forEach(category => {
      initialDroppedItems[category.id] = [];
    });
    
    setDraggableItems(shuffledItems.map(item => ({ ...item, placed: false })));
    setDroppedItems(initialDroppedItems);
    setGameComplete(false);
    setScore(0);
    setStartTime(null);
  }, [categories, items]);
  
  // Track elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime && !gameComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, gameComplete]);
  
  // Check if all items are placed
  useEffect(() => {
    if (draggableItems.length > 0 && draggableItems.every(item => item.placed)) {
      // Calculate score
      let correctPlacements = 0;
      
      Object.entries(droppedItems).forEach(([categoryId, itemIds]) => {
        itemIds.forEach(itemId => {
          const item = draggableItems.find(i => i.id === itemId);
          if (item && item.categoryId === categoryId) {
            correctPlacements++;
          }
        });
      });
      
      const finalScore = Math.round((correctPlacements / draggableItems.length) * 100);
      setScore(finalScore);
      setGameComplete(true);
      onComplete(finalScore, elapsedTime);
    }
  }, [draggableItems, droppedItems, elapsedTime, onComplete]);
  
  const handleDragStart = (id: string) => {
    // Start the timer on first drag
    if (startTime === null) {
      setStartTime(Date.now());
    }
    
    setDraggedItem(id);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  
  const handleDrop = (categoryId: string) => {
    if (draggedItem) {
      // Find which category currently has the item (if any)
      let sourceCategory: string | null = null;
      
      Object.entries(droppedItems).forEach(([catId, items]) => {
        if (items.includes(draggedItem)) {
          sourceCategory = catId;
        }
      });
      
      // Remove from source category if it exists somewhere else
      if (sourceCategory) {
        setDroppedItems(prev => ({
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(id => id !== draggedItem)
        }));
      }
      
      // Add to target category
      setDroppedItems(prev => ({
        ...prev,
        [categoryId]: [...prev[categoryId], draggedItem]
      }));
      
      // Mark the item as placed
      setDraggableItems(prev => 
        prev.map(item => 
          item.id === draggedItem 
            ? { ...item, placed: true } 
            : item
        )
      );
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          Placed: <span className="font-bold">
            {draggableItems.filter(item => item.placed).length}/{draggableItems.length}
          </span>
        </div>
        <div className="text-sm font-medium">
          Time: <span className="font-bold">{elapsedTime}s</span>
        </div>
      </div>
      
      {/* Draggable items */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Items to Sort:</h3>
        <div className="flex flex-wrap gap-3">
          {draggableItems.map(item => {
            // Check if the item has been placed in any category
            const isPlaced = Object.values(droppedItems).some(categoryItems => 
              categoryItems.includes(item.id)
            );
            
            if (isPlaced) return null;
            
            return (
              <motion.div
                key={item.id}
                className="py-2 px-4 bg-white rounded-lg shadow-md cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.value} 
                      className="w-8 h-8 object-cover rounded-md"
                    />
                  )}
                  <span>{item.value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Drop zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="border-2 border-dashed rounded-xl p-4"
            style={{ 
              borderColor: category.color || favoriteColor,
              minHeight: '150px'
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(category.id);
            }}
          >
            <h3 
              className="text-lg font-semibold mb-3"
              style={{ color: category.color || favoriteColor }}
            >
              {category.name}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {droppedItems[category.id]?.map(itemId => {
                const item = draggableItems.find(i => i.id === itemId);
                if (!item) return null;
                
                const isCorrect = item.categoryId === category.id;
                
                return (
                  <motion.div
                    key={item.id}
                    className={`py-2 px-4 rounded-lg shadow-sm ${
                      gameComplete
                        ? isCorrect 
                          ? 'bg-[var(--success)] bg-opacity-20 text-[var(--success)]'
                          : 'bg-[var(--error)] bg-opacity-20 text-[var(--error)]'
                        : 'bg-white'
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: gameComplete ? 1 : 1.05 }}
                  >
                    <div className="flex items-center gap-2">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.value} 
                          className="w-8 h-8 object-cover rounded-md"
                        />
                      )}
                      <span>{item.value}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {gameComplete && (
        <div className="mt-8 text-center p-4 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
          <p className="text-lg mb-2">
            Your Score: <span className="font-bold">{score}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Time: {elapsedTime} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default DragAndDropGame;