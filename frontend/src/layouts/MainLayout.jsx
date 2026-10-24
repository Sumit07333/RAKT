import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import DemoDataBanner from '../components/common/DemoDataBanner';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <DemoDataBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
