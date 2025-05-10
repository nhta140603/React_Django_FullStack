import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;