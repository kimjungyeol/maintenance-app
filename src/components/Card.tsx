import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 'var(--card-radius)',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    ...style,
  };

  return <div style={cardStyle}>{children}</div>;
};

export default Card;
