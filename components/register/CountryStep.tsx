import { FormControl } from 'components/ui/form/form-control';
import { FormItem } from 'components/ui/form/form-item';
import { FormLabel } from 'components/ui/form/form-label';
import { FormMessage } from 'components/ui/form/form-message';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Controller, UseFormReturn, FieldError, Path } from 'react-hook-form';

import { z } from 'zod';

export const countrySchema = z.object({
  country: z.string().min(1, 'Please select your country')
});

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  // Add more countries as needed
];

interface CountryStepProps<T extends { country: string }> {
  form: UseFormReturn<T>;
  disabled?: boolean;
  required?: boolean;
}

import { FormProvider } from 'react-hook-form';

export function CountryStep<T extends { country: string }>({ form, disabled, required }: CountryStepProps<T>) {
  return (
    <FormProvider {...form}>
      <Controller
        control={form.control}
        name={'country' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Country
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage>
              {(form.formState.errors.country as FieldError)?.message}
            </FormMessage>
          </FormItem>
        )}
      />
    </FormProvider>
  );
}
