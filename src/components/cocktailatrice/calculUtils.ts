// Fonctions de calcul et utilitaires pour la cocktailatrice
import { SelectedCocktailWithQuantity, CocktailResult, IngredientSummary } from './types';
import { unitConversions } from './priceUtils';

// Fonction pour formater les plages de prix
export const formatPriceRange = (price: number): string => {
  // Arrondir à deux décimales
  const roundedPrice = Math.round(price * 100) / 100;
  
  // Créer une plage de prix (±1€)
  const minPrice = Math.max(0, roundedPrice - 1);
  const maxPrice = roundedPrice + 1;
  
  return `${minPrice.toFixed(0)}-${maxPrice.toFixed(0)}€`;
};

// Fonction pour calculer le résumé des ingrédients
export const calculateIngredientsSummary = (cocktails: SelectedCocktailWithQuantity[]) => {
  if (cocktails.length === 0) return [];
  
  // Map pour stocker les ingrédients regroupés
  const ingredientsMap: Record<string, { 
    name: string, 
    quantity: number, 
    unit: string, 
    price: number,
    calories: number 
  }> = {};
  
  // Parcourir tous les cocktails et leurs ingrédients
  cocktails.forEach(cocktail => {
    cocktail.ingredients.forEach(ingredient => {
      const ingredientKey = `${ingredient.name}-${ingredient.unit}`;
      const totalQuantity = ingredient.quantity * cocktail.quantity;
      
      if (ingredientsMap[ingredientKey]) {
        // Mettre à jour la quantité si l'ingrédient existe déjà
        ingredientsMap[ingredientKey].quantity += totalQuantity;
        ingredientsMap[ingredientKey].calories += ingredient.calories * cocktail.quantity;
      } else {
        // Ajouter un nouvel ingrédient
        ingredientsMap[ingredientKey] = {
          name: ingredient.name,
          quantity: totalQuantity,
          unit: ingredient.unit,
          // Correction: Diviser par 10 car le prix est en €/10ml
          price: (ingredient.price * totalQuantity) / 10,
          calories: ingredient.calories * cocktail.quantity
        };
      }
    });
  });

  // Convertir le map en tableau et trier par nom
  return Object.values(ingredientsMap).sort((a, b) => a.name.localeCompare(b.name));
};

// Fonction pour calculer les résultats détaillés par cocktail
export const calculateResults = (cocktails: SelectedCocktailWithQuantity[]): {
  calculatedResults: CocktailResult[];
  totalCost: number;
  totalCalories: number;
} => {
  if (cocktails.length === 0) {
    return {
      calculatedResults: [],
      totalCost: 0,
      totalCalories: 0
    };
  }
  
  const calculatedResults: CocktailResult[] = [];
  let calculatedTotalCost = 0;
  let calculatedTotalCalories = 0;
  
  // Calculer les détails pour chaque cocktail sélectionné
  for (const selectedCocktail of cocktails) {
    // Calculer le volume total (approximatif)
    let totalVolume = 0;
    for (const ingredient of selectedCocktail.ingredients) {
      const conversionFactor = unitConversions[ingredient.unit] || 0;
      totalVolume += ingredient.quantity * conversionFactor * selectedCocktail.quantity;
    }
    
    // Calculer le prix total
    // Correction: Diviser par 10 car le prix est en €/10ml
    const totalPrice = selectedCocktail.ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.quantity / 10) * ingredient.price * selectedCocktail.quantity,
      0
    );
    calculatedTotalCost += totalPrice;
    
    // Calculer les calories totales
    const totalCalories = selectedCocktail.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.calories * selectedCocktail.quantity,
      0
    );
    calculatedTotalCalories += totalCalories;
    
    // Calculer le pourcentage d'alcool (très approximatif)
    const alcoholVolume = selectedCocktail.ingredients
      .filter(ing => ing.isAlcoholic && unitConversions[ing.unit] > 0)
      .reduce((sum, ing) => sum + ing.quantity * unitConversions[ing.unit] * selectedCocktail.quantity, 0);
    
    const alcoholicPercentage = totalVolume > 0 
      ? Math.round((alcoholVolume / totalVolume) * 100) 
      : 0;
    
    // Prix formaté pour correspondre au format du JSON (plage de prix)
    const formattedPriceRange = formatPriceRange(totalPrice / selectedCocktail.quantity);
    
    calculatedResults.push({
      name: selectedCocktail.name,
      quantity: selectedCocktail.quantity,
      ingredients: selectedCocktail.ingredients.map(ing => ({...ing, quantity: ing.quantity * selectedCocktail.quantity})),
      totalVolume: Math.round(totalVolume * 10) / 10, // Arrondi à 1 décimale
      totalPrice: Math.round(totalPrice * 100) / 100, // Arrondi à 2 décimales
      totalCalories: Math.round(totalCalories), // Calories totales
      pricePerCocktail: Math.round((totalPrice / selectedCocktail.quantity) * 100) / 100,
      caloriesPerCocktail: Math.round(totalCalories / selectedCocktail.quantity), // Calories par cocktail
      alcoholicPercentage,
      formattedPriceRange
    });
  }
  
  return {
    calculatedResults,
    totalCost: Math.round(calculatedTotalCost * 100) / 100,
    totalCalories: Math.round(calculatedTotalCalories)
  };
};

