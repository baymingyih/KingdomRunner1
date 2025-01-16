import { FormControl } from "components/ui/form/form-control";
import { FormField } from "components/ui/form/form-field";
import { FormItem } from "components/ui/form/form-item";
import { FormLabel } from "components/ui/form/form-label";
import { Input } from "components/ui/input";
import { UseFormReturn } from 'react-hook-form';

interface EmailStepProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

import { FormProvider } from 'react-hook-form';

export function EmailStep({ form, disabled }: EmailStepProps) {
  return (
    <FormProvider {...form}>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="your@email.com" disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="confirmEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Confirm your email" disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="••••••••" disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="••••••••" disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormProvider>
  );
}
