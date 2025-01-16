import { FormField } from "components/ui/form/form-field";
import { FormItem } from "components/ui/form/form-item";
import { FormLabel } from "components/ui/form/form-label";
import { FormControl } from "components/ui/form/form-control";
import { FormMessage } from "components/ui/form/form-message";
import { Input } from "components/ui/input";
import { UseFormReturn, FieldPathValue } from 'react-hook-form';

interface NameStepProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

import { FormProvider } from 'react-hook-form';

export function NameStep({ form, disabled }: NameStepProps) {
  return (
    <FormProvider {...form}>
      <FormField
        name="firstName"
        render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="John" disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="lastName"
        render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Doe" disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormProvider>
  );
}
