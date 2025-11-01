import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Resume from './components/Resume';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Achievements from './components/Achievements';
import Extracurricular from './components/Extracurricular';
import Contact from './components/Contact';
import Footer from './components/Footer';

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'resume', 'skills', 'portfolio', 'achievements', 'extracurricular', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <Navigation activeSection={activeSection} />
      
      <main>
        <Hero />
        <About />
        <Resume />
        <Skills />
        <Portfolio />
        {/* <Achievements /> */}
        <Extracurricular />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default AppContent;