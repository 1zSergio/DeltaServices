// src/components/Hero.tsx
import React from 'react';
import styles from './Hero.module.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={styles.hero}>
      <div ref={ref} className={`${styles.content} ${isVisible ? styles.contentVisible : ''}`}>
        <h1 className={styles.title}>
          Infraestructura Digital <br />
          <span className={styles.highlight}>Sin Límites.</span>
        </h1>
        <p className={styles.subtitle}>
          Llevamos tus proyectos al siguiente nivel con soluciones de hosting, diseño web y servicios premium de alto rendimiento.
        </p>
      </div>
    </section>
  );
};

export default Hero;