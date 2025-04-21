'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CocktailCard from '@/components/CocktailCard';
import SearchBar from '@/components/SearchBar';
import { getCocktailsByCategory, getCategories, getCategoryById, Cocktail } from '@/services/cocktailService';

// Correction des types et suppression des unused vars

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string || '';
  
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'alcoholDegree', ou 'popularity'
  
  // Utiliser le service pour récupérer la catégorie
  const category = getCategoryById(categoryId);
  // Utiliser le service pour récupérer toutes les catégories
  const categories = getCategories();
  
  useEffect(() => {
    // Utiliser le service pour récupérer les cocktails par catégorie
    const timer = setTimeout(() => {
      const categoryData = getCocktailsByCategory(categoryId);
      setCocktails(categoryData);
      setFilteredCocktails(categoryData);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [categoryId]);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCocktails(cocktails);
      return;
    }
    
    const filtered = cocktails.filter(cocktail => 
      cocktail.name.toLowerCase().includes(query.toLowerCase()) ||
      cocktail.ingredients.some(ing => {
        if (typeof ing === 'string') {
          return ing.toLowerCase().includes(query.toLowerCase());
        } else if (ing && typeof ing === 'object' && ing.name) {
          return ing.name.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      })
    );
    
    setFilteredCocktails(filtered);
  };
  
  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    
    const sorted = [...filteredCocktails];
    if (sortType === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'alcoholDegree') {
      sorted.sort((a, b) => b.alcoholDegree - a.alcoholDegree);
    }
    // Dans une application réelle, nous aurions d'autres options de tri comme la popularité
    
    setFilteredCocktails(sorted);
  };
  
  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {category ? (
          <>
            <h1 className="text-4xl md:text-5xl text-center mb-4">{category.name}</h1>
            <p className="text-center max-w-2xl mx-auto mb-12 text-lg">{category.description}</p>
          </>
        ) : (
          <h1 className="text-4xl md:text-5xl text-center mb-12">Catégorie</h1>
        )}
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-2/3">
            <SearchBar 
              placeholder="Rechercher un cocktail dans cette catégorie..." 
              onSearch={handleSearch}
            />
          </div>
          
          <div className="w-full md:w-1/3 flex justify-end">
            <div className="cosmic-border rounded-lg overflow-hidden">
              <select 
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Trier par nom</option>
                <option value="alcoholDegree">Trier par degré d{"\'"}alcool</option>
                <option value="popularity">Trier par popularité</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          // État de chargement
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(index => (
              <div key={index} className="cosmic-border rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm">
                <div className="aspect-square bg-cosmic-dust/20 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 w-3/4 bg-cosmic-dust/20 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-cosmic-dust/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCocktails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCocktails.map(cocktail => (
              <CocktailCard 
                key={cocktail.id}
                id={cocktail.id}
                name={cocktail.name}
                imageUrl={cocktail.imageUrl}
                ingredients={Array.isArray(cocktail.ingredients) 
                  ? cocktail.ingredients.map(ing => typeof ing === 'string' ? ing : ing.name)
                  : []}
                alcoholDegree={cocktail.alcoholDegree}
                isAlcoholic={cocktail.isAlcoholic}
              />
            ))}
          </div>
        ) : (
          <div className="cosmic-border rounded-lg p-12 bg-background/30 backdrop-blur-sm text-center max-w-2xl mx-auto">
            <h2 className="text-2xl mb-4">Aucun cocktail trouvé</h2>
            <p className="mb-8">Aucun cocktail ne correspond à votre recherche dans cette catégorie.</p>
            <button 
              onClick={() => setFilteredCocktails(cocktails)}
              className="py-3 px-6 bg-primary hover:bg-primary-light text-white rounded-full transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
        
        {/* Navigation entre catégories */}
        <div className="mt-16">
          <h2 className="text-2xl mb-6 text-center">Explorer d{"\'"}autres constellations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link 
                key={cat.id}
                href={`/categorie/${cat.id}`}
                className={`cosmic-border rounded-lg p-4 text-center hover:glow transition-all ${
                  cat.id === categoryId ? 'bg-primary/20 border-primary' : 'bg-background/30'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}