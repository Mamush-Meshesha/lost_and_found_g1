import React from 'react';
import Footer from './Footer';
import { HeroSection } from '../sections/HeroSection';


export const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <HeroSection />
      
      <Footer />
    </div>
  );
};

export default Layout;
