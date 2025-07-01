// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          Delta<span>Services</span>
        </a>
        <nav className={styles.nav}>
          <a href="#">Servicios</a>
          <a href="#">Nosotros</a>
          {/* LÍNEA AÑADIDA */}
            <a href="https://discord.gg/27zHCptbjf" className={styles.contactButton}>Discord</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;