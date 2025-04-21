import { NextRequest, NextResponse } from 'next/server';
import { searchCocktails, getCocktailById } from '@/services/cocktailService';

// Type pour les suggestions de cocktails générées par l'IA
interface CocktailSuggestion {
  id: string;
  nom: string;
  quantite: number;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    // Vérifier si le prompt est valide
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Un prompt valide est requis' },
        { status: 400 }
      );
    }

    // Appel réel à l'API OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY;
    ;
    
    if (!openaiApiKey) {
      console.error('La clé API OpenAI n\'est pas configurée');
      return NextResponse.json(
        { error: 'Configuration du serveur incorrecte' },
        { status: 500 }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en cocktails. 
            Tu dois suggérer des cocktails adaptés aux préférences des utilisateurs. 
            Réponds au format JSON avec une liste de cocktails, ne donne que le noms des cocktails et le nombre de cocktail a préparer.
            Exemple: 
          { 
            "cocktails": 
            [ 
              { 
              "id": "mojito", 
              "nom": "Mojito", 
              "quantite": 10 
              }, 
              { 
              "id": "moscow-mule",
              "nom": "Margarita",
              "quantite": 5 
              },
              { 
              "id": "gin-tonic",
              "nom": "Gin Tonic",
              "quantite": 5 
              }
            ]
          }`,
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const aiData = await openaiResponse.json();
    console.log('Réponse OpenAI:', aiData);
    if (!openaiResponse.ok) {
      console.error('Erreur OpenAI:', aiData);
      return NextResponse.json(
        { error: 'Erreur lors de la génération des suggestions de cocktails' },
        { status: 502 }
      );
    }

    try {
      const aiResponse = JSON.parse(aiData.choices[0].message.content);
      console.log('Réponse JSON:', aiResponse);
      return NextResponse.json(aiResponse);
    } catch (error) {
      // Si OpenAI ne renvoie pas du JSON valide, utiliser le fallback
      console.warn('Réponse OpenAI non valide, utilisation du fallback:', error);
      const aiResponse = await simulateAIResponse(prompt);
      return NextResponse.json(aiResponse);
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la requête' },
      { status: 500 }
    );
  }
}

// Fonction qui simule une réponse de l'API OpenAI
// Dans une vraie implémentation, vous remplaceriez ceci par un appel à l'API OpenAI
async function simulateAIResponse(prompt: string) {
  // Analyser le prompt pour extraire les préférences
  const isSoireeGrosse = prompt.toLowerCase().includes('grosse fête');
  const isSoireeDiner = prompt.toLowerCase().includes('dîner');
  const personnesNombreuses = 
    prompt.includes('20-30') || 
    prompt.includes('40-60');
  
  const isAmbianceExotique = prompt.toLowerCase().includes('exotique');
  const isAmbianceTechno = prompt.toLowerCase().includes('techno');
  
// Budget information
const budgetEleve = 
    prompt.toLowerCase().includes('budget élevé') || 
    prompt.includes('80-120') || 
    prompt.includes('150-250');
  
  // Préférences d'alcool
  const prefereVodka = prompt.toLowerCase().includes('vodka');
  const prefereTequila = prompt.toLowerCase().includes('tequila');
  const prefereGin = prompt.toLowerCase().includes('gin');
  const prefereRhum = prompt.toLowerCase().includes('rhum');
  const prefereMix = prompt.toLowerCase().includes('mix');
  
  // Rechercher des cocktails en fonction des préférences
  let cocktailsRecommandes: CocktailSuggestion[] = [];
  
  // Pour un dîner, privilégier des cocktails classiques
  if (isSoireeDiner) {
    if (prefereGin) {
      addCocktailIfExists(cocktailsRecommandes, 'negroni', 'Negroni', personnesNombreuses ? 10 : 5);
      addCocktailIfExists(cocktailsRecommandes, 'gin-tonic', 'Gin Tonic', personnesNombreuses ? 12 : 6);
    } else if (prefereVodka) {
      addCocktailIfExists(cocktailsRecommandes, 'cosmopolitan', 'Cosmopolitan', personnesNombreuses ? 8 : 4);
      addCocktailIfExists(cocktailsRecommandes, 'moscow-mule', 'Moscow Mule', personnesNombreuses ? 10 : 5);
    } else if (prefereRhum) {
      addCocktailIfExists(cocktailsRecommandes, 'daiquiri', 'Daiquiri', personnesNombreuses ? 8 : 4);
      addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 10 : 5);
    } else if (prefereTequila) {
      addCocktailIfExists(cocktailsRecommandes, 'margarita', 'Margarita', personnesNombreuses ? 8 : 4);
      addCocktailIfExists(cocktailsRecommandes, 'paloma', 'Paloma', personnesNombreuses ? 8 : 4);
    } else {
      // Mix ou sans préférence spécifique
      addCocktailIfExists(cocktailsRecommandes, 'old-fashioned', 'Old Fashioned', personnesNombreuses ? 8 : 4);
      addCocktailIfExists(cocktailsRecommandes, 'manhattan', 'Manhattan', personnesNombreuses ? 8 : 4);
      addCocktailIfExists(cocktailsRecommandes, 'negroni', 'Negroni', personnesNombreuses ? 6 : 3);
    }
  }
  // Pour une fête cool
  else if (!isSoireeGrosse) {
    if (isAmbianceExotique) {
      addCocktailIfExists(cocktailsRecommandes, 'pina-colada', 'Piña Colada', personnesNombreuses ? 15 : 8);
      addCocktailIfExists(cocktailsRecommandes, 'mai-tai', 'Mai Tai', personnesNombreuses ? 12 : 6);
      addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 15 : 8);
    } else if (isAmbianceTechno) {
      addCocktailIfExists(cocktailsRecommandes, 'long-island', 'Long Island Iced Tea', personnesNombreuses ? 12 : 6);
      addCocktailIfExists(cocktailsRecommandes, 'blue-lagoon', 'Blue Lagoon', personnesNombreuses ? 12 : 6);
      addCocktailIfExists(cocktailsRecommandes, 'cosmopolitan', 'Cosmopolitan', personnesNombreuses ? 10 : 5);
    } else {
      // Ambiance classique
      addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 15 : 8);
      addCocktailIfExists(cocktailsRecommandes, 'margarita', 'Margarita', personnesNombreuses ? 12 : 6);
      addCocktailIfExists(cocktailsRecommandes, 'aperol-spritz', 'Aperol Spritz', personnesNombreuses ? 12 : 6);
    }
  }
  // Pour une grosse fête
  else {
    if (budgetEleve) {
      // Grosse fête avec budget élevé, cocktails plus élaborés et en quantité
      addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 30 : 18);
      addCocktailIfExists(cocktailsRecommandes, 'pina-colada', 'Piña Colada', personnesNombreuses ? 25 : 15);
      addCocktailIfExists(cocktailsRecommandes, 'margarita', 'Margarita', personnesNombreuses ? 25 : 15);
      addCocktailIfExists(cocktailsRecommandes, 'cosmopolitan', 'Cosmopolitan', personnesNombreuses ? 20 : 12);
      addCocktailIfExists(cocktailsRecommandes, 'sex-on-the-beach', 'Sex on the Beach', personnesNombreuses ? 20 : 12);
    } else {
      // Grosse fête avec budget limité, cocktails simples et en grande quantité
      addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 25 : 15);
      addCocktailIfExists(cocktailsRecommandes, 'gin-tonic', 'Gin Tonic', personnesNombreuses ? 20 : 12);
      addCocktailIfExists(cocktailsRecommandes, 'vodka-orange', 'Vodka Orange', personnesNombreuses ? 25 : 15);
      addCocktailIfExists(cocktailsRecommandes, 'rhum-coca', 'Rhum Coca', personnesNombreuses ? 25 : 15);
    }
  }
  
  // Si aucun cocktail n'a été trouvé, ajouter quelques classiques
  if (cocktailsRecommandes.length === 0) {
    addCocktailIfExists(cocktailsRecommandes, 'mojito', 'Mojito', personnesNombreuses ? 15 : 8);
    addCocktailIfExists(cocktailsRecommandes, 'margarita', 'Margarita', personnesNombreuses ? 12 : 6);
    addCocktailIfExists(cocktailsRecommandes, 'gin-tonic', 'Gin Tonic', personnesNombreuses ? 10 : 5);
  }
  
  // Créer un message personnalisé
  let message = '';
  if (isSoireeDiner) {
    message = "Pour votre dîner, j'ai sélectionné des cocktails élégants qui accompagneront parfaitement votre repas. Savourez ces mélanges raffinés!";
  } else if (isSoireeGrosse) {
    message = "Pour votre grande fête, voici une sélection de cocktails qui raviront tous vos invités et créeront une ambiance festive inoubliable!";
  } else {
    message = "Pour votre fête, j'ai choisi des cocktails qui plairont à tous et créeront une ambiance conviviale et détendue.";
  }
  
  if (isAmbianceExotique) {
    message += " Ces cocktails aux saveurs exotiques vous transporteront sous les tropiques.";
  } else if (isAmbianceTechno) {
    message += " Ces cocktails colorés et énergisants accompagneront parfaitement votre ambiance festive.";
  }
  
  return {
    cocktails: cocktailsRecommandes,
    message: message
  };
}

// Fonction auxiliaire pour ajouter un cocktail à la liste des recommandations si l'ID existe
function addCocktailIfExists(list: CocktailSuggestion[], id: string, nom: string, quantite: number) {
  // Dans une implémentation réelle, vous vérifieriez l'existence du cocktail dans votre base de données
  // Pour cette démonstration, nous supposons que l'ID est valide
  const cocktailExists = searchCocktails(id).length > 0 || searchCocktails(nom).length > 0;
  
  if (cocktailExists) {
    list.push({ id, nom, quantite });
  } else {
    // Utiliser un ID par défaut si celui spécifié n'existe pas
    const fallbackCocktail = getCocktailById('mojito');
    if (fallbackCocktail) {
      list.push({ id: 'mojito', nom: 'Mojito', quantite });
    }
  }
}