// Fonction pour convertir les unités selon les critères de téléchargement
export const convertQuantityForDownload = (quantity: number, unit: string): { quantity: number, unit: string } => {
  // Convertir en ml pour standardiser
  const mlConversion: Record<string, number> = {
    'ml': 1,
    'cl': 10,
    'l': 1000,
    'oz': 30,
    'dash': 0.5,
    'dashes': 0.5,
    'trait': 0.5,
    'gouttes': 0.1,
    'cuillère à café': 5,
    'cuillères à café': 5,
    'cuillère à soupe': 15,
    'cuillères à soupe': 15,
  };

  // Si l'unité n'est pas connue, retourner les valeurs inchangées
  if (!mlConversion[unit]) {
    return { quantity, unit };
  }

  // Convertir en ml
  const valueInMl = quantity * mlConversion[unit];

  // Appliquer les critères de conversion
  if (valueInMl > 1000) {
    return { quantity: valueInMl / 1000, unit: 'l' }; // Convertir en litres
  } else if (valueInMl > 100) {
    return { quantity: valueInMl / 10, unit: 'cl' }; // Convertir en cl
  } else {
    return { quantity: valueInMl, unit: 'ml' }; // Garder en ml
  }
};

// Fonction pour générer le texte de la liste d'ingrédients pour le téléchargement

