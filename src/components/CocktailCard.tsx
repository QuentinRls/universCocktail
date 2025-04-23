import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaGlassMartini, FaArrowLeft, FaSync } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import '@/styles/components/CocktailCard.css';

interface CocktailCardProps {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  alcoholDegree?: number;
  isAlcoholic: boolean;
  starRating?: number;
  galaxyOrigin?: string;
  celestialEffect?: string;
}

export default function CocktailCard({ 
  id, 
  name, 
  imageUrl, 
  ingredients, 
  alcoholDegree, 
  isAlcoholic,
  starRating = 0,
  galaxyOrigin,
  celestialEffect
}: CocktailCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Force la hauteur de la carte à être fixe pour garantir la visibilité du contenu au verso
  useEffect(() => {
    // Cette fonction égalise la hauteur de toutes les cartes
    const equalizeCardHeights = () => {
      // Sélectionner toutes les cartes dans le document
      const allCards = document.querySelectorAll('.card-container');
      if (allCards.length <= 1) return; // Ne rien faire s'il n'y a qu'une seule carte

      // Réinitialiser les hauteurs pour un calcul précis
      allCards.forEach(card => {
        (card as HTMLElement).style.height = 'auto';
      });
      
      // Délai pour permettre au DOM de se mettre à jour
      setTimeout(() => {
        // Trouver la hauteur maximale
        let maxHeight = 0;
        allCards.forEach(card => {
          const height = card.getBoundingClientRect().height;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        
        // Appliquer la hauteur maximale à toutes les cartes
        if (maxHeight > 0) {
          allCards.forEach(card => {
            (card as HTMLElement).style.height = `${maxHeight}px`;
          });
        }
      }, 100);
    };

    // Appliquer l'égalisation au chargement et au redimensionnement
    equalizeCardHeights();
    window.addEventListener('resize', equalizeCardHeights);
    
    // Nettoyage de l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', equalizeCardHeights);
    };
  }, []);

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      ref={cardRef}
      className="card-container"
      style={{ height: '100%', minHeight: '490px' }}
    >
      <motion.div 
        className={`card-galactic flip-card-container ${isFlipped ? 'flipped' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ boxShadow: '0 0 15px rgba(107, 29, 206, 0.5)' }}
      >
        <div className="flip-card-inner">
          {/* Front of card */}
          <div className="flip-card-front">
            <Link href={`/cocktail/${id}`} className="card-link" onClick={(e) => isFlipped && e.preventDefault()}>
              <div className="card-image-wrapper">
                <Image 
                  src={imageUrl} 
                  alt={name} 
                  fill 
                  className="card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!isAlcoholic && (
                  <span className="card-badge">
                    Sans alcool
                  </span>
                )}
                {alcoholDegree !== undefined && (
                  <span className="card-alcohol-degree">
                    <FaGlassMartini className="text-space-cyan icon-size-small" />
                    {alcoholDegree}° d&#39;alcool
                  </span>
                )}
                
                {/* Effet céleste */}
                {celestialEffect && (
                  <motion.div 
                    className="card-celestial-effect"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                )}
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{name}</h3>
                
                {/* Affichage des étoiles */}
                {starRating > 0 && (
                  <div className="card-star-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(starRating) ? "text-space-cyan" : "text-space-dark"} 
                        size={14}
                      />
                    ))}
                    <span className="card-star-rating-value">{starRating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Origine galactique */}
                {galaxyOrigin && (
                  <div className="card-origin">
                    Origine: {galaxyOrigin}
                  </div>
                )}
                
                <div className="card-ingredients-container">
                  {ingredients.slice(0, 3).map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="card-ingredient-tag"
                    >
                      {ingredient}
                    </span>
                  ))}
                  {ingredients.length > 3 && (
                    <span className="card-ingredients-more">+{ingredients.length - 3}</span>
                  )}
                </div>
              </div>
            </Link>
            
            {/* Bouton de flip */}
            <button 
              className="flip-button"
              onClick={handleFlip}
              aria-label="Voir plus de détails"
            >
              <FaSync className="flip-icon" />
            </button>
          </div>
          
          {/* Back of card */}
          <div className="flip-card-back">
            <div className="back-content">
              <h3 className="back-title">{name}</h3>
              
              <div className="back-details">
                <div className="back-section">
                  <h4 className="back-section-title">Ingrédients</h4>
                  <ul className="back-ingredients-list">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="back-ingredient-item">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="back-info">
                  {alcoholDegree !== undefined && (
                    <div className="back-info-item">
                      <span className="back-info-label">Degré d'alcool:</span>
                      <span className="back-info-value">{alcoholDegree}°</span>
                    </div>
                  )}
                  
                  <div className="back-info-item">
                    <span className="back-info-label">Type:</span>
                    <span className="back-info-value">{isAlcoholic ? 'Alcoolisé' : 'Sans alcool'}</span>
                  </div>
                  
                  {galaxyOrigin && (
                    <div className="back-info-item">
                      <span className="back-info-label">Origine:</span>
                      <span className="back-info-value">{galaxyOrigin}</span>
                    </div>
                  )}
                  
                  {starRating > 0 && (
                    <div className="back-info-item">
                      <span className="back-info-label">Évaluation:</span>
                      <span className="back-info-value back-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.floor(starRating) ? "text-space-cyan" : "text-space-dark"} 
                            size={12}
                            style={{display: 'inline', marginRight: '2px'}}
                          />
                        ))}
                      </span>
                    </div>
                  )}
                </div>
                
                <Link href={`/cocktail/${id}`} className="back-link">
                  Voir la recette complète
                </Link>
              </div>
            </div>
            
            {/* Bouton pour revenir à la face avant */}
            <button 
              className="flip-button back-flip-button"
              onClick={handleFlip}
              aria-label="Retourner à la présentation"
            >
              <FaArrowLeft className="flip-icon" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}