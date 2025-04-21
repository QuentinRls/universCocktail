import json
import re
import unicodedata
import urllib.parse
import random
import math
import os
import pandas as pd
import datetime
# Remove or replace ace_tools import since it's not available
import itertools

# Permettez à l'utilisateur de spécifier le chemin du fichier d'entrée
print("=== Script d'enrichissement des données de cocktails ===")

# Option 1: Utiliser un chemin absolu que vous spécifiez
file_prev = input("Entrez le chemin complet vers le fichier JSON d'entrée\n(ou appuyez sur Entrée pour utiliser le chemin par défaut): ")

if not file_prev:
    # Option 2: Utiliser le chemin par défaut
    input_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    file_prev = os.path.join(input_dir, "cocktails_200_relevant_images.json")
    
    # Afficher l'emplacement attendu pour le fichier
    print(f"\nChemin par défaut utilisé: {file_prev}")
    print("Assurez-vous que le fichier existe à cet emplacement.")

# Définir le chemin de sortie (dans le même dossier que le fichier d'entrée)
output_dir = os.path.dirname(file_prev)
final_path = os.path.join(output_dir, "cocktails_200_full_v2.json")

# Check if input file exists
if not os.path.exists(file_prev):
    print(f"\nErreur : Le fichier d'entrée '{file_prev}' n'existe pas.")
    
    # Option 3: Proposer de créer un exemple de fichier avec un petit jeu de données
    create_sample = input("\nVoulez-vous créer un exemple de fichier de données pour tester le script? (o/n): ")
    
    if create_sample.lower() == 'o':
        # Créer le dossier de destination s'il n'existe pas
        os.makedirs(os.path.dirname(file_prev), exist_ok=True)
        
        # Exemple de structure de données minimale
        sample_data = [
            {
                "name": "Mojito",
                "types": ["long-drink"],
                "ingredients": [
                    {"name": "Rhum blanc", "quantity": "6 cl"},
                    {"name": "Menthe fraîche", "quantity": "10 feuilles"},
                    {"name": "Citron vert", "quantity": "1"},
                    {"name": "Sucre", "quantity": "2 cuillères à café"},
                    {"name": "Eau gazeuse", "quantity": "Top"}
                ],
                "instructions": "Écraser la menthe et le citron, ajouter le sucre, le rhum, remplir de glace, et compléter avec l'eau gazeuse.",
                "isAlcoholic": True,
                "alcoholDegree": 15,
                "flavors": ["sucré", "acide"],
                "image_url": "mojito.jpg"
            },
            {
                "name": "Virgin Colada",
                "types": ["sans-alcool"],
                "ingredients": [
                    {"name": "Jus d'ananas", "quantity": "12 cl"},
                    {"name": "Lait de coco", "quantity": "6 cl"}
                ],
                "instructions": "Mélanger tous les ingrédients avec de la glace dans un blender.",
                "isAlcoholic": False,
                "alcoholDegree": 0,
                "flavors": ["sucré"],
                "image_url": "virgin_colada.jpg"
            }
        ]
        
        with open(file_prev, "w", encoding="utf-8") as f:
            json.dump(sample_data, f, ensure_ascii=False, indent=2)
        
        print(f"\nFichier d'exemple créé avec succès: {file_prev}")
    else:
        print("\nArrêt du script. Veuillez fournir un fichier d'entrée valide.")
        exit(1)

# Charger le fichier
with open(file_prev, "r", encoding="utf-8") as f:
    cocktails_extended = json.load(f)

print(f"\nFichier chargé avec succès. {len(cocktails_extended)} cocktails trouvés.")

# functions defined again
RED_ING={'Campari','Grenadine','Cranberry Juice','Cranberry','Strawberries','Raspberry','Cherry','Pomegranate','Cerise'}
GREEN_ING={'Mint','Midori','Crème de Menthe','Basil','Absinthe','Menthe'}
BLUE_ING={'Blue Curaçao'}
ORANGE_ING={'Orange Juice','Peach','Apricot','Mango','Carrot','Orange'}
BROWN_ING={'Coffee','Coffee Liqueur','Chocolate','Kahlua','Cola','Coffee'}
CREAMY_ING={'Cream','Milk','Coconut Cream','Condensed Milk','Crème','Lait'}

def guess_color(ingredients):
    names=set()
    for ing in ingredients:
        clean=re.sub(r'\W+',' ',ing)
        names.update(clean.split())
    if names & RED_ING: return 'Rouge'
    if names & GREEN_ING: return 'Vert'
    if names & BLUE_ING: return 'Bleu'
    if names & ORANGE_ING: return 'Orange'
    if names & BROWN_ING: return 'Brun'
    if names & CREAMY_ING: return 'Blanc/Crème'
    return 'Jaune/Ambré'

