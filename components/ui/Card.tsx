import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface rounded-lg shadow-md border border-brand-border ${className}`}>
      {children}
    </div>
  );
};