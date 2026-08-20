import React from 'react';

const Container = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div className={`container ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

export default Container;
