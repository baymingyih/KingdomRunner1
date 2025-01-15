"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from 'components/ui/button';
import { Form } from 'components/ui/form';
import { FormField } from 'components/ui/form/form-field';
import { FormItem } from 'components/ui/form/form-item';
import { FormLabel } from 'components/ui/form/form-label';
import { FormControl } from 'components/ui/form/form-control';
import { FormMessage } from 'components/ui/form/form-message';
import { Input } from 'components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'components/ui/card';
import { Alert, AlertDescription } from 'components/ui/alert';
import { useToast } from 'components/ui/use-toast';
import { loginUser } from 'lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError(null);
    
    try {
      await loginUser(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to Kingdom Runners!",
      });
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Kingdom Runners account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                label="Email"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="your@email.com"
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
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