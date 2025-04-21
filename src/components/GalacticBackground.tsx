'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/components/GalacticBackground.css';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
  moveDuration: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  duration: number;
  delay: number;
}

interface GalacticBackgroundProps {
  children?: React.ReactNode;
}

export default function GalacticBackground({ children }: GalacticBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Génération des étoiles statiques
  useEffect(() => {
    setMounted(true);
    
    // Couleurs possibles pour les étoiles
    const starColors = [
      'rgba(248, 245, 255, 0.9)', // blanc
      'rgba(25, 210, 229, 0.9)',  // cyan
      'rgba(229, 44, 157, 0.9)',  // rose
      'rgba(107, 29, 206, 0.9)',  // violet
    ];
    
    // Créer les étoiles fixes
    const fixedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      moveDuration: Math.random() * 80 + 40,
    }));
    
    setStars(fixedStars);
    
    // Créer les étoiles filantes
    const createShootingStars = () => {
      const newShootingStars = Array.from({ length: 3 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 50,
        size: Math.random() * 2 + 1,
        angle: Math.random() * 45 + 15, // angle entre 15 et 60 degrés
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      }));
      
      setShootingStars(newShootingStars);
    };
    
    // Créer de nouvelles étoiles filantes à intervalles réguliers
    createShootingStars();
    const interval = setInterval(createShootingStars, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="background-container">
      {/* Fond de base */}
      <div className="background-base" />
      
      {/* Nébuleuses animées */}
      {mounted && (
        <>
          <motion.div 
            className="nebula-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <motion.div 
              className="nebula-purple"
              animate={{ 
                x: [0, 10, -10, 0],
                y: [0, -10, 5, 0],
              }}
              transition={{ 
                duration: 60, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
            />
            <motion.div 
              className="nebula-cyan"
              animate={{ 
                x: [0, -15, 15, 0],
                y: [0, 10, -5, 0],
              }}
              transition={{ 
                duration: 70, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
            />
            <motion.div 
              className="nebula-pink"
              animate={{ 
                x: [0, 20, -10, 0],
                y: [0, -15, 15, 0],
              }}
              transition={{ 
                duration: 80, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
            />
          </motion.div>
          
          {/* Étoiles fixes scintillantes */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="star"
              style={{
                width: star.size,
                height: star.size,
                left: `${star.x}%`,
                top: `${star.y}%`,
                backgroundColor: star.color,
              }}
            />
          ))}
          
          {/* Étoiles filantes */}
          <AnimatePresence>
            {shootingStars.map((star) => (
              <motion.div
                key={star.id}
                className="shooting-star-container"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="shooting-star"
                  style={{
                    width: `${star.size * 20}px`,
                    height: `${star.size}px`,
                    boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(248, 245, 255, 0.8)`,
                    transform: `rotate(${star.angle}deg)`,
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [`0%`, `${Math.cos(star.angle * Math.PI / 180) * 100}%`],
                    y: [`0%`, `${Math.sin(star.angle * Math.PI / 180) * 100}%`]
                  }}
                  transition={{
                    duration: star.duration,
                    delay: star.delay,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}
      
      {/* Contenu de la page */}
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}