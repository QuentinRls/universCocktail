'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCocktail, FaGlassMartini, FaFlask, FaRocket, FaStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { JSX, useEffect, useState } from 'react';
import { getCategories, getFeaturedCocktails, searchCocktails } from '@/services/cocktailService';
import '@/styles/pages/Home.css';

// Utilisation des icônes pour les catégories
const categoryIcons: Record<string, JSX.Element> = {
  "rhum": <FaGlassMartini />,
  "vodka": <FaGlassMartini />,
  "gin": <FaGlassMartini />,
  "whisky": <FaGlassMartini />,
  "tequila": <FaGlassMartini />,
  "liqueurs": <FaFlask />,
  "sans-alcool": <FaCocktail />,
  "champagne": <FaGlassMartini />,
  "classiques": <FaStar />
};

// Couleurs pour les catégories
const categoryColors: Record<string, string> = {
  "rhum": "from-space-purple to-space-blue",
  "vodka": "from-space-blue to-space-cyan",
  "gin": "from-space-cyan to-space-pink",
  "whisky": "from-space-purple to-space-pink",
  "tequila": "from-space-pink to-space-purple",
  "liqueurs": "from-space-blue to-space-purple",
  "sans-alcool": "from-space-cyan to-space-blue",
  "champagne": "from-space-pink to-space-cyan",
  "classiques": "from-space-blue to-space-pink"
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredCocktails, setFeaturedCocktails] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
    // Récupérer les catégories et les cocktails en vedette à partir du service
    const allCategories = getCategories();
    const featured = getFeaturedCocktails();
    
    // Ajouter les icônes et les couleurs aux catégories
    const enhancedCategories = allCategories.map(cat => ({
      ...cat,
      icon: categoryIcons[cat.id] || <FaGlassMartini />,
      color: categoryColors[cat.id] || "from-space-purple to-space-blue"
    }));
    
    // Ajouter des attributs spécifiques pour la page d'accueil
    const enhancedFeatured = featured.map(cocktail => ({
      ...cocktail,
      galaxyOrigin: cocktail.id === 'mojito' ? 'Constellation de l\'Hydre' :
                    cocktail.id === 'cosmopolitan' ? 'Nébuleuse d\'Orion' :
                    'Système Solaire Proxima'
    }));
    
    setCategories(enhancedCategories);
    setFeaturedCocktails(enhancedFeatured);
  }, []);
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Chercher les cocktails correspondant à la requête
      const searchResults = searchCocktails(query);
      
      // Si un seul résultat, rediriger directement vers la page du cocktail
      if (searchResults.length === 1) {
        router.push(`/cocktail/${searchResults[0].id}`);
      } else {
        // Sinon, rediriger vers la page de recherche avec les résultats
        router.push(`/recherche?q=${encodeURIComponent(query)}`);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section sans animations d'étoiles redondantes */}
      <section className="hero-section">
        <div className="relative z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="hero-title">
              Explorez l'<span className="hero-title-highlight-cyan">Univers</span> des <span className="hero-title-highlight-pink">Cocktails</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Découvrez des recettes cosmiques et créez des mélanges stellaires dans notre galaxie de saveurs
          </motion.p>
          
          <motion.div 
            className="search-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SearchBar 
              placeholder="Ingrédient cosmique ou saveur interstellaire..."
              onSearch={handleSearch}
            />
            
            <motion.div 
              className="search-glow"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="feature-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link href="/recherche?popular=true" className="feature-card card-galactic">
              <div className="feature-card-content">
                <div className="feature-icon-container bg-gradient-to-br from-space-purple to-space-blue">
                  <FaStar className="feature-icon" />
                </div>
                <h3 className="feature-title">Les plus populaires</h3>
                <p className="feature-description">Découvrez les cocktails préférés de notre galaxie</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/categorie/sans-alcool" className="feature-card card-galactic">
              <div className="feature-card-content">
                <div className="feature-icon-container bg-gradient-to-br from-space-cyan to-space-blue">
                  <FaCocktail className="feature-icon" />
                </div>
                <h3 className="feature-title">Sans alcool</h3>
                <p className="feature-description">Des voyages cosmiques accessibles à tous les explorateurs</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/cocktailatrice" className="feature-card card-galactic">
              <div className="feature-card-content">
                <div className="feature-icon-container bg-gradient-to-br from-space-pink to-space-purple">
                  <FaRocket className="feature-icon" />
                </div>
                <h3 className="feature-title">Cocktailatrice</h3>
                <p className="feature-description">Créez vos propres constellations de saveurs pour y voir le prix et les quantités</p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href="/categorie" className="feature-card card-galactic">
              <div className="feature-card-content">
                <div className="feature-icon-container bg-gradient-to-br from-space-cyan to-space-pink">
                  <FaGlassMartini className="feature-icon" />
                </div>
                <h3 className="feature-title">Classement par alcools</h3>
                <p className="feature-description">Explorez les cocktails par type d'alcool et découvrez de nouvelles saveurs</p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href="/creation-sur-mesure" className="feature-card card-galactic">
              <div className="feature-card-content">
                <div className="feature-icon-container bg-gradient-to-br from-space-blue to-space-purple">
                  <FaFlask className="feature-icon" />
                </div>
                <h3 className="feature-title">Nous créons pour vous</h3>
                <p className="feature-description">Des cocktails sur mesure pour votre événement générés par intelligence artificielle</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Cocktails */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-header"
        >
          <h2 className="section-title">Cocktails Stellaires</h2>
          <div className="section-divider"></div>
        </motion.div>
        
        {featuredCocktails.length > 0 && (
          <motion.div 
            className="featured-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredCocktails.map((cocktail, index) => (
              <motion.div key={cocktail.id} variants={itemVariants} custom={index}>
                <Link 
                  href={`/cocktail/${cocktail.id}`}
                  className="featured-item-link"
                >
                  <div className="card-galactic h-full overflow-hidden">
                    <div className="featured-image-container">
                      <Image 
                        src={cocktail.imageUrl} 
                        alt={cocktail.name}
                        fill
                        className="featured-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <motion.div 
                        className="featured-overlay"
                        whileHover={{ opacity: 0.8 }}
                        initial={{ opacity: 0.6 }}
                      />
                      {cocktail.galaxyOrigin && (
                        <div className="featured-origin">
                          {cocktail.galaxyOrigin}
                        </div>
                      )}
                    </div>
                    
                    <div className="featured-content">
                      <h3 className="featured-title">{cocktail.name}</h3>
                      <p className="featured-description">{cocktail.description}</p>
                      
                      <div className="featured-footer">
                        <div className="star-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < 4 ? "star-icon star-filled" : "star-icon star-empty"} 
                            />
                          ))}
                        </div>
                        <span className="explore-link">
                          <FaRocket className="explore-icon" /> Explorer
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="view-all-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href="/recherche" 
            className="btn-galactic"
          >
            Voir tous les cocktails
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </section>
      
      {/* Catégories avec grille spatiale */}
      <section className="section">
        {/* Arrière-plan nébuleux */}
        <div className="categories-background">
          <div className="nebula-radial" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-header"
        >
          <h2 className="section-title">Explorer par Constellation</h2>
          <div className="section-divider"></div>
        </motion.div>
        
        {categories.length > 0 && (
          <motion.div 
            className="categories-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div key={category.id} variants={itemVariants} custom={index}>
                <Link 
                  href={`/categorie/${category.id}`} 
                  className="category-card"
                >
                  <div className={`category-glow bg-gradient-to-r ${category.color}`}></div>
                  
                  <motion.div 
                    className={`category-icon-container bg-gradient-to-r ${category.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {category.icon}
                  </motion.div>
                  
                  <h3 className="category-title">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Fonctionnalités */}
      <section className="section">
        <div className="features-background">
          <motion.div 
            className="features-nebula"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="features-container card-galactic"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="features-header"
          >
            <h2 className="section-title">Fonctionnalités Stellaires</h2>
            <div className="section-divider"></div>
            <p className="features-description">Naviguez à travers notre galaxie de fonctionnalités pour transformer votre expérience cosmique</p>
          </motion.div>
          
          <motion.div 
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="feature-box">
              <motion.div 
                className="feature-box-icon bg-gradient-to-r from-space-purple to-space-blue"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaCocktail className="feature-icon" />
              </motion.div>
              <h3 className="feature-box-title">Cocktailatrice</h3>
              <p className="feature-box-description">Calculez facilement les quantités et créez vos propres constellations de saveurs pout voir le prix</p>
              <Link href="/cocktailatrice" className="btn-galactic text-sm w-base text-center">
                Essayer maintenant
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="feature-box">
              <motion.div 
                className="feature-box-icon bg-gradient-to-r from-space-cyan to-space-pink"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <FaFlask className="feature-icon" />
              </motion.div>
              <h3 className="feature-box-title">Filtres cosmiques</h3>
              <p className="feature-box-description">Naviguez à travers les dimensions de saveurs pour trouver votre élixir parfait</p>
              <Link href="/recherche" className="btn-galactic text-sm w-base text-center">
                Découvrir
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="feature-box">
              <motion.div 
                className="feature-box-icon bg-gradient-to-r from-space-pink to-space-purple"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaStar className="feature-icon" />
              </motion.div>
              <h3 className="feature-box-title">Favoris stellaires</h3>
              <p className="feature-box-description">Marquez vos découvertes favorites pour retrouver facilement votre chemin</p>
              <Link href="/favoris" className="btn-galactic text-sm w-base text-center">
                Voir mes favoris
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
