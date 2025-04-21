import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaGlassMartini } from 'react-icons/fa';
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
  return (
    <motion.div 
      className="card-galactic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: '0 0 15px rgba(107, 29, 206, 0.5)' }}
    >
      <Link href={`/cocktail/${id}`} className="card-link">
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
    </motion.div>
  );
}