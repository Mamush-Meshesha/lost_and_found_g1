import React from 'react';
import Layout from './components/layout/Layout';
import LostFoundApp from './components/LostFoundApp';
import HeroSection from './components/sections/HeroSection';
import ProblemsSection from './components/sections/ProblemsSection';
import ProblemShellsSection from './components/sections/ProblemShellsSection';
import AboutSection from './components/sections/AboutSection';
import TechnologySection from './components/sections/TechnologySection';

function App() {
  return (
    <Layout>
      <LostFoundApp />
      <HeroSection />
      <ProblemsSection />
      <ProblemShellsSection />
      <AboutSection />
      <TechnologySection />
    </Layout>
  );
}

export default App;
