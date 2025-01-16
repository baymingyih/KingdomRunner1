import { FormControl } from 'components/ui/form/form-control';
import { FormItem } from 'components/ui/form/form-item';
import { FormLabel } from 'components/ui/form/form-label';
import { FormMessage } from 'components/ui/form/form-message';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Controller, UseFormReturn, FieldError, Path } from 'react-hook-form';

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Spain", "Italy", "Japan", "China", "India", "Brazil",
];

interface CountryStepProps<T extends { country: string }> {
  form: UseFormReturn<T>;
  disabled?: boolean;
}

export function CountryStep<T extends { country: string }>({ form, disabled }: CountryStepProps<T>) {
  return (
    <Controller
      control={form.control}
      name={'country' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger disabled={disabled}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage>
            {(form.formState.errors.country as FieldError)?.message}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
