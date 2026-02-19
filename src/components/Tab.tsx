import React from 'react';

interface TabProps {
  icon?: React.ReactNode;
  label: string;
  subtitle?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<TabProps> = ({ 
  icon, 
  label, 
  subtitle, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-6 py-4 transition-all relative
        ${isActive 
          ? 'text-blue-600' 
          : 'text-gray-600 hover:text-gray-900'
        }
      `}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <div className="flex flex-col items-start">
        <span className="font-medium">{label}</span>
        {subtitle && (
          <span className="text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
      )}
    </button>
  );
};