export const generateIngredientsListText = (ingredientsSummary: IngredientSummary[]): string => {
  if (ingredientsSummary.length === 0) return "Aucun ingrédient sélectionné";

  const lines = ["Liste des ingrédients:", "========================"];
  
  // Catégories d'ingrédients
  type IngredientWithConversion = IngredientSummary & {
    quantityInMl: number;
    convertedQuantity: { quantity: number, unit: string };
  };

  const categories: Record<string, { title: string, ingredients: IngredientWithConversion[] }> = {
    strongAlcohol: { title: "ALCOOLS FORTS", ingredients: [] },
    liqueurs: { title: "LIQUEURS ET VINS", ingredients: [] },
    juices: { title: "JUS ET SODAS", ingredients: [] },
    syrups: { title: "SIROPS ET SUCRES", ingredients: [] },
    bitters: { title: "AMERS ET BITTERS", ingredients: [] },
    garnish: { title: "GARNITURES", ingredients: [] },
    others: { title: "AUTRES INGRÉDIENTS", ingredients: [] }
  };
  
  // Liste des mots-clés pour chaque catégorie
  const categoryKeywords: Record<string, string[]> = {
    strongAlcohol: [
      'vodka', 'gin', 'rhum', 'rum', 'whisky', 'whiskey', 'bourbon', 'tequila', 
      'cognac', 'brandy', 'scotch', 'mezcal', 'absinthe', 'eau-de-vie', 'rye'
    ],
    liqueurs: [
      'liqueur', 'crème de', 'cointreau', 'triple sec', 'vermouth', 'porto', 'vin', 
      'champagne', 'prosecco', 'amaretto', 'baileys', 'kahlua', 'grand marnier',
      'chartreuse', 'benedictine', 'cherry heering', 'maraschino', 'aperol', 'campari'
    ],
    juices: [
      'jus', 'juice', 'citron', 'lime', 'orange', 'ananas', 'pineapple', 'cranberry',
      'tomate', 'pomme', 'pamplemousse', 'grapefruit', 'cola', 'soda', 'tonic', 
      'ginger ale', 'ginger beer', 'eau gazeuse', 'perrier', 'schweppes'
    ],
    syrups: [
      'sirop', 'syrup', 'grenadine', 'orgeat', 'sucre', 'sugar', 'miel', 'honey',
      'agave', 'érable', 'maple', 'gomme', 'canne'
    ],
    bitters: [
      'bitter', 'angostura', 'peychaud', 'orange bitter', 'amer'
    ],
    garnish: [
      'zeste', 'tranche', 'rondelle', 'twist', 'feuille', 'menthe', 'mint', 'basilic',
      'cerise', 'cherry', 'olive', 'oignon', 'citron vert', 'lime', 'sel', 'salt', 
      'poivre', 'pepper', 'cannelle', 'muscade', 'glace', 'ice'
    ]
  };
  
  // Convertir les quantités en ml pour la standardisation et le tri
  const ingredientsWithConversion = ingredientsSummary.map(ingredient => {
    const mlConversion: Record<string, number> = {
      'ml': 1,
      'cl': 10,
      'l': 1000,
      'oz': 30,
      'dash': 0.5,
      'dashes': 0.5,
      'trait': 0.5,
      'gouttes': 0.1,
      'cuillère à café': 5,
      'cuillères à café': 5,
      'cuillère à soupe': 15,
      'cuillères à soupe': 15,
    };
    
    const conversionFactor = mlConversion[ingredient.unit] || 1;
    const quantityInMl = ingredient.quantity * conversionFactor;
    
    // Convertir la quantité selon les critères demandés
    const convertedQuantity = convertQuantityForDownload(ingredient.quantity, ingredient.unit);
    
    return {
      ...ingredient,
      quantityInMl,
      convertedQuantity
    };
  });
  
  // Classer chaque ingrédient dans sa catégorie
  ingredientsWithConversion.forEach(ingredient => {
    const ingredientName = ingredient.name.toLowerCase();
    let categorized = false;
    
    // Parcourir les catégories et leurs mots-clés
    for (const [categoryKey, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => ingredientName.includes(keyword))) {
        categories[categoryKey].ingredients.push(ingredient);
        categorized = true;
        break;
      }
    }
    
    // Si l'ingrédient n'a pas été catégorisé, le mettre dans "autres"
    if (!categorized) {
      categories.others.ingredients.push(ingredient);
    }
  });
  
  // Trier les ingrédients par quantité décroissante dans chaque catégorie
  for (const category of Object.values(categories)) {
    category.ingredients.sort((a, b) => b.quantityInMl - a.quantityInMl);
  }
  
  // Générer le texte formaté par catégorie
  for (const category of Object.values(categories)) {
    if (category.ingredients.length > 0) {
      // Ajouter un séparateur si ce n'est pas la première catégorie
      if (lines.length > 2) {
        lines.push("");
      }
      
      // Ajouter le titre de la catégorie
      lines.push(category.title);
      lines.push("-".repeat(category.title.length));
      
      // Ajouter les ingrédients de cette catégorie
      category.ingredients.forEach(ingredient => {
        const { quantity, unit } = ingredient.convertedQuantity;
        lines.push(`${ingredient.name}: ${quantity.toFixed(2)} ${unit}`);
      });
    }
  }
  
  return lines.join('\n');
};

// Fonction pour télécharger un fichier texte
export const downloadTextFile = (text: string, filename: string): void => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};