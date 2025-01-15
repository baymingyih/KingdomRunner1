import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown } from 'lucide-react';

type SelectProps = React.ComponentPropsWithoutRef<'div'> & {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
};

const Select = React.forwardRef<React.ElementRef<'div'>, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className={cn('relative', className)} ref={ref} {...props}>
      {children}
    </div>
  )
);
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, children, ...props }, ref) => (
  <button
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  >
    <SelectValue />
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn(
      'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
}

const SelectItem = React.forwardRef<
  React.ElementRef<'div'>,
  SelectItemProps
>(({ className, children, value, ...props }, ref) => (
  <div
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      className
    )}
    ref={ref}
    {...props}
    data-value={value}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"></span>
    {children}
  </div>
));
SelectItem.displayName = 'SelectItem';

interface SelectValueProps extends React.ComponentPropsWithoutRef<'span'> {
  placeholder?: React.ReactNode;
}

const SelectValue = React.forwardRef<React.ElementRef<'span'>, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => (
    <span className={cn('ml-2 block truncate', className)} ref={ref} {...props}>
      {children || placeholder}
    </span>
  )
);
SelectValue.displayName = 'SelectValue';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
