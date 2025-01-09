import { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import IslandScene from './components/IslandScene';
import BoatLoadingScreen from './components/BoatLoadingScreen';
import Loading from './components/Loading';
import CrowdfundingPage from './pages/Crowdfunding';
import MarketplacePage from './pages/Marketplace';
import EducationPage from './pages/Education';
import CollaborationPage from './pages/Collaboration';
import './App.css';
import Desa1 from './components/Desa1/Desa';
import Desa2 from './components/Desa2/Desa';
import Desa3 from './components/Desa3/Desa';
import Desa4 from './components/Desa4/Desa';
import Desa5 from './components/Desa5/Desa';

function AppContent() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home />} 
      />
      <Route 
        path="/islands" 
        element={
          <>
            <Navbar />
            <IslandScene />
          </>
        } 
      />
      <Route 
        path="/crowdfunding" 
        element={
          <>
            <Navbar />
            <CrowdfundingPage />
          </>
        } 
      />
      <Route 
        path="/marketplace" 
        element={
          <>
            <Navbar />
            <MarketplacePage />
          </>
        } 
      />
      <Route 
        path="/education" 
        element={
          <>
            <Navbar />
            <EducationPage />
          </>
        } 
      />
      <Route 
        path="/collaboration" 
        element={
          <>
            <Navbar />
            <CollaborationPage />
          </>
        } 
      />
      <Route 
        path="/islands/desa1" 
        element={
          <>
            <Navbar />
            <Desa1 />
          </>
        } 
      />
      <Route 
        path="/islands/desa2" 
        element={
          <>
            <Navbar />
            <Desa2 />
          </>
        } 
      />
      <Route 
        path="/islands/desa3" 
        element={
          <>
            <Navbar />
            <Desa3 />
          </>
        } 
      />
      <Route 
        path="/islands/desa4" 
        element={
          <>
            <Navbar />
            <Desa4 />
          </>
        } 
      />
      <Route 
        path="/islands/desa5" 
        element={
          <>
            <Navbar />
            <Desa5 />
          </>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      {isLoading ? (
        <Loading onComplete={() => setIsLoading(false)} />
      ) : (
        <Suspense fallback={
          <div className="fixed inset-0 z-50">
            <BoatLoadingScreen />
          </div>
        }>
          <AppContent />
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
