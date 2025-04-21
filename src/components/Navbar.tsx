import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCocktail, FaSearch, FaFilter, FaStar, FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import '@/styles/components/Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/recherche', label: 'Recherche', icon: <FaSearch /> },
    { href: '/categorie', label: 'Catégories', icon: <FaFilter /> },
    { href: '/cocktailatrice', label: 'Cocktailatrice', icon: <FaCocktail /> },
    { href: '/favoris', label: 'Favoris', icon: <FaStar /> },
  ];

  // Animations
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.nav 
      className={`sticky ${scrolled ? 'nav-scrolled' : 'nav-transparent'}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="nav-container">
        <div className="nav-inner">
          <Link href="/" className="brand-link">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="brand-icon"
            >
              <FaCocktail className="text-space-cyan icon-size" />
            </motion.div>
            <h1 className="brand-title">
              <span className="text-space-star">Univers</span>
              <span className="text-space-cyan">Cocktail</span>
            </h1>
          </Link>

          {/* Menu pour desktop */}
          <div className="desktop-menu nav-links-container">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  pathname === link.href ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {pathname === link.href && (
                  <motion.div 
                    className="nav-underline"
                    layoutId="navbar-underline"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Menu pour mobile */}
          <div className="mobile-menu-button">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-space-star hover:text-space-cyan focus:outline-none orbit-hover"
              aria-label="Menu navigation"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mobile-menu`}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="mobile-menu-content mobile-menu-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-menu-link ${
                pathname === link.href 
                  ? 'mobile-menu-link-active' 
                  : 'mobile-menu-link-inactive'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}