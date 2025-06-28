import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification, { NotificationType } from '../components/common/Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  requireAction?: boolean;
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
    requireAction?: boolean
  ) => string;
  hideNotification: (id: string) => void;
  showError: (title: string, message: string, duration?: number) => string;
  showSuccess: (title: string, message: string, duration?: number) => string;
  showInfo: (title: string, message: string, duration?: number) => string;
  showWarning: (title: string, message: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      duration = 5000,
      requireAction = false
    ): string => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setNotifications(prev => [
        ...prev,
        { id, type, title, message, duration, requireAction }
      ]);
      
      return id;
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showError = useCallback(
    (title: string, message: string, duration?: number): string => {
      return showNotification('error', title, message, duration);
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number): string => {
      return showNotification('success', title, message, duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number): string => {
      return showNotification('info', title, message, duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number): string => {
      return showNotification('warning', title, message, duration);
    },
    [showNotification]
  );

  const value = {
    showNotification,
    hideNotification,
    showError,
    showSuccess,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          requireAction={notification.requireAction}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};