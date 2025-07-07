import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  text = "Back",
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - go back in browser history
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      {text}
    </button>
  );
};

export default BackButton;
