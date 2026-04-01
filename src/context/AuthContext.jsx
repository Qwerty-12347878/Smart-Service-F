import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  const streamRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const showBrowserNotification = useCallback((notification) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    if (document.visibilityState === 'visible') {
      return;
    }

    new Notification(notification.title, {
      body: notification.message,
      tag: notification._id,
    });
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      setNotificationsLoading(true);
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Unable to load notifications', error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    streamRef.current?.close();
    streamRef.current = null;
    setUser(null);
    setNotifications([]);
    setLastNotification(null);
    localStorage.removeItem('userInfo');
  };

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Unable to mark notification as read', error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      streamRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      streamRef.current?.close();
      streamRef.current = null;
      return;
    }

    fetchNotifications();

    streamRef.current?.close();
    const eventSource = new EventSource(`${backendUrl}/api/notifications/stream`, { withCredentials: true });
    streamRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type !== 'notification' || !payload.notification) {
        return;
      }

      setNotifications((currentNotifications) => [payload.notification, ...currentNotifications].slice(0, 30));
      setLastNotification(payload.notification);
      showToast(payload.notification.title, 'success');
      showBrowserNotification(payload.notification);
    };

    eventSource.onerror = () => {};

    return () => {
      eventSource.close();
      if (streamRef.current === eventSource) {
        streamRef.current = null;
      }
    };
  }, [fetchNotifications, showBrowserNotification, showToast, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && user && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        toast,
        showToast,
        notifications,
        notificationsLoading,
        lastNotification,
        fetchNotifications,
        markNotificationAsRead,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
