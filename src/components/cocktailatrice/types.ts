// Types et interfaces pour la cocktailatrice
export interface IngredientPrice {
  ingredient: string;
  volume_ml: number;
  price_eur: number;
  eur_per_10ml: number;
  eur_per_litre: number;
  source: string;
  date: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  calories: number; // Ajout des calories par unité
  isAlcoholic: boolean;
}

export interface CocktailResult {
  name: string;
  quantity: number;
  ingredients: Ingredient[];
  totalVolume: number;
  totalPrice: number;
  totalCalories: number; // Ajout des calories totales
  pricePerCocktail: number;
  caloriesPerCocktail: number; // Ajout des calories par cocktail
  alcoholicPercentage: number;
  formattedPriceRange?: string; // Format compatible avec le JSON (ex: "5-7€")
}

export interface SelectedCocktailWithQuantity {
  id: string;
  name: string;
  quantity: number;
  ingredients: Ingredient[];
  totalPrice: number;
  totalCalories?: number; // Ajout des calories totales (optionnel)
}