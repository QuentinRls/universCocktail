// Types
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Cocktail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[] | string[];
  instructions?: string[];
  alcoholDegree: number;
  isAlcoholic: boolean;
  preparationTime?: string;
  difficulty?: 'facile' | 'moyen' | 'difficile';
  glassType?: string;
  tags?: string[];
  types?: string[];
  flavors?: string[];
  categories?: string[];
  galaxyOrigin?: string; // Planète ou système stellaire d'origine
  celestialEffect?: string; // Effet visuel galactique unique
  starRating?: number; // Note sur 5 étoiles
  pricePerCocktail?: number; // Prix estimé par cocktail
  priceRange?: string; // Plage de prix (format "X-Y")
}

// Import cocktails data from JSON file
import cocktailsData from '../ressources/cocktails_200_full_v2.json';

// Convert the imported JSON data to Cocktail type
const cocktails: Cocktail[] = cocktailsData.filter(item => item && item.id) as Cocktail[];

// Pour débogage - affiche le nombre de cocktails chargés
console.log(`Nombre de cocktails chargés: ${cocktails.length}`);

// Simplified version for card display
export const getCocktailsForCards = (): Cocktail[] => {
  return cocktails.map(cocktail => ({
    id: cocktail.id,
    name: cocktail.name,
    description: cocktail.description,
    imageUrl: cocktail.imageUrl,
    ingredients: Array.isArray(cocktail.ingredients) 
      ? cocktail.ingredients.map(ing => typeof ing === 'string' ? ing : ing.name).filter(Boolean)
      : [],
    alcoholDegree: cocktail.alcoholDegree,
    isAlcoholic: cocktail.isAlcoholic,
    types: cocktail.types || [],
    flavors: cocktail.flavors || [],
    categories: cocktail.categories || []
  }));
};

// Get a specific cocktail by ID
export const getCocktailById = (id: string): Cocktail | undefined => {
  return cocktails.find(cocktail => cocktail.id === id);
};

// Filter cocktails by category
export const getCocktailsByCategory = (categoryId: string): Cocktail[] => {
  // Définir des mappings pour chaque catégorie
  const categoryMappings: Record<string, string[]> = {
    "rhum": ["rum", "light rum", "dark rum", "white rum", "rums", "rhum"],
    "vodka": ["vodka"],
    "gin": ["gin", "sloe gin"],
    "tequila": ["tequila"],
    "whisky": ["whiskey", "scotch", "bourbon", "rye", "rye whiskey", "whisky"],
    "sans-alcool": [],  // Nous traiterons cette catégorie spécialement
    "classiques": ["classic"]
  };
  
  // Traitement spécial pour les cocktails sans alcool
  if (categoryId === "sans-alcool") {
    return cocktails.filter(cocktail => !cocktail.isAlcoholic);
  }
  
  // Obtenir les termes correspondants pour cette catégorie
  const categoryTerms = categoryMappings[categoryId] || [categoryId];
  
  // Filtrer les cocktails qui contiennent l'un des termes de la catégorie
  return cocktails.filter(cocktail => {
    if (!cocktail.categories || !Array.isArray(cocktail.categories)) {
      return false;
    }
    
    // Vérifier si l'une des catégories du cocktail correspond à l'un des termes
    return cocktail.categories.some(cat => 
      categoryTerms.some(term => 
        cat.toLowerCase().includes(term.toLowerCase())
      )
    );
  });
};

// Search cocktails by query
export const searchCocktails = (query: string): Cocktail[] => {
  const lowercaseQuery = query.toLowerCase();
  return cocktails.filter(cocktail => {
    // Vérifier le nom
    if (cocktail.name && cocktail.name.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Vérifier les ingrédients avec une gestion sécurisée
    if (Array.isArray(cocktail.ingredients) && cocktail.ingredients.some(ing => {
      if (typeof ing === 'string') {
        return ing.toLowerCase().includes(lowercaseQuery);
      } else if (ing && typeof ing === 'object' && ing.name) {
        return ing.name.toLowerCase().includes(lowercaseQuery);
      }
      return false;
    })) {
      return true;
    }
    
    // Vérifier la description
    if (cocktail.description && cocktail.description.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Vérifier les tags
    if (Array.isArray(cocktail.tags) && cocktail.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) {
      return true;
    }
    
    // Vérifier les catégories
    if (Array.isArray(cocktail.categories) && cocktail.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))) {
      return true;
    }
    
    return false;
  });
};

