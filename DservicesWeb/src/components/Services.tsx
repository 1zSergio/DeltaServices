// src/components/Services.tsx
import React from 'react';
import styles from './Services.module.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// ... (El componente ServiceCard se mantiene igual)
interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  link: string; // Asegúrate de que la interfaz incluya 'link'
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, className = '', link }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  return (
    <div ref={ref} className={`${styles.card} ${className} reveal ${isVisible ? 'reveal-visible' : ''}`}>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <a href={link} className={styles.button}> {/* Usamos la propiedad link */}
        Explorar →
      </a>
    </div>
  );
};

const Services: React.FC = () => {
  const serviceData: ServiceCardProps[] = [
    { icon: '🎨', title: 'Diseño Web a Medida', description: 'Webs que no solo lucen increíbles, sino que convierten visitantes en clientes.', className: styles.cardLarge, link: "#" },
    {
      icon: '🚀',
      title: 'Hosting de Élite',
      description: 'Rendimiento y seguridad para que solo te preocupes de crecer.',
      className: '',
      link: 'http://hosting.deltaservice.xyz' // <-- ENLACE ACTUALIZADO
    },
    { icon: '💼', title: 'Planes Reseller', description: 'Inicia tu imperio de hosting con nuestra sólida infraestructura.', className: '', link: "#" },
    { icon: '⭐', title: 'Cuentas Premium', description: 'Acceso VIP a las herramientas y servicios que amas.', className: styles.cardWide, link: "#" },
  ];
  
  return (
    <section className={styles.services}>
      <div className={styles.grid}>
        {serviceData.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
};
    
export default Services;