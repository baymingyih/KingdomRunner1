import React from 'react';
import { useFormContext, useForm } from 'react-hook-form';

interface FormMessageProps {
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({ name, children, className }) => {
  const context = useFormContext();
  const { formState: { errors } } = context || useForm();
  
  const errorMessage = name && errors[name]?.message;
  const displayMessage = errorMessage ? String(errorMessage) : children;
  
  return (
    <p className={className}>
      {displayMessage}
    </p>
  );
};

export { FormMessage };
