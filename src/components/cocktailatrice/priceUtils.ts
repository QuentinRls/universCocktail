// Utilitaires pour les prix et conversions d'unités
import { Ingredient, IngredientPrice } from './types';
import ingredientPricesData from '@/ressources/cocktail_ingredients_prices_lot1_part2.json';
import { v4 as uuidv4 } from 'uuid';

// Formatage des données de prix pour faciliter la recherche
export const ingredientPrices: IngredientPrice[] = ingredientPricesData as IngredientPrice[];

// Calories par 10ml pour différents types d'ingrédients (valeurs approximatives)
export const caloriesData: Record<string, number> = {
  // Alcools (calories pour 10ml)
  'rhum': 65,
  'vodka': 55,
  'gin': 60,
  'whisky': 65,
  'whiskey': 65,
  'tequila': 65,
  'cognac': 70,
  'brandy': 70,
  'liqueur': 80,
  'vermouth': 40,
  'porto': 45,
  'vin': 18,
  'champagne': 20,
  'bière': 10,
  
  // Sirops et sucrés
  'sirop': 85,
  'sucre': 40,
  'miel': 35,
  
  // Jus et boissons
  'jus': 12,
  'jus d\'orange': 12,
  'jus de citron': 5,
  'jus de lime': 5,
  'jus de cranberry': 12,
  'jus d\'ananas': 14,
  'jus de tomate': 5,
  'jus de pamplemousse': 10,
  'coca': 11,
  'soda': 10,
  'tonic': 8,
  'ginger ale': 9,
  
  // Produits laitiers
  'lait': 15,
  'crème': 35,
  'yaourt': 17,
  'crème de coco': 40,
  'lait de coco': 25,
  
  // Fruits et légumes (par pièce ou portion)
  'citron': 4,
  'citron vert': 3,
  'lime': 3,
  'orange': 15,
  'fraise': 5,
  'menthe': 1,
  'concombre': 2,
  
  // Autres
  'eau': 0,
  'glace': 0,
  'sel': 0,
  'poivre': 0,
  'épice': 1
};

// Crée un index pour les recherches plus rapides
const createPriceIndexes = () => {
  const exact: Record<string, number> = {};
  const categories: Record<string, number[]> = {
    'rhum': [],
    'vodka': [],
    'gin': [],
    'whisky': [],
    'tequila': [],
    'liqueur': [],
    'sirop': [],
    'jus': [],
    'soda': [],
    'eau': [],
    'autre': []
  };

  // Catégoriser les ingrédients
  ingredientPrices.forEach(item => {
    // Index exact (clé normalisée)
    exact[item.ingredient.toLowerCase()] = item.eur_per_10ml;
    
    // Catégorisation
    const name = item.ingredient.toLowerCase();
    if (name.includes('rhum') || name.includes('bacardi') || name.includes('havana') || name.includes('captain')) {
      categories['rhum'].push(item.eur_per_10ml);
    } else if (name.includes('vodka') || name.includes('smirnoff') || name.includes('absolut') || 
               name.includes('grey goose') || name.includes('żubrówka') || name.includes('poliakov') || 
               name.includes('sobieski')) {
      categories['vodka'].push(item.eur_per_10ml);
    } else if (name.includes('gin') || name.includes('bombay') || name.includes('tanqueray') || 
               name.includes('gordon') || name.includes('hendrick')) {
      categories['gin'].push(item.eur_per_10ml);
    } else if (name.includes('whisky') || name.includes('whiskey') || name.includes('bourbon') || 
               name.includes('jack daniel') || name.includes('jameson')) {
      categories['whisky'].push(item.eur_per_10ml);
    } else if (name.includes('tequila') || name.includes('cuervo') || name.includes('don julio')) {
      categories['tequila'].push(item.eur_per_10ml);
    } else if (name.includes('liqueur') || name.includes('triple sec') || name.includes('cointreau') || 
               name.includes('campari') || name.includes('aperol') || name.includes('cognac') || 
               name.includes('hennessy') || name.includes('brandy')) {
      categories['liqueur'].push(item.eur_per_10ml);
    } else if (name.includes('sirop') || name.includes('monin') || name.includes('teisseire') || 
               name.includes('eyguebelle') || name.includes('guiot')) {
      categories['sirop'].push(item.eur_per_10ml);
    } else if (name.includes('jus') || name.includes('granini') || name.includes('tropicana') || 
               name.includes('pago') || name.includes('pulco') || name.includes('citron') || 
               name.includes('orange') || name.includes('ananas') || name.includes('cranberry') || 
               name.includes('tomate') || name.includes('pamplemousse')) {
      categories['jus'].push(item.eur_per_10ml);
    } else if (name.includes('soda') || name.includes('schweppes') || name.includes('fever tree') || 
               name.includes('canada dry') || name.includes('ginger') || name.includes('tonic') || 
               name.includes('7up') || name.includes('sprite') || name.includes('cola') || 
               name.includes('orangina')) {
      categories['soda'].push(item.eur_per_10ml);
    } else if (name.includes('eau') || name.includes('perrier') || name.includes('san pellegrino')) {
      categories['eau'].push(item.eur_per_10ml);
    } else {
      categories['autre'].push(item.eur_per_10ml);
    }
  });

  // Calculer les moyennes pour chaque catégorie
  const categoryAverages: Record<string, number> = {};
  for (const [category, prices] of Object.entries(categories)) {
    if (prices.length > 0) {
      categoryAverages[category] = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    } else {
      categoryAverages[category] = 0.5; // Valeur par défaut
    }
  }

  return { exact, categoryAverages };
};

