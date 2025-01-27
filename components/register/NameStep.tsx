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

export function NameStep({ form, disabled }: NameStepProps) {
  return (
    <>
      <FormField
        name="firstName"
        render={({ field }) => (
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Doe" disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
