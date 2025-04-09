import React, { createContext } from 'react';
import { FormField } from './form/form-field';
import { FormItem } from './form/form-item';
import { FormLabel } from './form/form-label';
import { FormControl } from './form/form-control';
import { FormMessage } from './form/form-message';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from 'zod';

interface FormProps<T extends ZodSchema> {
  children: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  schema: T;
  defaultValues: any;
  mode?: "onSubmit" | "onBlur" | "onChange" | "onTouched" | "all";
}

const Form = <T extends ZodSchema>({ children, onSubmit, schema, defaultValues, mode }: FormProps<T>) => {
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: mode || "onSubmit"
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>{children}</form>
    </FormProvider>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
};
