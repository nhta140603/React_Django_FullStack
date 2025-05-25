import React, { createContext, useContext } from "react";
import { toast } from "sonner";
const NotificationContext = createContext();
export function NotificationProvider({ children }) {
  const showNotification = (message, options = {}) => {
    toast(message, options);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
export function useNotification() {
  return useContext(NotificationContext);
}