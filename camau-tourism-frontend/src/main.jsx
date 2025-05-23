import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import { Toaster } from "../src/components/ui/sonner";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
  </StrictMode>
);