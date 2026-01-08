import React from 'react';

interface ButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  size = 'medium',
}) => {
  const getPadding = () => {
    switch (size) {
      case 'small': return '6px 12px';
      case 'large': return '14px 24px';
      default: return '10px 16px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return '13px';
      case 'large': return '17px';
      default: return '15px';
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return 'var(--primary-color)';
      case 'success': return '#22c55e';
      case 'secondary': return 'var(--secondary-color)';
      default: return 'var(--primary-color)';
    }
  };

  const styles: React.CSSProperties = {
    backgroundColor: getBackgroundColor(),
    color: '#fff',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    padding: getPadding(),
    fontSize: getFontSize(),
  };

  return (
    <button type={type} onClick={onClick} style={styles} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
