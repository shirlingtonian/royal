
import React from 'react';
import { GameProvider } from './contexts/GameProviders'; 
import { AppLayout } from './components/layout/AppLayout'; 

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppLayout />
    </GameProvider>
  );
};

export default App;