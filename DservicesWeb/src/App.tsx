// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa todos tus componentes
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsService from './components/TermsService';

// Componente para la Página Principal
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
    </>
  );
};

// Componente principal de la aplicación con las nuevas rutas
const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* --- NUEVAS RUTAS LEGALES --- */}
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/TermsService" element={<TermsService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;