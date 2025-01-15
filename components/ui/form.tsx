import React from 'react';
import { FormField } from './form/form-field';
import { FormItem } from './form/form-item';
import { FormLabel } from './form/form-label';
import { FormControl } from './form/form-control';
import { FormMessage } from './form/form-message';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

export { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
};
