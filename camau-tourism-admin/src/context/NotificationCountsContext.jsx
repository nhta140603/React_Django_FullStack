import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getTourBookingPendingCount,
  getRoomBookingPendingCount,
  getNotificationsUnreadCount,
} from "../api/api_generics";

const NotificationCountsContext = createContext();

export function NotificationCountsProvider({ children }) {
  const [counts, setCounts] = useState({
    tour: 0,
    room: 0,
    notification: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const [tour, room, notification] = await Promise.all([
          getTourBookingPendingCount(),
          getRoomBookingPendingCount(),
          getNotificationsUnreadCount(),
        ]);
        if (isMounted) {
          setCounts({
            tour: tour?.count || 0,
            room: room?.count || 0,
            notification: notification?.count || 0,
          });
        }
      } catch {
        if (isMounted) setCounts({ tour: 0, room: 0, notification: 0 });
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <NotificationCountsContext.Provider value={counts}>
      {children}
    </NotificationCountsContext.Provider>
  );
}

export function useNotificationCounts() {
  return useContext(NotificationCountsContext);
}