"use client"

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from 'components/ui/button';
import { FormField } from 'components/ui/form/form-field';
import { FormItem } from 'components/ui/form/form-item';
import { FormLabel } from 'components/ui/form/form-label';
import { FormControl } from 'components/ui/form/form-control';
import { FormMessage } from 'components/ui/form/form-message';
import { Input } from 'components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'components/ui/card';
import { Alert, AlertDescription } from 'components/ui/alert';
import { useToast } from 'components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, error: authError, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginData) => {
    setError(null);
    
    try {
      const user = await login(values.email, values.password);
      
      // Wait for auth state to settle and cookies to be set
      console.log('Waiting for auth state to settle...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Checking cookies after delay:', document.cookie);
      
      toast({
        title: "Login Successful",
        description: "You are now signed in",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      setError('Login failed: ' + errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Card className="w-full sm:max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Sign in to your Kingdom Runners account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || authError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error || authError}</AlertDescription>
            </Alert>
          )}
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                name="email"
                label="Email"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                )}
              />
              <FormField
                name="password"
                label="Password"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                )}
              />
              <Button type="submit" className="w-full py-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </FormProvider>
          
          <div className="mt-4 sm:mt-6 text-center space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
