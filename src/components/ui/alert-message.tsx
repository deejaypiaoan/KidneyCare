import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertMessageProps {
  type: AlertType;
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type = "info",
  message,
  duration = 5000, // 5 seconds default
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  // Bootstrap-style alert classes
  const alertClasses = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const iconMap = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <div
      className={`border px-4 py-3 rounded relative ${alertClasses[type]} mb-4`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2">{iconMap[type]}</span>
        <span className="block sm:inline">{message}</span>
        <button
          onClick={handleClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;
