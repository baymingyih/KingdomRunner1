interface ErrorMessageProps {
  error: Error;
  className?: string;
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  let message = 'An unexpected error occurred';

  if (error instanceof Error) {
    if (error.message.includes('auth/invalid-credential')) {
      message = 'Invalid email or password';
    } else if (error.message.includes('permission-denied')) {
      message = 'You do not have permission to perform this action';
    } else {
      message = error.message;
    }
  }

  return (
    <div className={`text-red-500 text-sm ${className}`}>
      {message}
    </div>
  );
}