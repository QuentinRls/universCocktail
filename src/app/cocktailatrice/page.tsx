'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { getCocktailsForCards, getCocktailById, Cocktail as CocktailType } from '@/services/cocktailService';

// Importation des composants
import CocktailSearch from '@/components/cocktailatrice/CocktailSearch';
import CocktailSelection from '@/components/cocktailatrice/CocktailSelection';
import ResultDisplay from '@/components/cocktailatrice/ResultDisplay';

// Importation des utilitaires
import { convertIngredientToCocktailatrice } from '@/components/cocktailatrice/priceUtils';
import { calculateResults } from '@/components/cocktailatrice/calculUtils';
import { Ingredient, SelectedCocktailWithQuantity, CocktailResult } from '@/components/cocktailatrice/types';

export default function CocktailatricePage() {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [allCocktails, setAllCocktails] = useState<CocktailType[]>([]);
  
  // État pour les cocktails sélectionnés
  const [selectedCocktails, setSelectedCocktails] = useState<SelectedCocktailWithQuantity[]>([]);
  
  // État pour le cocktail courant
  const [currentCocktailId, setCurrentCocktailId] = useState('');
  const [currentCocktailQuantity, setCurrentCocktailQuantity] = useState(1);
  const [currentRecipe, setCurrentRecipe] = useState<Ingredient[]>([]);

  // État pour le résultat
  const [showResult, setShowResult] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [results, setResults] = useState<CocktailResult[]>([]);

    // Initialiser la sélection depuis l'IA si présente dans le localStorage
  useEffect(() => {
    if (selectedCocktails.length === 0 && typeof window !== 'undefined') {
      const aiSuggestion = localStorage.getItem('aiSuggestion');
      if (aiSuggestion) {
        try {
          const cocktails = JSON.parse(aiSuggestion);
          const newSelection = cocktails.map((c: any) => {
            const cocktailData = getCocktailById(c.id);
            const ingredients = cocktailData && Array.isArray(cocktailData.ingredients)
              ? cocktailData.ingredients.map(convertIngredientToCocktailatrice)
              : [];
            const totalPrice = ingredients.reduce(
              (sum, ingredient) => sum + ingredient.quantity * ingredient.price * c.quantite,
              0
            );
            const totalCalories = ingredients.reduce(
              (sum, ingredient) => sum + ingredient.calories * c.quantite,
              0
            );
            return {
              id: c.id,
              name: c.nom,
              quantity: c.quantite,
              ingredients,
              totalPrice,
              totalCalories
            };
          });
          setSelectedCocktails(newSelection);
          updateResults(newSelection);
          localStorage.removeItem('aiSuggestion');
        } catch (e) {
          // Optionally handle error
        }
      }
    }
    // eslint-disable-next-line
  }, []);
  
  // Charger les cocktails disponibles
  useEffect(() => {
    const cocktails = getCocktailsForCards();
    setAllCocktails(cocktails);
  }, []);
  
  // Gérer la recherche de cocktails
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Sélectionner un cocktail
  const handleCocktailSelect = (cocktailId: string) => {
    setCurrentCocktailId(cocktailId);
    setCurrentCocktailQuantity(1);
    
    // Récupérer le cocktail depuis le service
    const cocktail = getCocktailById(cocktailId);
    
    if (cocktail && Array.isArray(cocktail.ingredients) && cocktail.ingredients.length > 0) {
      // Convertir les ingrédients au format de la cocktailatrice
      const ingredients = cocktail.ingredients.map(convertIngredientToCocktailatrice);
      setCurrentRecipe(ingredients);
      
      // Ajouter automatiquement le cocktail à la sélection
      addToSelection(cocktailId, ingredients, 1, cocktail.name);
    } else {
      setCurrentRecipe([]);
    }
  };

  // Fonction pour ajouter directement à la sélection
  const addToSelection = (cocktailId: string, ingredients: Ingredient[], quantity: number, cocktailName: string) => {
    // Calculer le prix total pour ce cocktail
    const totalPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.quantity * ingredient.price * quantity,
      0
    );
    
    // Calculer les calories totales pour ce cocktail
    const totalCalories = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.calories * quantity,
      0
    );
    
    // Vérifier si ce cocktail est déjà dans la sélection
    const existingIndex = selectedCocktails.findIndex(c => c.id === cocktailId);
    
    if (existingIndex >= 0) {
      // Mettre à jour la quantité si le cocktail est déjà sélectionné
      const updatedCocktails = [...selectedCocktails];
      updatedCocktails[existingIndex].quantity += quantity;
      updatedCocktails[existingIndex].totalPrice += totalPrice;
      updatedCocktails[existingIndex].totalCalories = (updatedCocktails[existingIndex].totalCalories || 0) + totalCalories;
      
      setSelectedCocktails(updatedCocktails);
      
      // Recalculer immédiatement le résultat
      updateResults(updatedCocktails);
    } else {
      // Ajouter un nouveau cocktail à la sélection
      const newSelectedCocktails = [
        ...selectedCocktails,
        {
          id: cocktailId,
          name: cocktailName,
          quantity: quantity,
          ingredients: JSON.parse(JSON.stringify(ingredients)),
          totalPrice: totalPrice,
          totalCalories: totalCalories
        }
      ];
      
      setSelectedCocktails(newSelectedCocktails);
      
      // Recalculer immédiatement le résultat
      updateResults(newSelectedCocktails);
    }
    
    // Réinitialiser les champs
    setCurrentCocktailId('');
    setCurrentCocktailQuantity(1);
    setCurrentRecipe([]);
  };

  // Ajouter un cocktail à la liste des sélectionnés
  const addCocktailToSelection = () => {
    if (!currentCocktailId || currentRecipe.length === 0) return;
    
    // Récupérer le cocktail depuis le service
    const cocktail = getCocktailById(currentCocktailId);
    
    if (cocktail) {
      addToSelection(currentCocktailId, currentRecipe, currentCocktailQuantity, cocktail.name);
    }
  };
  
  // Supprimer un cocktail de la sélection
  const removeCocktailFromSelection = (index: number) => {
    const newSelection = [...selectedCocktails];
    newSelection.splice(index, 1);
    setSelectedCocktails(newSelection);
    
    // Recalculer immédiatement le résultat
    updateResults(newSelection);
  };
  
  // Augmenter la quantité d'un cocktail déjà dans la sélection
  const increaseCocktailQuantity = (index: number) => {
    const updatedCocktails = [...selectedCocktails];
    const cocktail = updatedCocktails[index];
    
    // Augmenter la quantité
    cocktail.quantity += 1;
    
    // Recalculer le prix total pour ce cocktail
    const additionalPrice = cocktail.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.quantity * ingredient.price,
      0
    );
    cocktail.totalPrice += additionalPrice;
    
    // Recalculer les calories pour ce cocktail
    const additionalCalories = cocktail.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.calories,
      0
    );
    cocktail.totalCalories = (cocktail.totalCalories || 0) + additionalCalories;
    
    setSelectedCocktails(updatedCocktails);
    
    // Recalculer immédiatement le résultat
    updateResults(updatedCocktails);
  };
  
  // Diminuer la quantité d'un cocktail déjà dans la sélection
  const decreaseCocktailQuantity = (index: number) => {
    const updatedCocktails = [...selectedCocktails];
    const cocktail = updatedCocktails[index];
    
    if (cocktail.quantity > 1) {
      // Diminuer la quantité
      cocktail.quantity -= 1;
      
      // Recalculer le prix total pour ce cocktail
      const reducedPrice = cocktail.ingredients.reduce(
        (sum, ingredient) => sum + ingredient.quantity * ingredient.price,
        0
      );
      cocktail.totalPrice -= reducedPrice;
      
      // Recalculer les calories pour ce cocktail
      const reducedCalories = cocktail.ingredients.reduce(
        (sum, ingredient) => sum + ingredient.calories,
        0
      );
      cocktail.totalCalories = (cocktail.totalCalories || 0) - reducedCalories;
      
      setSelectedCocktails(updatedCocktails);
      
      // Recalculer immédiatement le résultat
      updateResults(updatedCocktails);
    } else {
      // Si la quantité est 1, supprimer le cocktail
      removeCocktailFromSelection(index);
    }
  };
  
  // Augmenter la quantité du cocktail courant
  const increaseCurrentQuantity = () => {
    setCurrentCocktailQuantity(prev => prev + 1);
  };
  
  // Diminuer la quantité du cocktail courant
  const decreaseCurrentQuantity = () => {
    if (currentCocktailQuantity > 1) {
      setCurrentCocktailQuantity(prev => prev - 1);
    }
  };
  
  // Réinitialiser la sélection
  const resetSelection = () => {
    setSelectedCocktails([]);
    setCurrentCocktailId('');
    setCurrentCocktailQuantity(1);
    setCurrentRecipe([]);
    setShowResult(false);
    setResults([]);
    setTotalCost(0);
    setTotalCalories(0);
  };

  // Fonction pour mettre à jour les résultats
  const updateResults = (cocktails: SelectedCocktailWithQuantity[]) => {
    if (cocktails.length === 0) {
      setShowResult(false);
      setResults([]);
      setTotalCost(0);
      setTotalCalories(0);
      return;
    }
    
    const { calculatedResults, totalCost: calculatedTotalCost, totalCalories: calculatedTotalCalories } = calculateResults(cocktails);
    
    setResults(calculatedResults);
    setTotalCost(calculatedTotalCost);
    setTotalCalories(calculatedTotalCalories);
    setShowResult(true);
  };

  // Variables d'animation pour les composants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-space-dark">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-title mb-6">Cocktailatrice Galactique</h1>
          <p className="text-space-star/80 max-w-2xl mx-auto">
            Calculez précisément les quantités, le budget et les calories nécessaires pour préparer vos cocktails stellaires préférés.
          </p>
        </motion.div>
        
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panneau de recherche et sélection */}
          <motion.div 
            className="w-full xl:w-1/3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="h-full flex flex-col">
              {/* Composant de recherche */}
              <CocktailSearch 
                allCocktails={allCocktails}
                searchQuery={searchQuery}
                currentCocktailId={currentCocktailId}
                currentCocktailQuantity={currentCocktailQuantity}
                onSearch={handleSearch}
                onCocktailSelect={handleCocktailSelect}
                onAddToSelection={addCocktailToSelection}
                onIncreaseQuantity={increaseCurrentQuantity}
                onDecreaseQuantity={decreaseCurrentQuantity}
              />
              
              {/* Composant de sélection */}
              <CocktailSelection 
                selectedCocktails={selectedCocktails}
                onReset={resetSelection}
                onRemove={removeCocktailFromSelection}
                onIncrease={increaseCocktailQuantity}
                onDecrease={decreaseCocktailQuantity}
              />
            </motion.div>
          </motion.div>
          
          {/* Affichage des résultats */}
          <motion.div 
            className="w-full xl:w-2/3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ResultDisplay 
              showResult={showResult}
              totalCost={totalCost}
              totalCalories={totalCalories}
              results={results}
              totalCocktailsCount={selectedCocktails.reduce((sum, item) => sum + item.quantity, 0)}
            />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}