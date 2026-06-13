// Abdul kareem 2500030144
// Abdul kareem 2500030144
// Abdul kareem 2500030144
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
// Abdul kareem 2500030144
// Abdul kareem 2500030144
// Abdul kareem 2500030144