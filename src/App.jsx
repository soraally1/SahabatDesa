import { Suspense, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import SeaIsland from './components/SeaIsland';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [currentWorld, setCurrentWorld] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleWorldTransition = () => {
    setIsTransitioning(true);
    // Wait for fade out animation
    setTimeout(() => {
      setCurrentWorld('seaIsland');
      // Wait a bit before removing the transition overlay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 1000);
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Only show Navbar in SeaIsland world */}
        {currentWorld === 'seaIsland' && <Navbar />}
        
        <Suspense fallback={
          <div className="loading-screen">
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: '100%' }} />
            </div>
            <p>Loading...</p>
          </div>
        }>
          {currentWorld === 'home' ? (
            <Home onStartClick={handleWorldTransition} />
          ) : (
            <SeaIsland />
          )}

          {/* Transition Overlay */}
          {isTransitioning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-xl">Memasuki Dunia SahabatDesa...</p>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