def is_fizzy(ingredients):
    fizzy_words = ['soda','champagne','prosecco','ginger beer','tonic','cola','ale','beer','sparkling','cider','club soda']
    for ing in ingredients:
        low=ing.lower()
        if any(word in low for word in fizzy_words):
            return 'Pétillant'
    return 'Non Pétillant'

def volume_estimate(types):
    t=types[0] if types else ''
    return {'short-drink':90,'long-drink':150,'shooter':45,'pétillant':120}.get(t,120)

def cost_estimate(ingredients, types):
    expensive = ['champagne','chartreuse','cognac','mezcal']
    if any(exp in ing['name'].lower() for ing in ingredients for exp in expensive):
        return '8-12€'
    if types[0]=='sans-alcool': return '2-3€'
    if types[0]=='shooter': return '3-4€'
    if types[0]=='long-drink': return '4-6€'
    return '5-7€'

def calories_estimate(types, isAlcoholic, containsCream):
    if not isAlcoholic:
        return '60-120 kcal'
    if containsCream:
        return '250-350 kcal'
    if types[0]=='short-drink':
        return '150-200 kcal'
    if types[0]=='long-drink':
        return '120-180 kcal'
    if types[0]=='pétillant':
        return '110-160 kcal'
    return '100-200 kcal'

def balance(flavor_list):
    if 'sucré' in flavor_list:
        if 'acide' in flavor_list or 'amer' in flavor_list:
            return 'Doux'
        return 'Sucré'
    return 'Sec'

def alcohol_level(abv):
    if abv==0: return 'Sans alcool'
    if abv < 15: return 'Faible'
    if abv < 25: return 'Moyen'
    return 'Élevé'

def garnish_suggestion(ingredients):
    names=' '.join(ing['name'].lower() for ing in ingredients)
    if 'mint' in names or 'menthe' in names:
        return 'Brin de menthe'
    if 'lime' in names or 'citron vert' in names:
        return 'Rondelle de citron vert'
    if 'lemon' in names or re.search(r'citron(?! vert)', names):
        return 'Rondelle de citron'
    if 'orange' in names:
        return 'Zeste d’orange'
    if 'cherry' in names or 'cerise' in names:
        return 'Cerise au marasquin'
    return 'Aucune'

def tools_needed(types):
    if types[0]=='short-drink':
        return ['Shaker','Passoire','Cuillère de bar']
    if types[0]=='long-drink':
        return ['Cuillère de bar','Pilonn']
    if types[0]=='shooter':
        return ['Verre à shot']
    if types[0]=='pétillant':
        return ['Cuillère de bar']
    return ['Cuillère de bar']

for c in cocktails_extended:
    vol = volume_estimate(c['types'])
    c['volumeCocktailMl'] = vol
    # rename existing difficulty if exists
    diff = c.pop('difficulty', c.get('realisation', 'facile'))
    c['realisation'] = diff
    c['ingredientCount'] = len(c['ingredients'])
    c['balance'] = balance(c['flavors'])
    c['couleur'] = guess_color([ing['name'] for ing in c['ingredients']])
    c['petillance'] = is_fizzy([ing['name'] for ing in c['ingredients']])
    containsCream = any('cream' in ing['name'].lower() or 'crème' in ing['name'].lower() or 'lait' in ing['name'].lower() for ing in c['ingredients'])
    c['cost'] = cost_estimate(c['ingredients'], c['types'])
    c['calories'] = calories_estimate(c['types'], c['isAlcoholic'], containsCream)
    c['pureAlcoholMl'] = round(vol * c['alcoholDegree']/100, 1)
    c['alcoholLevel'] = alcohol_level(c['alcoholDegree'])
    c['decoration'] = garnish_suggestion(c['ingredients'])
    c['tools'] = tools_needed(c['types'])
    # ensure preparationTime present
    c.setdefault('preparationTime', '4 minutes')
    c['history'] = c.get('history', f"{c['name']} est un cocktail emblématique apprécié depuis le XXᵉ siècle.")

# save
with open(final_path, "w", encoding="utf-8") as f:
    json.dump(cocktails_extended, f, ensure_ascii=False, indent=2)

print(f"\nFichier sauvegardé avec succès : {final_path}")

sample_df = pd.DataFrame(cocktails_extended[:5])[['name', 'volumeCocktailMl', 'realisation', 'ingredientCount', 'balance', 'couleur', 'petillance', 'cost', 'calories', 'pureAlcoholMl', 'alcoholLevel', 'decoration', 'tools']]
# Replace the tools function with pandas display method
print("\nAperçu enrichi (5 premiers cocktails):")
print(sample_df)
print(f"\nNombre total de cocktails traités : {len(cocktails_extended)}")
