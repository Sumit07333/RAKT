import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import BloodSearchPage from './pages/BloodSearchPage';
import FacilityDetailsPage from './pages/FacilityDetailsPage';
import EmergencyRequestPage from './pages/EmergencyRequestPage';
import TrackRequestPage from './pages/TrackRequestPage';
import AboutPage from './pages/AboutPage';
import OperatorLoginPage from './pages/OperatorLoginPage';
import OperatorDashboardPage from './pages/OperatorDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './hooks/useToast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="find-blood" element={<BloodSearchPage />} />
            <Route path="facilities/:id" element={<FacilityDetailsPage />} />
            <Route path="emergency-request" element={<EmergencyRequestPage />} />
            <Route path="track-request" element={<TrackRequestPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="operator/login" element={<OperatorLoginPage />} />
            <Route path="operator/dashboard" element={<OperatorDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
