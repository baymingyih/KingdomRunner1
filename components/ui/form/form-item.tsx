import React from 'react';

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

const FormItem: React.FC<FormItemProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export { FormItem };
