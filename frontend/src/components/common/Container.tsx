import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', id }) => {
  return (
    <div id={id} className={`container-custom ${className}`}>
      {children}
    </div>
  );
};

export default Container;
