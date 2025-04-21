// Composant de recherche de cocktails
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaGlassMartini, FaPlus, FaMinus } from 'react-icons/fa';
import { Cocktail as CocktailType } from '@/services/cocktailService';
import { Ingredient } from './types';

interface CocktailSearchProps {
  allCocktails: CocktailType[];
  searchQuery: string;
  currentCocktailId: string;
  currentCocktailQuantity: number;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCocktailSelect: (cocktailId: string) => void;
  onAddToSelection: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

const CocktailSearch = ({
  allCocktails,
  searchQuery,
  currentCocktailId,
  currentCocktailQuantity,
  onSearch,
  onCocktailSelect,
  onAddToSelection,
  onIncreaseQuantity,
  onDecreaseQuantity
}: CocktailSearchProps) => {
  // Filtrer les cocktails en fonction de la recherche
  const filteredCocktails = searchQuery.trim() === '' 
    ? allCocktails 
    : allCocktails.filter(cocktail => 
        cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(cocktail.ingredients) && 
          cocktail.ingredients.some(ing => 
            ing.toString().toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );

  // Variable d'animation
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="card-galactic p-6">
      <h2 className="text-2xl font-title text-space-cyan mb-6">Rechercher un Cocktail</h2>
      
      {/* Champ de recherche */}
      <div className="relative mb-6">
        <input 
          type="text"
          value={searchQuery}
          onChange={onSearch}
          placeholder="Nom du cocktail ou ingrédient..."
          className="w-full bg-space-dark/70 border border-space-purple/30 rounded-lg p-3 pl-10 text-space-star focus:border-space-purple/80 focus:ring-2 focus:ring-space-purple/30"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-space-purple/50" />
      </div>
      
      {/* Liste des cocktails filtrés */}
      <div className="mb-6 max-h-60 overflow-y-auto space-y-2 pr-2 cosmic-border rounded-lg p-3">
        {filteredCocktails.length > 0 ? (
          filteredCocktails.map((cocktail) => (
            <motion.button
              key={cocktail.id}
              onClick={() => onCocktailSelect(cocktail.id)}
              className={`w-full p-3 text-left rounded-lg transition-all duration-300 flex items-center gap-3 ${
                currentCocktailId === cocktail.id 
                  ? 'bg-space-nebula/70 border border-space-purple/50' 
                  : 'bg-space-dark/70 border border-space-purple/20 hover:bg-space-nebula/30'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-space-purple to-space-blue flex items-center justify-center flex-shrink-0">
                <FaGlassMartini className="text-space-star text-xs" />
              </div>
              <div className="overflow-hidden"> 
                <div className="font-medium truncate">{cocktail.name}</div>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-4 text-space-star/70">
            Aucun cocktail trouvé
          </div>
        )}
      </div>
      
      {/* Affichage du cocktail sélectionné */}
      {currentCocktailId && (
        <div className="mb-6 cosmic-border rounded-lg p-4 bg-space-nebula/10">
          <h3 className="text-lg font-title text-space-cyan mb-3">Cocktail sélectionné</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="text-space-star font-medium">
              {allCocktails.find(c => c.id === currentCocktailId)?.name}
            </div>
            <div className="flex items-center">
              <button 
                onClick={onDecreaseQuantity}
                disabled={currentCocktailQuantity <= 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentCocktailQuantity <= 1 
                    ? 'bg-space-purple/30 text-space-star/50 cursor-not-allowed' 
                    : 'bg-space-purple/50 text-space-star hover:bg-space-purple/70'
                } transition-colors`}
              >
                <FaMinus className="text-xs" />
              </button>
              
              <div className="w-10 text-center mx-1">
                <span className="text-space-star">{currentCocktailQuantity}</span>
              </div>
              
              <button 
                onClick={onIncreaseQuantity}
                className="w-8 h-8 rounded-full bg-space-purple/50 text-space-star hover:bg-space-purple/70 flex items-center justify-center transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
          </div>
          
          <button
            onClick={onAddToSelection}
            className="w-full py-2 px-4 bg-gradient-to-r from-space-purple to-space-blue hover:brightness-110 text-white rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FaPlus className="text-xs" />
            <span>Ajouter à ma sélection</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CocktailSearch;