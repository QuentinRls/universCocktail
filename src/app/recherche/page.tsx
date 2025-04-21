'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import CocktailCard from '@/components/CocktailCard';
import { Cocktail, searchCocktails, getCocktailsForCards } from '@/services/cocktailService';

// Fonction pour estimer le prix d'un cocktail basé sur ses propriétés
const estimateCocktailPrice = (cocktail: Cocktail): number => {
  // Prix de base en fonction du degré d'alcool
  let estimatedPrice = cocktail.alcoholDegree * 0.2;
  
  // Ajoute un supplément pour les cocktails avec beaucoup d'ingrédients
  const ingredientCount = Array.isArray(cocktail.ingredients) ? cocktail.ingredients.length : 0;
  estimatedPrice += ingredientCount * 0.5;
  
  // Si des propriétés de prix existent déjà, les utiliser
  if ('priceRange' in cocktail && typeof cocktail.priceRange === 'string') {
    const priceMatch = cocktail.priceRange.match(/(\d+)-(\d+)/);
    if (priceMatch) {
      const avgPrice = (parseInt(priceMatch[1]) + parseInt(priceMatch[2])) / 2;
      return avgPrice;
    }
  }
  
  return Math.max(5, estimatedPrice); // Prix minimum de 5€
};

export default function RecherchePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCocktails, setAllCocktails] = useState<Cocktail[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  if (router)
    console.log("continue");
  // Charger tous les cocktails au chargement de la page
  useEffect(() => {
    const cocktails = getCocktailsForCards();
    setAllCocktails(cocktails);
    
    // Récupérer le paramètre de recherche de l'URL
    const queryParam = searchParams.get('q');
    
    if (queryParam) {
      // Mettre à jour l'état de recherche avec la valeur de l'URL
      setSearchQuery(queryParam);
      
      // Filtrer les cocktails avec cette requête
      const results = searchCocktails(queryParam);
      setFilteredCocktails(results);
    } else {
      // Sans paramètre de recherche, afficher tous les cocktails
      setFilteredCocktails(cocktails);
    }
  }, [searchParams]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Si la recherche est vide, afficher tous les cocktails
      setFilteredCocktails(allCocktails);
      
      // Mettre à jour l'URL manuellement
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('q', '');
        window.history.replaceState(null, '', url.toString());
      }
      return;
    }
    
    // Utiliser le service de recherche
    const results = searchCocktails(query);
    setFilteredCocktails(results);
    
    // Mettre à jour l'URL manuellement
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.replaceState(null, '', url.toString());
    }
  };
  
  const handleApplyFilters = (filters: {
    ingredients: string[];
    types: string[];
    flavors: string[];
    alcoholDegree: [number, number];
    sortByPrice: string;
    priceRange: [number, number];
  }) => {
    // Commencer avec tous les cocktails ou les résultats de la recherche actuelle
    let filtered = searchQuery ? searchCocktails(searchQuery) : allCocktails;
    
    // Filtrer par ingrédients
    if (filters.ingredients.length > 0) {
      filtered = filtered.filter(cocktail => {
        const cocktailIngredients = Array.isArray(cocktail.ingredients) 
          ? cocktail.ingredients.map(ing => typeof ing === 'string' ? ing.toLowerCase() : ing.name?.toLowerCase())
          : [];
        
        return filters.ingredients.some(ing => 
          cocktailIngredients.some(ci => ci && ci.includes(ing.toLowerCase()))
        );
      });
    }
    
    // Filtrer par types
    if (filters.types.length > 0) {
      filtered = filtered.filter(cocktail => 
        cocktail.types && filters.types.some(type => cocktail.types?.includes(type))
      );
    }
    
    // Filtrer par saveurs
    if (filters.flavors.length > 0) {
      filtered = filtered.filter(cocktail => 
        cocktail.flavors && filters.flavors.some(flavor => cocktail.flavors?.includes(flavor))
      );
    }
    
    // Filtrer par degré d'alcool
    filtered = filtered.filter(cocktail => 
      cocktail.alcoholDegree >= filters.alcoholDegree[0] && 
      cocktail.alcoholDegree <= filters.alcoholDegree[1]
    );
    
    // Filtrer par plage de prix
    filtered = filtered.filter(cocktail => {
      const price = estimateCocktailPrice(cocktail);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Trier par prix si l'option est sélectionnée
    if (filters.sortByPrice !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        // Utiliser un prix estimé basé sur les données disponibles
        const priceA = a.pricePerCocktail || estimateCocktailPrice(a);
        const priceB = b.pricePerCocktail || estimateCocktailPrice(b);
        
        return filters.sortByPrice === 'low-to-high' 
          ? priceA - priceB 
          : priceB - priceA;
      });
    }
    
    setFilteredCocktails(filtered);
  };
  
  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl text-center mb-8">Exploration Galactique</h1>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-2/3">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchBar 
                placeholder="Recherchez un cocktail, un ingrédient..." 
                onSearch={handleSearch}
                className="flex-grow"
                initialQuery={searchQuery}
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="cosmic-border py-3 px-6 rounded-full bg-background/70 hover:bg-background/90 transition-colors"
              >
                {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              </button>
            </div>
            
            {filteredCocktails.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCocktails.map(cocktail => (
                  <CocktailCard 
                    key={cocktail.id}
                    id={cocktail.id}
                    name={cocktail.name}
                    imageUrl={cocktail.imageUrl}
                    ingredients={Array.isArray(cocktail.ingredients) 
                      ? cocktail.ingredients.map(ing => typeof ing === 'string' ? ing : ing.name).filter(Boolean) as string[]
                      : []}
                    alcoholDegree={cocktail.alcoholDegree}
                    isAlcoholic={cocktail.isAlcoholic}
                  />
                ))}
              </div>
            ) : (
              <div className="cosmic-border rounded-lg p-8 bg-background/40 backdrop-blur-sm text-center">
                <h3 className="text-xl mb-3">Aucun cocktail trouvé dans cette dimension</h3>
                <p>Essayez de modifier vos critères de recherche pour explorer d{"\'"}autres galaxies de saveurs.</p>
              </div>
            )}
          </div>
          
          {showFilters && (
            <div className="w-full md:w-1/3">
              <SearchFilters onApplyFilters={handleApplyFilters} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}