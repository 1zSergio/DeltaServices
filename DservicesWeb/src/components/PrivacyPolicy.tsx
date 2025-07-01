// src/components/PrivacyPolicy.tsx
import React from 'react';
import styles from './TermsService.module.css'; // Reutilizamos los mismos estilos de la página legal

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.document}>
        <h1 className={styles.mainTitle}>Política de Privacidad</h1>
        <p className={styles.lastUpdated}>Última actualización: 1 de julio de 2025</p>

        <p>Esta Política de Privacidad describe cómo Delta Services recoge, utiliza y protege su información personal al usar nuestros servicios.</p>

        <h3>1. Responsable del Tratamiento</h3>
        <p><strong>Empresa:</strong> Delta Services<br/><strong>Email:</strong> contacto@deltaservice.xyz</p>

        <h3>2. Información Recogida</h3>
        <p>Recogemos datos de identificación (nombre, email), facturación (dirección, NIF) e información técnica (IP, logs) para la correcta prestación de los servicios.</p>

        <h3>3. Finalidad de los Datos</h3>
        <p>Usamos sus datos para gestionar su cuenta, facturar, dar soporte técnico y cumplir con nuestras obligaciones legales. Solo enviaremos marketing con su consentimiento explícito.</p>

        <h3>4. ¿Cuánto tiempo conservamos sus datos?</h3>
        <p>Conservaremos sus datos mientras mantenga una relación comercial con nosotros y durante los plazos legalmente exigidos una vez finalizada.</p>

        <h3>5. ¿Con quién compartimos sus datos?</h3>
        <p>No vendemos sus datos. Solo los compartimos con proveedores de pago, registradores de dominios y autoridades públicas cuando es estrictamente necesario.</p>

        <h3>6. Sus Derechos (RGPD)</h3>
        <p>Usted tiene derecho a acceder, rectificar, suprimir, limitar, oponerse y solicitar la portabilidad de sus datos. Puede ejercer estos derechos contactándonos en el email proporcionado.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;