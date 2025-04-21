import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCocktailSuggestions } from '@/services/cocktailService';
import '@/styles/components/SearchBar.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string; // Ajouter une prop pour la valeur initiale
}

interface Suggestion {
  id: string;
  name: string;
}

export default function SearchBar({ placeholder = "Rechercher...", onSearch, className = "", initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effet pour initialiser la recherche avec la valeur initiale
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      // Récupérer les suggestions de cocktails
      const cocktailSuggestions = getCocktailSuggestions(query);
      setSuggestions(cocktailSuggestions);
      setShowSuggestions(cocktailSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setHighlightedIndex(-1);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Toujours appeler onSearch, même si la requête est vide
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    router.push(`/cocktail/${suggestion.id}`);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    
    // Navigation avec les flèches du clavier
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } 
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestions[highlightedIndex];
      if (suggestion) {
        handleSuggestionClick(suggestion);
      }
    } 
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Fermer les suggestions si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className={`search-bar-container ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-input cosmic-border glow"
          autoComplete="off"
        />
        <button
          type="submit"
          className="search-button" 
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="suggestions-container cosmic-border"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}