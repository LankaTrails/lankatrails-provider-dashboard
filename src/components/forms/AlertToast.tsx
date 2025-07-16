import React, { useEffect } from "react";

interface AlertToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const AlertToast: React.FC<AlertToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed bottom-6 left-6 z-50 
        px-4 py-3 rounded-lg shadow-lg text-white
        animate-slide-in
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
      style={{ whiteSpace: 'pre-line' }}
    >
      {message}
    </div>
  );
};

export default AlertToast;
