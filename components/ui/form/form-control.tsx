import React from 'react';

interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

const FormControl: React.FC<FormControlProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export { FormControl };
