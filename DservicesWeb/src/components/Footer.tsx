// src/components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Columna 1: Logo y descripción */}
        <div className={styles.column}>
          <h3 className={styles.logo}>Delta Services<span>.</span></h3>
          <p>Potencia y fiabilidad para tus proyectos online.</p>
        </div>

        {/* Columna 2: Navegación */}
        <div className={styles.column}>
          <h4>Navegación</h4>
          <ul>
            <li><a href="">Tienda</a></li>
            <li><a href="">Dashboard</a></li>
            <li><a href="">Facturación</a></li>
          </ul>
        </div>

        {/* Columna 3: Soporte */}
        <div className={styles.column}>
          <h4>Soporte</h4>
          <ul>
            <li><a href="https://discord.gg/27zHCptbjf">Comunidad Discord</a></li>
            <li><a href="#">Base de Conocimiento</a></li>
            <li><a href="https://status.deltaservice.xyz/status/deltaservices">Página de Estado</a></li>
          </ul>
        </div>

        {/* Columna 4: Legal */}
        <div className={styles.column}>
          <h4>Legal</h4>
          <ul>
            <li><a href="/TermsService">Términos de Servicio</a></li>
            <li><a href="/PrivacyPolicy">Política de Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Delta Services. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;