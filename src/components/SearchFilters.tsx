'use client';

import { useState } from 'react';
import '@/styles/components/SearchFilters.css';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  onChange: (selectedIds: string[]) => void;
}

export function FilterGroup({ title, options, selectedOptions, onChange }: FilterGroupProps) {
  const toggleOption = (id: string) => {
    if (selectedOptions.includes(id)) {
      onChange(selectedOptions.filter(item => item !== id));
    } else {
      onChange([...selectedOptions, id]);
    }
  };

  return (
    <div className="filter-section">
      <h3 className="filter-section-title">{title}</h3>
      <div className="filter-items">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`filter-item ${
              selectedOptions.includes(option.id) ? 'active' : ''
            } cosmic-border`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  unit?: string;
}

export function RangeFilter({ title, min, max, value, onChange, unit = '' }: RangeFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    setLocalValue([localValue[0], newMax]);
  };

  const handleApply = () => {
    onChange(localValue);
  };

  return (
    <div className="filter-section">
      <h3 className="filter-section-title">{title}</h3>
      <div className="space-y-4">
        <div className="slider-values">
          <span>
            {localValue[0]}{unit}
          </span>
          <span>
            {localValue[1]}{unit}
          </span>
        </div>
        <div className="range-track">
          <div
            className="range-progress"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
            }}
          />
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={min}
            max={max}
            value={localValue[0]}
            onChange={handleMinChange}
            onMouseUp={handleApply}
            onTouchEnd={handleApply}
            className="range-input"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={localValue[1]}
            onChange={handleMaxChange}
            onMouseUp={handleApply}
            onTouchEnd={handleApply}
            className="range-input"
          />
        </div>
      </div>
    </div>
  );
}

interface SearchFiltersProps {
  onApplyFilters: (filters: {
    ingredients: string[];
    types: string[];
    flavors: string[];
    alcoholDegree: [number, number];
    sortByPrice: string; // Ajout d'une nouvelle propriété pour le tri par prix
    priceRange: [number, number]; // Ajout d'une nouvelle propriété pour le filtre par plage de prix
  }) => void;
}

// Options pour les filtres (à remplacer par des données dynamiques)
const ingredientOptions = [
  'Rhum', 'Vodka', 'Gin', 'Tequila', 'Whisky', 'Menthe', 
  'Citron vert', 'Sucre', 'Eau gazeuse', 'Triple sec', 'Jus de cranberry'
];

const typeOptions = [
  'long-drink', 'short-drink', 'shooter', 'sans-alcool', 'pétillant'
];

const flavorOptions = [
  'sucré', 'acide', 'amer', 'fruité', 'herbacé', 'épicé'
];

