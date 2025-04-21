'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCocktailById, getCocktailsByCategory, addToFavorites, removeFromFavorites, isInFavorites, Cocktail } from '@/services/cocktailService';

export default function CocktailDetailPage({ params }: { params: { id: string } }) {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [servings, setServings] = useState(1);
  const [similarCocktails, setSimilarCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Récupérer le cocktail à partir du service
    const cocktailData = getCocktailById(params.id);
    
    if (cocktailData) {
      setCocktail(cocktailData);
      setIsFavorite(isInFavorites(cocktailData.id));
      
      // Récupérer des cocktails similaires (de la même catégorie)
      if (cocktailData.categories && cocktailData.categories.length > 0) {
        const mainCategory = cocktailData.categories[0];
        const sameCategoryCocktails = getCocktailsByCategory(mainCategory)
          .filter(c => c.id !== cocktailData.id)
          .slice(0, 4);
          
        setSimilarCocktails(sameCategoryCocktails);
      }
    }
    
    setLoading(false);
  }, [params.id]);

  const handleFavoriteToggle = () => {
    if (!cocktail) return;
    
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      addToFavorites(cocktail.id);
    } else {
      removeFromFavorites(cocktail.id);
    }
  };

  const handleServingsChange = (newServings: number) => {
    if (newServings >= 1 && newServings <= 10) {
      setServings(newServings);
    }
  };

  // Calcule la quantité en fonction du nombre de portions
  const calculateQuantity = (ingredient: any) => {
    if (!ingredient.quantity) return '';
    const baseQuantity = parseFloat(ingredient.quantity);
    if (isNaN(baseQuantity)) return ingredient.quantity;
    return (baseQuantity * servings).toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen star-bg">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Exploration cosmique en cours...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div className="min-h-screen star-bg">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="cosmic-border rounded-lg p-12 bg-background/30 backdrop-blur-sm text-center max-w-2xl mx-auto">
            <h1 className="text-3xl mb-4">Cocktail non trouvé</h1>
            <p className="mb-8">Ce cocktail semble s'être évaporé dans l'espace...</p>
            <Link href="/" className="btn-galactic">
              Retourner à l'accueil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image du cocktail */}
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden rounded-lg cosmic-border">
            <Image 
              src={cocktail.imageUrl} 
              alt={cocktail.name}
              fill
              className="object-cover"
            />
            <button 
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm p-2 rounded-full hover:bg-background/70 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill={isFavorite ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className={`w-6 h-6 ${isFavorite ? 'text-meteor' : 'text-foreground'}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Détails du cocktail */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {cocktail.tags && cocktail.tags.map(tag => (
                <span key={tag} className="text-xs bg-cosmic-dust/20 text-foreground px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl mb-4">{cocktail.name}</h1>
            
            <div className="mb-6">
              <p className="text-lg mb-4">{cocktail.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 cosmic-border rounded-lg bg-background/20">
                  <div className="text-sm text-foreground/70">Degré</div>
                  <div className="text-lg font-medium">{cocktail.alcoholDegree}°</div>
                </div>
                <div className="text-center p-3 cosmic-border rounded-lg bg-background/20">
                  <div className="text-sm text-foreground/70">Préparation</div>
                  <div className="text-lg font-medium">{cocktail.preparationTime || '5 minutes'}</div>
                </div>
                <div className="text-center p-3 cosmic-border rounded-lg bg-background/20">
                  <div className="text-sm text-foreground/70">Difficulté</div>
                  <div className="text-lg font-medium capitalize">{cocktail.difficulty || 'moyenne'}</div>
                </div>
              </div>
            </div>
            
            {/* Calculateur de portions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl">Nombre de verres</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleServingsChange(servings - 1)}
                    className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center cosmic-border"
                    disabled={servings <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg">{servings}</span>
                  <button 
                    onClick={() => handleServingsChange(servings + 1)}
                    className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center cosmic-border"
                    disabled={servings >= 10}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Ingrédients */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Ingrédients</h2>
              <ul className="space-y-3 cosmic-border rounded-lg p-4 bg-background/20">
                {Array.isArray(cocktail.ingredients) && cocktail.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{typeof ingredient === 'string' ? ingredient : ingredient.name}</span>
                    <span className="text-foreground/70">
                      {typeof ingredient === 'string' ? '' : 
                       `${calculateQuantity(ingredient)} ${ingredient.unit || ''}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        {cocktail.instructions && cocktail.instructions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl mb-6">Instructions cosmiques</h2>
            <div className="cosmic-border rounded-lg p-6 bg-background/20">
              <ol className="space-y-4">
                {cocktail.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        
        {/* Suggestions de cocktails similaires */}
        {similarCocktails.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl mb-6">Dans la même constellation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCocktails.map((similar) => (
                <Link 
                  key={similar.id} 
                  href={`/cocktail/${similar.id}`}
                  className="cosmic-border rounded-lg overflow-hidden bg-background/40 backdrop-blur-sm block hover:glow transition-all"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={similar.imageUrl}
                      alt={similar.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-title mb-1">{similar.name}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">{similar.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}