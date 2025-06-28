import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow time for exit animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow time for exit animation
  };
  
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} className="text-white" />;
      case 'success':
        return <CheckCircle size={20} className="text-white" />;
      case 'info':
        return <Info size={20} className="text-white" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-white" />;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600';
      case 'success':
        return 'bg-green-600';
      case 'info':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-yellow-600';
    }
  };
  
  const getContentBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      case 'info':
        return 'bg-blue-50';
      case 'warning':
        return 'bg-yellow-50';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'success':
        return 'text-green-800';
      case 'info':
        return 'text-blue-800';
      case 'warning':
        return 'text-yellow-800';
    }
  };
  
  return (
    <div 
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex shadow-lg rounded-lg overflow-hidden max-w-md w-full">
        {/* Icon Section */}
        <div className={`${getBackgroundColor()} p-4 flex items-center justify-center`}>
          {getIcon()}
        </div>
        
        {/* Content Section */}
        <div className={`${getContentBackgroundColor()} ${getTextColor()} flex-1 p-4 pr-10`}>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className={`absolute top-2 right-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 ${getTextColor()}`}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;