import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCocktail, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaRocket } from 'react-icons/fa';
import '@/styles/components/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <FaCocktail className="footer-logo-icon" />
              <span className="footer-logo-text">
                Univers<span className="footer-logo-highlight">Cocktail</span>
              </span>
            </div>
            <p className="footer-description">
              Explorez notre univers de cocktails galactiques et découvrez des saveurs venues des confins de l&#39;espace.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">
                <FaFacebook className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FaTwitter className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FaInstagram className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-nav">
              <li>
                <Link href="/" className="footer-nav-item">
                  <span className="nav-bullet">•</span> Accueil
                </Link>
              </li>
              <li>
                <Link href="/recherche" className="footer-nav-item">
                  <span className="nav-bullet">•</span> Recherche
                </Link>
              </li>
              <li>
                <Link href="/categorie" className="footer-nav-item">
                  <span className="nav-bullet">•</span> Catégories
                </Link>
              </li>
              <li>
                <Link href="/cocktailatrice" className="footer-nav-item">
                  <span className="nav-bullet">•</span> Cocktailatrice
                </Link>
              </li>
              <li>
                <Link href="/favoris" className="footer-nav-item">
                  <span className="nav-bullet">•</span> Favoris
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="footer-heading">Constellations</h3>
            <ul className="footer-nav">
              <li>
                <Link href="/categorie/rhum" className="footer-nav-item">
                  <span className="nav-star">✧</span> Rhum
                </Link>
              </li>
              <li>
                <Link href="/categorie/vodka" className="footer-nav-item">
                  <span className="nav-star">✧</span> Vodka
                </Link>
              </li>
              <li>
                <Link href="/categorie/sans-alcool" className="footer-nav-item">
                  <span className="nav-star">✧</span> Sans Alcool
                </Link>
              </li>
              <li>
                <Link href="/categorie/gin" className="footer-nav-item">
                  <span className="nav-star">✧</span> Gin
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <p className="copyright">
              <FaRocket className="copyright-icon" /> 
              © {currentYear} Univers Cocktail Galactique
            </p>
            <motion.p 
              className="footer-tagline"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Voyage interstellaire depuis la Terre • Code Spatial V1.0
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}