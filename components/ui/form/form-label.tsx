import React from 'react';
import { Label } from '../label';

interface FormLabelProps extends React.ComponentProps<typeof Label> {}

const FormLabel: React.FC<FormLabelProps> = ({ children, ...props }) => {
  return <Label {...props}>{children}</Label>;
};

export { FormLabel };
