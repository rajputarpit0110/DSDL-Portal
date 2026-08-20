import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
