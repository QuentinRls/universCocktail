'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCategories, Category } from '@/services/cocktailService';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Charger les catégories
  useEffect(() => {
    const timer = setTimeout(() => {
      const categoriesData = getCategories();
      setCategories(categoriesData);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen star-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-title mb-4">Galaxies de Saveurs</h1>
          <p className="text-lg max-w-2xl mx-auto text-space-star/80">
            Explorez nos constellations de cocktails, regroupées par ingrédient principal ou style de préparation.
          </p>
        </motion.div>
        
        {isLoading ? (
          // État de chargement
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(index => (
              <div key={index} className="cosmic-border rounded-lg overflow-hidden bg-space-nebula/20 backdrop-blur-sm h-64 animate-pulse">
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map(category => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={`/categorie/${category.id}`} className="block h-full">
                  <div className="cosmic-border rounded-lg overflow-hidden bg-space-nebula/20 backdrop-blur-sm hover:glow transition-all h-full p-6 flex flex-col">
                    <h2 className="text-2xl font-title text-space-cyan mb-3">{category.name}</h2>
                    <p className="text-space-star/80 flex-grow mb-4">{category.description}</p>
                    <div className="cosmic-border w-full py-2 px-4 rounded-full text-center bg-space-dark/50 hover:bg-space-dark/80 transition-colors">
                      Explorer
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}