export default function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [alcoholDegree, setAlcoholDegree] = useState<[number, number]>([0, 50]);
  const [sortByPrice, setSortByPrice] = useState<string>('none'); // none, low-to-high, high-to-low
  const [priceRange, setPriceRange] = useState<[number, number]>([2, 7]); // Plage de prix de 2€ à 7€

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors(prev => 
      prev.includes(flavor)
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      ingredients: selectedIngredients,
      types: selectedTypes,
      flavors: selectedFlavors,
      alcoholDegree,
      sortByPrice,
      priceRange
    });
  };

  const handleReset = () => {
    setSelectedIngredients([]);
    setSelectedTypes([]);
    setSelectedFlavors([]);
    setAlcoholDegree([0, 50]);
    setSortByPrice('none');
    setPriceRange([2, 7]);
    onApplyFilters({
      ingredients: [],
      types: [],
      flavors: [],
      alcoholDegree: [0, 50],
      sortByPrice: 'none',
      priceRange: [2, 7]
    });
  };

  return (
    <div className="filters-container cosmic-border">
      <h2 className="filters-title">Filtres Cosmiques</h2>
      
      {/* Filtres par ingrédients */}
      <div className="filter-section">
        <h3 className="filter-section-title">Ingrédients</h3>
        <div className="filter-items">
          {ingredientOptions.map(ingredient => (
            <button
              key={ingredient}
              onClick={() => handleIngredientToggle(ingredient)}
              className={`filter-item ${
                selectedIngredients.includes(ingredient) ? 'active' : ''
              } cosmic-border`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>
      
      {/* Filtres par type */}
      <div className="filter-section">
        <h3 className="filter-section-title">Type de cocktail</h3>
        <div className="filter-items">
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`filter-item ${
                selectedTypes.includes(type) ? 'active' : ''
              } cosmic-border`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Filtres par saveur */}
      <div className="filter-section">
        <h3 className="filter-section-title">Saveurs</h3>
        <div className="filter-items">
          {flavorOptions.map(flavor => (
            <button
              key={flavor}
              onClick={() => handleFlavorToggle(flavor)}
              className={`filter-item ${
                selectedFlavors.includes(flavor) ? 'active' : ''
              } cosmic-border`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>
      
      {/* Filtres par degré d'alcool */}
      <div className="filter-section">
        <h3 className="filter-section-title">Degré d&#39;alcool</h3>
        <div className="slider-values">
          <span>{alcoholDegree[0]}°</span>
          <span>{alcoholDegree[1]}°</span>
        </div>
        <div className="slider-container price-slider">
          <div className="range-track">
            <div 
              className="range-progress"
              style={{
                left: `${(alcoholDegree[0] / 50) * 100}%`,
                width: `${((alcoholDegree[1] - alcoholDegree[0]) / 50) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={alcoholDegree[0]}
            onChange={(e) => {
              const newMin = parseInt(e.target.value);
              const newMax = Math.max(alcoholDegree[1], newMin + 1);
              setAlcoholDegree([newMin, newMax]);
            }}
            className="range-input range-input-min"
          />
          <input
            type="range"
            min="0"
            max="50"
            value={alcoholDegree[1]}
            onChange={(e) => {
              const newMax = parseInt(e.target.value);
              const newMin = Math.min(alcoholDegree[0], newMax - 1);
              setAlcoholDegree([newMin, newMax]);
            }}
            className="range-input range-input-max"
          />
        </div>
        <div className="price-marks alcohol-marks">
          <span>0°</span>
          <span>10°</span>
          <span>20°</span>
          <span>30°</span>
          <span>40°</span>
          <span>50°</span>
        </div>
      </div>
      
      {/* Filtre par plage de prix */}
      <div className="filter-section">
        <h3 className="filter-section-title">Plage de prix</h3>
        <div className="slider-values">
          <span>{priceRange[0]}€</span>
          <span>{priceRange[1]}€</span>
        </div>
        <div className="slider-container price-slider">
          <div className="range-track">
            <div 
              className="range-progress"
              style={{
                left: `${((priceRange[0] - 2) / 5) * 100}%`,
                width: `${((priceRange[1] - priceRange[0]) / 5) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            min="2"
            max="7"
            step="0.5"
            value={priceRange[0]}
            onChange={(e) => {
              const newMin = parseFloat(e.target.value);
              const newMax = Math.max(priceRange[1], newMin + 0.5);
              setPriceRange([newMin, newMax]);
            }}
            className="range-input range-input-min"
          />
          <input
            type="range"
            min="2"
            max="7"
            step="0.5"
            value={priceRange[1]}
            onChange={(e) => {
              const newMax = parseFloat(e.target.value);
              const newMin = Math.min(priceRange[0], newMax - 0.5);
              setPriceRange([newMin, newMax]);
            }}
            className="range-input range-input-max"
          />
        </div>
        <div className="price-marks">
          <span>2€</span>
          <span>3€</span>
          <span>4€</span>
          <span>5€</span>
          <span>6€</span>
          <span>7€</span>
        </div>
      </div>
      
      {/* Tri par prix */}
      <div className="filter-section">
        <h3 className="filter-section-title">Tri par prix</h3>
        <div className="sort-selector">
          <select 
            className="cosmic-border sort-select"
            value={sortByPrice}
            onChange={(e) => setSortByPrice(e.target.value)}
          >
            <option value="none">Aucun tri</option>
            <option value="low-to-high">Prix croissant</option>
            <option value="high-to-low">Prix décroissant</option>
          </select>
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="button-container">
        <button
          onClick={handleApply}
          className="apply-button"
        >
          Appliquer
        </button>
        <button
          onClick={handleReset}
          className="reset-button"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}