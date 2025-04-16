import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className={cn(buttonVariants({ variant: 'default' }))}>
          Return Home
        </Link>
        <Link href="/events" className={cn(buttonVariants({ variant: 'outline' }))}>
          Browse Events
        </Link>
      </div>
    </div>
  )
}
