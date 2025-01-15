import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormMessageProps {
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({ name, children, className }) => {
  const { formState: { errors } } = useFormContext();
  
  const errorMessage = name && errors[name]?.message;
  const displayMessage = errorMessage ? String(errorMessage) : children;
  
  return (
    <p className={className}>
      {displayMessage}
    </p>
  );
};

export { FormMessage };
