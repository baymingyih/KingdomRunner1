"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50 text-red-700">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Error
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p>{error.message || 'An unexpected error occurred. Please try again later.'}</p>
      </CardContent>
    </Card>
  );
}
