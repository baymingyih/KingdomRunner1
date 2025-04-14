import { FormControl } from 'components/ui/form/form-control';
import { FormItem } from 'components/ui/form/form-item';
import { FormLabel } from 'components/ui/form/form-label';
import { FormMessage } from 'components/ui/form/form-message';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Controller, UseFormReturn, FieldError, Path } from 'react-hook-form';
import countriesData from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register English locale
countriesData.registerLocale(enLocale);

// Get country names in English
const countryNames = countriesData.getNames('en', {select: 'official'});

// Define priority Asian countries (ISO codes)
const asianCountries = ['CN', 'IN', 'JP', 'ID', 'PK', 'BD', 'PH', 'VN', 'TH', 'KR'];

// Get Asian country names and filter out undefined
const asianCountryNames = asianCountries
  .map(code => countryNames[code])
  .filter(Boolean);

// Get all other country names, filter out Asian countries and undefined
const otherCountryNames = Object.values(countryNames)
  .filter(name => 
    name && 
    !asianCountryNames.includes(name)
  )
  .sort((a, b) => a.localeCompare(b));

// Combine both lists
const countries = [...asianCountryNames, ...otherCountryNames];

// Debug output
console.log('Loaded countries:', countries);

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
            <SelectContent className="max-h-60 overflow-y-auto">
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
