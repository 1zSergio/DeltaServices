// src/components/Legal.tsx
import React from 'react';
import styles from './TermsService.module.css';

const Legal: React.FC = () => {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.document}>
        <h1 className={styles.mainTitle}>Términos y Políticas</h1>
        
        {/* --- TÉRMINOS DE SERVICIO --- */}
        <h2 className={styles.sectionTitle}>Términos de Servicio</h2>
        <p className={styles.lastUpdated}>Última actualización: 1 de julio de 2025</p>
        
        <p>Bienvenido a Delta Services. Los siguientes términos y condiciones ("Términos") rigen el uso de todos nuestros servicios. Al contratar o utilizar nuestros servicios, usted acepta estos Términos en su totalidad.</p>

        <h3>1. Descripción de los Servicios</h3>
        <p>Delta Services ofrece servicios de Hosting Web, Hosting Reseller, Venta de Cuentas Premium y Diseño Web.</p>

        <h3>2. Política de Uso Aceptable</h3>
        <p>El Usuario se compromete a no utilizar los servicios para fines ilícitos. Queda estrictamente prohibido alojar contenido ilegal, realizar spam, consumir recursos del servidor de forma excesiva o ejecutar software malicioso.</p>

        <h3>3. Pagos, Renovaciones y Reembolsos</h3>
        <p>Los servicios se abonan por adelantado. La falta de pago resultará en la suspensión y eventual terminación del servicio. Ofrecemos una garantía de devolución de 14 días para nuevos contratos de hosting. Los dominios y cuentas premium no son reembolsables.</p>
        
        {/* --- POLÍTICA DE PRIVACIDAD --- */}
        <h2 className={styles.sectionTitle}>Política de Privacidad</h2>
        <p className={styles.lastUpdated}>Última actualización: 1 de julio de 2025</p>

        <p>Esta Política de Privacidad describe cómo Delta Services recoge, utiliza y protege su información personal al usar nuestros servicios.</p>

        <h3>1. Responsable del Tratamiento</h3>
        <p><strong>Empresa:</strong> Delta Services<br/><strong>Email:</strong> legal@deltaservice.xyz</p>

        <h3>2. Información Recogida</h3>
        <p>Recogemos datos de identificación (nombre, email), facturación (dirección, NIF) e información técnica (IP, logs) para la correcta prestación de los servicios.</p>

        <h3>3. Finalidad de los Datos</h3>
        <p>Usamos sus datos para gestionar su cuenta, facturar, dar soporte técnico y cumplir con nuestras obligaciones legales. Solo enviaremos marketing con su consentimiento explícito.</p>

        <h3>4. Sus Derechos (RGPD)</h3>
        <p>Usted tiene derecho a acceder, rectificar, suprimir, limitar, oponerse y solicitar la portabilidad de sus datos. Puede ejercer estos derechos contactándonos en el email proporcionado.</p>
        
        <p className={styles.disclaimer}><strong>Aviso:</strong> Este es un resumen de nuestros términos. Para la versión completa y detallada, por favor consulte los documentos legales vinculados en el pie de página de nuestro sitio principal.</p>

      </div>
    </div>
  );
};

export default Legal;