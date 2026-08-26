import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
