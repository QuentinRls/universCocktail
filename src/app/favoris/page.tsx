'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CocktailCard from '@/components/CocktailCard';
import Link from 'next/link';

// Types
interface Cocktail {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  alcoholDegree: number;
  isAlcoholic: boolean;
}

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dans une application réelle, nous chargerions les favoris depuis une API ou le localStorage
    // Ici, nous simulons un chargement avec des données factices après un court délai
    const timer = setTimeout(() => {
      setFavorites(mockFavorites);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFavorite = (id: string) => {
    // Dans une application réelle, nous synchroniserions avec une API ou le localStorage
    setFavorites(prev => prev.filter(cocktail => cocktail.id !== id));
  };

  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl text-center mb-8">Vos Constellations Favorites</h1>
        
        <div className="mb-8">
          <p className="text-center max-w-2xl mx-auto">
            Retrouvez ici tous les cocktails que vous avez ajoutés à vos favoris pour y accéder facilement.
          </p>
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
        ) : favorites.length > 0 ? (
          // Affichage des favoris
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(cocktail => (
              <div key={cocktail.id} className="relative group">
                <CocktailCard 
                  id={cocktail.id}
                  name={cocktail.name}
                  imageUrl={cocktail.imageUrl}
                  ingredients={cocktail.ingredients}
                  alcoholDegree={cocktail.alcoholDegree}
                  isAlcoholic={cocktail.isAlcoholic}
                />
                <button 
                  onClick={() => handleRemoveFavorite(cocktail.id)}
                  className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/70"
                  aria-label="Retirer des favoris"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className="w-5 h-5 text-meteor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Aucun favori
          <div className="cosmic-border rounded-lg p-12 bg-background/30 backdrop-blur-sm text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto text-foreground/50">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl mb-4">Aucune étoile dans votre galaxie</h2>
            <p className="mb-8">Vous n'avez pas encore ajouté de cocktails à vos favoris. Explorez notre collection et ajoutez vos constellations préférées ici.</p>
            <Link href="/recherche" className="py-3 px-6 bg-primary hover:bg-primary-light text-white rounded-full transition-colors inline-block">
              Explorer les cocktails
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// Données fictives pour la démo
const mockFavorites: Cocktail[] = [
  {
    id: 'mojito',
    name: 'Mojito',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a',
    ingredients: ['Rhum blanc', 'Menthe fraîche', 'Citron vert', 'Eau gazeuse', 'Sucre'],
    alcoholDegree: 15,
    isAlcoholic: true,
  },
  {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187',
    ingredients: ['Vodka', 'Triple sec', 'Jus de cranberry', 'Citron vert'],
    alcoholDegree: 20,
    isAlcoholic: true,
  },
  {
    id: 'margarita',
    name: 'Margarita',
    imageUrl: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85',
    ingredients: ['Tequila', 'Triple sec', 'Citron vert', 'Sel'],
    alcoholDegree: 25,
    isAlcoholic: true,
  },
  {
    id: 'virgin-mojito',
    name: 'Virgin Mojito',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    ingredients: ['Menthe fraîche', 'Citron vert', 'Eau gazeuse', 'Sucre'],
    alcoholDegree: 0,
    isAlcoholic: false,
  },
];