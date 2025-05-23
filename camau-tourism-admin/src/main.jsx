import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import AppRoutes from './routes/AppRoutes';
import { AdminAuthProvider } from "./context/authContext";
import { NotificationCountsProvider } from "./context/NotificationCountsContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <NotificationCountsProvider>
        <AppRoutes />
      </NotificationCountsProvider>
    </AdminAuthProvider>
  </StrictMode>
);
