import React from 'react';
import { Label } from '../label';
import { FormControl } from './form-control';
import { FormMessage } from './form-message';
import { Controller, useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label?: string;
  render: (props: { field: any }) => React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, render }) => {
  const { control } = useFormContext();
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {label && <Label>{label}</Label>}
          <FormControl>
            {render({ field })}
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </div>
      )}
    />
  );
};

export { FormField };
