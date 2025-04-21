// Composant de sélection de cocktails
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaTrash, FaDownload } from 'react-icons/fa';
import { SelectedCocktailWithQuantity } from './types';
import { calculateIngredientsSummary, generateIngredientsListText, downloadTextFile } from './calculUtils';
import '@/styles/components/cocktailatrice/CocktailSelection.css';

interface CocktailSelectionProps {
  selectedCocktails: SelectedCocktailWithQuantity[];
  onReset: () => void;
  onRemove: (index: number) => void;
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
}

const CocktailSelection = ({
  selectedCocktails,
  onReset,
  onRemove,
  onIncrease,
  onDecrease
}: CocktailSelectionProps) => {
  console.log("Selected Cocktails:", selectedCocktails); // Debugging line to check the selected cocktails
  const ingredientsSummary = calculateIngredientsSummary(selectedCocktails);

  return (
    <div className="selection-container">
      <div className="selection-header">
        <h3 className="selection-title">Ma sélection</h3>
        {selectedCocktails.length > 0 && (
          <button
            onClick={onReset}
            className="reset-button"
          >
            <FaTrash className="icon-xs" />
            <span>Vider</span>
          </button>
        )}
      </div>
      
      {selectedCocktails.length > 0 ? (
        <div className="selection-content">
          {/* Résumé des ingrédients */}
          <div className="ingredients-summary cosmic-border">
            <h4 className="ingredients-title">Résumé des ingrédients</h4>
            <div className="ingredients-list">
              <div>
                {ingredientsSummary.map((ingredient, idx) => (
                  <div 
                    key={idx} 
                    className="ingredient-item"
                  >
                    <div className="ingredient-name">{ingredient.name}</div>
                    <div className="ingredient-quantity">
                      {ingredient.quantity.toFixed(2)} {ingredient.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {ingredientsSummary.length > 0 && (
              <button
                onClick={() => {
                  const listText = generateIngredientsListText(ingredientsSummary);
                  downloadTextFile(listText, "liste_ingredients_cocktails.txt");
                }}
                className="download-button"
              >
                <FaDownload className="icon-xs" />
                <span>Récupérer la liste</span>
              </button>
            )}
          </div>
          
          {/* Liste des cocktails sélectionnés */}
          <h4 className="selected-cocktails-title">Cocktails sélectionnés</h4>
          <div className="selected-cocktails-list">
            {selectedCocktails.map((cocktail, index) => (
              <div 
                key={index}
                className="selected-cocktail-item cosmic-border"
              >
                <div className="cocktail-info">
                  <div className="cocktail-name">{cocktail.name}</div>
                  <div className="cocktail-quantity">Quantité: {cocktail.quantity}</div>
                </div>
                <div className="cocktail-actions">
                  <div className="cocktail-price">
                    {(cocktail.ingredients.reduce((sum, ingredient) => 
                      sum + ingredient.quantity * ingredient.price, 0)/10 * cocktail.quantity).toFixed(2)} €
                  </div>
                  <button
                    onClick={() => onDecrease(index)}
                    className="action-button"
                  >
                    <FaMinus className="icon-xs" />
                  </button>
                  <button
                    onClick={() => onIncrease(index)}
                    className="action-button"
                  >
                    <FaPlus className="icon-xs" />
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="action-button"
                  >
                    <FaTrash className="icon-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-selection cosmic-border">
          Aucun cocktail sélectionné
        </div>
      )}
    </div>
  );
};

export default CocktailSelection;