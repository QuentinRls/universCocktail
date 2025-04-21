'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import '@/styles/pages/CreationSurMesure.css';

// Types pour le formulaire
interface FormData {
  soiree: string;
  nombrePersonnes: string;
  ambiance: string;
  alcoolPrefere: string;
  budget: string;
}

// Format de la réponse attendue de l'API OpenAI
interface AIResponse {
  cocktails: {
    id: string;
    nom: string;
    quantite: number;
  }[];
  message: string;
}

export default function CreationSurMesurePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    soiree: '',
    nombrePersonnes: '',
    ambiance: '',
    alcoolPrefere: '',
    budget: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Options pour chaque section du formulaire
  const options = {
    soiree: [
      { id: 'diner', label: 'Dîner' },
      { id: 'fete-cool', label: 'Fête cool' },
      { id: 'grosse-fete', label: 'Grosse fête' }
    ],
    nombrePersonnes: [
      { id: '5-10', label: '5-10 personnes' },
      { id: '10-20', label: '10-20 personnes' },
      { id: '20-30', label: '20-30 personnes' },
      { id: '40-60', label: '40-60 personnes' }
    ],
    ambiance: [
      { id: 'exotique', label: 'Exotique' },
      { id: 'classique', label: 'Classique' },
      { id: 'techno', label: 'Techno' }
    ],
    alcoolPrefere: [
      { id: 'vodka', label: 'Vodka' },
      { id: 'tequila', label: 'Tequila' },
      { id: 'gin', label: 'Gin' },
      { id: 'rhum', label: 'Rhum' },
      { id: 'mix', label: 'Mix' }
    ],
    budget: [
      { id: '10-20', label: '10€-20€' },
      { id: '30-50', label: '30€-50€' },
      { id: '80-120', label: '80€-120€' },
      { id: '150-250', label: '150€-250€' }
    ]
  };

  // Titres pour chaque étape
  const stepTitles = [
    'Type de soirée',
    'Nombre de personnes',
    'Ambiance',
    'Alcool préféré',
    'Budget total'
  ];

  // Gérer le changement d'étape
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Gérer la sélection d'option
  const handleOptionSelect = (option: string, category: keyof FormData) => {
    setFormData({
      ...formData,
      [category]: option
    });
  };

  // Vérifier si l'étape actuelle a une option sélectionnée
  const isOptionSelectedForCurrentStep = () => {
    const currentCategory = Object.keys(formData)[currentStep] as keyof FormData;
    return !!formData[currentCategory];
  };

  // Soumettre le formulaire à l'API OpenAI
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Construction du prompt pour OpenAI
      const prompt = `
        Je souhaite organiser une ${getOptionLabel('soiree', formData.soiree)} 
        pour ${getOptionLabel('nombrePersonnes', formData.nombrePersonnes)}
        avec une ambiance ${getOptionLabel('ambiance', formData.ambiance)}.
        L'alcool préféré est ${getOptionLabel('alcoolPrefere', formData.alcoolPrefere)}
        et mon budget est de ${getOptionLabel('budget', formData.budget)}.
        Quels cocktails recommandez-vous pour cet événement?
      `;

      const response = await fetch('/api/ai-cocktails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data: AIResponse = await response.json();
      // Mettre à jour l'état local pour stocker la suggestion AI sans redirection
      // Ici, on stocke la suggestion dans le localStorage pour la récupérer côté cocktailatrice
      localStorage.setItem('aiSuggestion', JSON.stringify(data.cocktails));
      localStorage.setItem('aiMessage', data.message || '');
      // Rediriger sans paramètre (juste sur /cocktailatrice)
      router.push(`/cocktailatrice`);
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer le label d'une option à partir de son id
  const getOptionLabel = (category: keyof typeof options, optionId: string) => {
    const option = options[category].find(opt => opt.id === optionId);
    return option ? option.label : optionId;
  };

  // Contenu actuel de l'étape
  const getCurrentStepContent = () => {
    const currentCategory = Object.keys(formData)[currentStep] as keyof FormData;
    const currentOptions = options[currentCategory];

    return (
      <div className="step-content">
        <h2 className="step-title">{stepTitles[currentStep]}</h2>
        <div className="options-grid">
          {currentOptions.map(option => (
            <button
              key={option.id}
              className={`option-button cosmic-border ${formData[currentCategory] === option.id ? 'active' : ''}`}
              onClick={() => handleOptionSelect(option.id, currentCategory)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="creation-container">
        <motion.div 
          className="form-card cosmic-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Création Sur Mesure</h1>
          <p className="page-description">
            Laissez-nous créer une sélection de cocktails parfaite pour votre événement.
            Répondez aux questions suivantes et notre IA cosmique vous proposera les mélanges idéaux.
          </p>
          
          {/* Indicateur d'étapes */}
          <div className="step-indicator">
            {Array.from({ length: Object.keys(formData).length }).map((_, index) => (
              <div 
                key={index} 
                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          
          {/* Contenu de l'étape actuelle */}
          <motion.div
            key={currentStep}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {getCurrentStepContent()}
          </motion.div>
          
          {/* Boutons de navigation */}
          <div className="form-navigation">
            {currentStep > 0 && (
              <button 
                className="nav-button back-button"
                onClick={handlePrevious}
              >
                Précédent
              </button>
            )}
            
            {currentStep < Object.keys(formData).length - 1 ? (
              <button 
                className="nav-button next-button"
                onClick={handleNext}
                disabled={!isOptionSelectedForCurrentStep()}
              >
                Suivant
              </button>
            ) : (
              <button 
                className="nav-button submit-button"
                onClick={handleSubmit}
                disabled={isLoading || !isOptionSelectedForCurrentStep()}
              >
                {isLoading ? 'Création en cours...' : 'Créer ma sélection'}
              </button>
            )}
          </div>
          
          {/* Message d'erreur */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}