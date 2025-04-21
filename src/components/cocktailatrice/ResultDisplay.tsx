// Composant d'affichage des résultats
import { FaShoppingBasket, FaFireAlt, FaWineGlassAlt, FaCoins } from 'react-icons/fa';
import { CocktailResult } from './types';
import '@/styles/components/cocktailatrice/ResultDisplay.css';

interface ResultDisplayProps {
  showResult: boolean;
  totalCost: number;
  totalCalories: number;
  results: CocktailResult[];
  totalCocktailsCount: number;
}

const ResultDisplay = ({
  showResult,
  totalCost,
  totalCalories,
  results,
  totalCocktailsCount
}: ResultDisplayProps) => {

  return (
    <>
      {showResult ? (
        <div className="card-galactic result-container">
          <div className="result-header">
            <h2 className="result-title">Résultat du calcul</h2>
            <div className="result-stats">
              <div className="stat-badge">
                <FaCoins className="stat-icon stat-icon-purple" />
                <span className="stat-label">Total: </span>
                <span className="stat-value">{totalCost.toFixed(2)} €</span>
              </div>
              <div className="stat-badge">
                <FaFireAlt className="stat-icon stat-icon-pink" />
                <span className="stat-label">Calories: </span>
                <span className="stat-value">{totalCalories} kcal</span>
              </div>
            </div>
          </div>

          <div className="cocktails-summary cosmic-border">
            <div className="cocktails-info">
              <div className="cocktails-icon-container">
                <FaShoppingBasket className="cocktails-icon" />
              </div>
              <div>
                <div className="cocktails-text">Cocktails sélectionnés</div>
                <div className="cocktails-subtext">
                  {totalCocktailsCount} cocktails au total
                </div>
              </div>
            </div>
          </div>

          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item cosmic-border">
                <h3 className="result-item-header">
                  <span>{result.name}</span>
                  {result.quantity > 1 && (
                    <span className="result-quantity">
                      ({result.quantity} cocktails)
                    </span>
                  )}
                </h3>

                <div className="result-content">
                  {/* Liste des ingrédients */}
                  <div className="result-section">
                    <h4 className="section-title">Ingrédients</h4>
                    <div className="card-galactic ingredients-list">
                      {result.ingredients.map((ingredient, idx) => (
                        <div
                          key={idx}
                          className="ingredient-item"
                        >
                          <div className="ingredient-name">{ingredient.name}</div>
                          <div className="ingredient-quantity">
                            {ingredient.quantity} {ingredient.unit}
                          </div>
                        </div>
                      ))}

                      <div className="ingredients-total">
                        <div className="total-label">Total</div>
                        <div className="total-value">
                          {result.totalVolume} cl
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Résumé des coûts et calories */}
                  <div className="result-section">
                    <h4 className="section-title">Informations</h4>

                    <div className="info-grid">
                      {/* Coût total */}
                      <div className="card-galactic info-card">
                        <div className="info-header">
                          <FaCoins className="info-header-icon stat-icon-purple" />
                          Coût total
                        </div>
                        <div className="info-value">{result.totalPrice.toFixed(2)} €</div>
                      </div>

                      {/* Coût par cocktail */}
                      <div className="card-galactic info-card">
                        <div className="info-header">
                          <FaWineGlassAlt className="info-header-icon stat-icon-purple" />
                          Coût par cocktail
                        </div>
                        <div className="info-value-standard">
                          {result.pricePerCocktail.toFixed(2)} € | entre{' '}
                          {result.formattedPriceRange}
                        </div>
                      </div>
                      
                      {/* Calories */}
                      <div className="card-galactic info-card">
                        <div className="info-header">
                          <FaFireAlt className="info-header-icon stat-icon-pink" />
                          Calories
                        </div>
                        <div className="info-details">
                          <div className="info-value-standard">
                            Total: {result.totalCalories} kcal
                          </div>
                          <div className="info-details-secondary">
                            ({result.caloriesPerCocktail} kcal/verre)
                          </div>
                        </div>
                      </div>
                      
                      {/* Pourcentage d'alcool */}
                      <div className="card-galactic info-card">
                        <div className="info-header">Pourcentage d&#39;alcool (approx.)</div>
                        <div className="info-value-standard">
                          {result.alcoholicPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-galactic empty-result">
          <div className="empty-icon-container">
            <FaShoppingBasket className="empty-icon" />
          </div>
          <h2 className="empty-title">Prêt à calculer</h2>
          <p className="empty-text">
            Recherchez et ajoutez vos cocktails préférés à votre sélection, puis cliquez sur &#34;Calculer le total&#34; pour voir les résultats.
          </p>
        </div>
      )}
    </>
  );
};

export default ResultDisplay;