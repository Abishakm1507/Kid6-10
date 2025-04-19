import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type MemoryCard = {
  id: number;
  value: string;
  image: string;
};

type MemoryGameProps = {
  cards: MemoryCard[];
  onComplete: (score: number, timeInSeconds: number) => void;
};

const MemoryGame: React.FC<MemoryGameProps> = ({ cards, onComplete }) => {
  // Create pairs of cards
  const cardPairs = [...cards, ...cards].map((card, index) => ({
    ...card,
    id: index,
    isFlipped: false,
    isMatched: false
  }));
  
  // Shuffle the cards
  const shuffleCards = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const [gameCards, setGameCards] = useState(shuffleCards(cardPairs));
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameCompleted) {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, gameCompleted]);
  
  // Check for matches
  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const firstIndex = flippedIndexes[0];
      const secondIndex = flippedIndexes[1];
      
      if (
        gameCards[firstIndex].value === gameCards[secondIndex].value &&
        firstIndex !== secondIndex
      ) {
        // Match found
        setGameCards(prevCards => 
          prevCards.map((card, index) => 
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedIndexes([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setGameCards(prevCards => 
            prevCards.map((card, index) => 
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndexes([]);
        }, 1000);
      }
      
      setMoves(prev => prev + 1);
    }
  }, [flippedIndexes, gameCards]);
  
  // Check for game completion
  useEffect(() => {
    if (matchedPairs === cards.length && matchedPairs > 0) {
      setGameCompleted(true);
      
      // Calculate score based on moves and time
      const maxMoves = cards.length * 2;
      const moveScore = Math.max(0, 100 - (moves - cards.length) * 10);
      const timeScore = Math.max(0, 100 - timeElapsed);
      const totalScore = Math.floor((moveScore + timeScore) / 2);
      
      onComplete(totalScore, timeElapsed);
    }
  }, [matchedPairs, cards.length, moves, timeElapsed, onComplete]);
  
  const handleCardClick = (index: number) => {
    // Prevent clicking if already two cards are flipped or this card is already flipped/matched
    if (
      flippedIndexes.length === 2 ||
      gameCards[index].isFlipped ||
      gameCards[index].isMatched
    ) {
      return;
    }
    
    // Flip the card
    setGameCards(prevCards => 
      prevCards.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    
    // Add to flipped indexes
    setFlippedIndexes(prev => [...prev, index]);
  };
  
  const resetGame = () => {
    setGameCards(shuffleCards(cardPairs));
    setFlippedIndexes([]);
    setMatchedPairs(0);
    setMoves(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setGameCompleted(false);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <div className="text-sm text-gray-500 mb-2">
          Pairs found: {matchedPairs} of {cards.length}
        </div>
        <div className="text-sm text-gray-500">
          Moves: {moves} | Time: {timeElapsed} seconds
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-md">
        {gameCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isFlipped || card.isMatched ? 1 : 0.95 }}
            className={`aspect-square rounded-lg cursor-pointer overflow-hidden ${
              card.isMatched ? 'opacity-60' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div
              className={`w-full h-full transition-transform duration-500 ${
                card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : '',
              }}
            >
              {/* Card Back */}
              <div
                className="absolute w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl rounded-lg"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                ?
              </div>
              
              {/* Card Front */}
              <div
                className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <img 
                  src={card.image} 
                  alt={card.value} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {gameCompleted && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
          <p className="text-lg mb-4">
            You found all pairs in {moves} moves and {timeElapsed} seconds.
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;