// Initialiser les index de prix
const { exact: exactPriceIndex, categoryAverages: categoryPrices } = createPriceIndexes();

// Normalisation des noms d'ingrédients pour une meilleure correspondance
const normalizeIngredientName = (name: string): string => {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Fonction pour trouver les calories d'un ingrédient
export const findIngredientCalories = (ingredientName: string, quantity: number, unit: string): number => {
  const normalizedName = normalizeIngredientName(ingredientName);
  let caloriesValue = 0;
  
  // Recherche directe dans les données de calories
  for (const [key, value] of Object.entries(caloriesData)) {
    if (normalizedName.includes(key)) {
      caloriesValue = value;
      break;
    }
  }
  
  // Si rien n'est trouvé, attribuer des valeurs par défaut selon des catégories générales
  if (caloriesValue === 0) {
    if (normalizedName.includes('rhum') || normalizedName.includes('rum')) {
      caloriesValue = caloriesData['rhum'];
    } else if (normalizedName.includes('vodka')) {
      caloriesValue = caloriesData['vodka'];
    } else if (normalizedName.includes('gin')) {
      caloriesValue = caloriesData['gin'];
    } else if (normalizedName.includes('whisky') || normalizedName.includes('whiskey')) {
      caloriesValue = caloriesData['whisky'];
    } else if (normalizedName.includes('tequila')) {
      caloriesValue = caloriesData['tequila'];
    } else if (normalizedName.includes('liqueur') || normalizedName.includes('triple sec') || normalizedName.includes('cointreau')) {
      caloriesValue = caloriesData['liqueur'];
    } else if (normalizedName.includes('sirop')) {
      caloriesValue = caloriesData['sirop'];
    } else if (normalizedName.includes('jus')) {
      caloriesValue = caloriesData['jus'];
    } else if (normalizedName.includes('crème')) {
      caloriesValue = caloriesData['crème'];
    } else {
      caloriesValue = 10; // Valeur par défaut si aucune correspondance n'est trouvée
    }
  }
  
  // Convertir les calories en fonction de l'unité et de la quantité
  const volumeInCl = quantity * (unitConversions[unit] || 0);
  return (volumeInCl / 1) * caloriesValue; // Calories pour la quantité donnée
};

// Fonction améliorée pour rechercher un prix d'ingrédient
export const findIngredientPrice = (ingredientName: string): number => {
  // Normaliser le nom de l'ingrédient
  const normalizedName = normalizeIngredientName(ingredientName);
  
  // 1. Essayer une correspondance exacte dans l'index
  if (exactPriceIndex[normalizedName]) {
    return exactPriceIndex[normalizedName];
  }
  
  // 2. Rechercher dans les données originales pour des correspondances partielles
  const partialMatches = ingredientPrices.filter(item => {
    const normalizedItemName = normalizeIngredientName(item.ingredient);
    return normalizedName.includes(normalizedItemName) || 
           normalizedItemName.includes(normalizedName);
  });
  
  if (partialMatches.length > 0) {
    // Trier par pertinence (longueur de la correspondance)
    partialMatches.sort((a, b) => {
      const aName = normalizeIngredientName(a.ingredient);
      const bName = normalizeIngredientName(b.ingredient);
      
      // Privilégier les correspondances exactes ou très proches
      const aScore = aName === normalizedName ? 1000 :
                    normalizedName.includes(aName) ? aName.length * 2 :
                    aName.includes(normalizedName) ? normalizedName.length : 0;
                    
      const bScore = bName === normalizedName ? 1000 :
                    normalizedName.includes(bName) ? bName.length * 2 :
                    bName.includes(normalizedName) ? normalizedName.length : 0;
      
      return bScore - aScore;
    });
    
    // Utiliser le meilleur match
    
    return partialMatches[0].eur_per_10ml;
  }
  
  // 3. Rechercher par catégorie si aucune correspondance n'est trouvée
  for (const [category, keywords] of Object.entries({
    'rhum': ['rhum', 'rum', 'bacardi', 'havana', 'captain', 'agricole'],
    'vodka': ['vodka', 'absolut', 'smirnoff', 'grey goose', 'żubrówka', 'poliakov', 'sobieski'],
    'gin': ['gin', 'bombay', 'tanqueray', 'gordon', 'hendrick'],
    'whisky': ['whisky', 'whiskey', 'bourbon', 'jack', 'jameson', 'woodford', 'jim beam'],
    'tequila': ['tequila', 'cuervo', 'don julio'],
    'liqueur': ['liqueur', 'triple sec', 'cointreau', 'campari', 'aperol', 'cognac', 'hennessy', 'brandy'],
    'sirop': ['sirop', 'monin', 'teisseire', 'eyguebelle', 'guiot'],
    'jus': ['jus', 'granini', 'tropicana', 'pago', 'pulco', 'citron', 'orange', 'ananas', 'cranberry', 'tomate', 'pamplemousse'],
    'soda': ['soda', 'schweppes', 'fever tree', 'canada dry', 'ginger', 'tonic', '7up', 'sprite', 'cola', 'orangina'],
    'eau': ['eau', 'perrier', 'san pellegrino']
  })) {
    if (keywords.some(keyword => normalizedName.includes(keyword))) {
      return categoryPrices[category];
    }
  }
  
  // 4. Utiliser les estimations prédéfinies pour les ingrédients spécifiques
  const specialPrices: Record<string, number> = {
    'menthe': 0.03,
    'citron vert': 0.3,
    'lime': 0.3,
    'citron': 0.15,
    'orange': 0.3,
    'fraise': 0.15,
    'sucre': 0.05,
    'sugar': 0.05,
    'sel': 0.01,
    'zeste': 0.05,
    'glace': 0.1,
    'glaçon': 0.1,
    'ice': 0.1,
    'lait': 0.01,
    'crème': 0.04,
    'passion': 0.08,
    'coco': 0.08
  };
  
  for (const [keyword, price] of Object.entries(specialPrices)) {
    if (normalizedName.includes(keyword)) {
      return price;
    }
  }
  
  // 5. Prix par défaut si aucune correspondance
  console.log(`Aucun prix trouvé pour: ${ingredientName}, utilisation du prix par défaut`);
  return 0.5;
};

// Conversion des unités pour calculer les volumes totaux
export const unitConversions: Record<string, number> = {
  'ml': 0.1, // 1 ml = 0.1 cl
  'cl': 1,   // 1 cl = 1 cl (base)
  'oz': 3,   // 1 oz ≈ 3 cl
  'dash': 0.05, // un dash d'amers
  'dashes': 0.05,
  'feuilles': 0.05, // estimation pour menthe
  'pièce': 3, // estimation pour un citron ou autre fruit
  'cuillère à café': 0.5,
  'cuillères à café': 0.5,
  'cuillère à soupe': 1.5,
  'cuillères à soupe': 1.5,
  'gouttes': 0.01,
  'trait': 0.05, // un trait
  'pincée': 0.01,
  'verre': 15,
  'tasse': 25,
  'zeste': 0.1,
  '': 0, // pour les ingrédients sans unité spécifique
};

// Fonction pour convertir un ingrédient JSON en ingrédient formaté pour la cocktailatrice
interface RawIngredient {
  name: string;
  quantity?: string | number;
  unit?: string;
}

interface CocktailatriceIngredient extends Ingredient {
  id: string;
  price: number;
  calories: number;
  isAlcoholic: boolean;
}

export const convertIngredientToCocktailatrice = (ingredient: string | RawIngredient): CocktailatriceIngredient => {
  console.log('convertIngredientToCocktailatrice', ingredient);
  const name: string = typeof ingredient === 'string' ? ingredient : ingredient.name;
  let quantity: number = 10;
  let unit: string = '';
  if (typeof ingredient !== 'string' && ingredient.quantity) {
    // Convertir la quantité en nombre
    quantity = parseFloat(ingredient.quantity as string) || 0;
    unit = ingredient.unit || '';
  }
  
  // Estimer si l'ingrédient est alcoolisé en fonction de son nom
  const alcoholicIngredients: string[] = ['rhum', 'vodka', 'gin', 'whisky', 'whiskey', 'tequila', 'cognac', 'brandy', 
                               'vermouth', 'liqueur', 'kirsch', 'triple sec', 'cointreau', 'campari', 
                               'aperol', 'spiritueux', 'bitter', 'alcool', 'chartreuse', 'porto', 'vin'];
  const isAlcoholic: boolean = alcoholicIngredients.some(alcoholic => name.toLowerCase().includes(alcoholic));
  
  // Déterminer le prix en fonction du nom de l'ingrédient
  const price: number = findIngredientPrice(name);
  
  // Calculer les calories pour cet ingrédient
  const calories: number = findIngredientCalories(name, quantity, unit);
  console.log('Calories:', calories, 'pour', quantity, unit, 'de', name);
  return {
    id: uuidv4(),
    name,
    quantity,
    unit,
    price,
    calories,
    isAlcoholic
  };
};