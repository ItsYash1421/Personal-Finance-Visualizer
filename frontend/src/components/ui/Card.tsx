import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  noTransitions?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true, noTransitions = false }) => {
  return (
    <div className={`glass-effect rounded-2xl shadow-xl border border-white/20 ${
      noTransitions 
        ? '' 
        : `transition-all duration-500 animate-fade-in ${
            hover ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:scale-[1.02]' : ''
          }`
    } ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gradient-to-r from-gray-100/50 to-blue-100/50 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};