// Get cocktail suggestions based on partial query
export const getCocktailSuggestions = (query: string, limit: number = 5): { id: string, name: string }[] => {
  if (!query || query.trim().length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  // Prioritize matches at the beginning of the name
  const prioritizedResults = cocktails
    .filter(cocktail => cocktail.name && cocktail.name.toLowerCase().startsWith(lowercaseQuery))
    .map(cocktail => ({ id: cocktail.id, name: cocktail.name }))
    .slice(0, limit);
  
  // If we have enough prioritized results, return them
  if (prioritizedResults.length >= limit) {
    return prioritizedResults;
  }
  
  // Otherwise, add matches that include the query anywhere in the name
  const remainingLimit = limit - prioritizedResults.length;
  const additionalResults = cocktails
    .filter(cocktail => 
      cocktail.name && 
      cocktail.name.toLowerCase().includes(lowercaseQuery) &&
      !cocktail.name.toLowerCase().startsWith(lowercaseQuery)
    )
    .map(cocktail => ({ id: cocktail.id, name: cocktail.name }))
    .slice(0, remainingLimit);
  
  return [...prioritizedResults, ...additionalResults];
};

// Featured cocktails for homepage
export const getFeaturedCocktails = (): Cocktail[] => {
  return cocktails.slice(0, 3).map(cocktail => ({
    id: cocktail.id,
    name: cocktail.name,
    description: cocktail.description,
    imageUrl: cocktail.imageUrl,
    ingredients: [], // No need for ingredients in featured display
    alcoholDegree: cocktail.alcoholDegree,
    isAlcoholic: cocktail.isAlcoholic
  }));
};

// Category definitions
export interface Category {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { id: "rhum", name: "Rhum", description: "Cocktails à base de rhum, souvent associés aux saveurs tropicales" },
  { id: "vodka", name: "Vodka", description: "Cocktails à base de vodka, une base neutre qui se marie avec de nombreuses saveurs" },
  { id: "gin", name: "Gin", description: "Cocktails à base de gin, aux notes aromatiques et herbacées" },
  { id: "tequila", name: "Tequila", description: "Cocktails à base de tequila, souvent vifs et audacieux" },
  { id: "whisky", name: "Whisky", description: "Cocktails à base de whisky, avec des saveurs robustes et complexes" },
  { id: "sans-alcool", name: "Sans alcool", description: "Délicieux cocktails sans alcool pour tous" },
  { id: "classiques", name: "Classiques", description: "Les grands classiques de la mixologie qui ont traversé le temps" }
];

export const getCategories = (): Category[] => {
  return categories;
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Mock favorites data functions
const getFavoritesFromStorage = (): string[] => {
  if (typeof window !== 'undefined') {
    const savedFavorites = localStorage.getItem('cocktailFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  }
  return [];
};

const saveFavoritesToStorage = (favoriteIds: string[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cocktailFavorites', JSON.stringify(favoriteIds));
  }
};

export const addToFavorites = (cocktailId: string): void => {
  const currentFavorites = getFavoritesFromStorage();
  if (!currentFavorites.includes(cocktailId)) {
    const newFavorites = [...currentFavorites, cocktailId];
    saveFavoritesToStorage(newFavorites);
  }
};

export const removeFromFavorites = (cocktailId: string): void => {
  const currentFavorites = getFavoritesFromStorage();
  const newFavorites = currentFavorites.filter(id => id !== cocktailId);
  saveFavoritesToStorage(newFavorites);
};

export const isInFavorites = (cocktailId: string): boolean => {
  const currentFavorites = getFavoritesFromStorage();
  return currentFavorites.includes(cocktailId);
};

export const getFavoriteCocktails = (): Cocktail[] => {
  const favoriteIds = getFavoritesFromStorage();
  return cocktails.filter(cocktail => favoriteIds.includes(cocktail.id));
};

export default {
  getCocktailsForCards,
  getCocktailById,
  getCocktailsByCategory,
  searchCocktails,
  getCocktailSuggestions,
  getFeaturedCocktails,
  getCategories,
  getCategoryById,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  getFavoriteCocktails
};